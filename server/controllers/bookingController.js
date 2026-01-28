import { db } from '../config/db.js';
import Joi from 'joi';

const bookingSchema = Joi.object({
    client_name: Joi.string().required(),
    client_phone: Joi.string().allow('', null),
    event_type: Joi.string().allow('', null),
    start_time: Joi.date().iso().required(),
    end_time: Joi.date().iso().min(Joi.ref('start_time')).required(),
    location: Joi.string().allow('', null),
    status: Joi.string().valid('Pending', 'Confirmed', 'Completed', 'Cancelled').default('Pending'),
    notes: Joi.string().allow('', null),
    equipment_ids: Joi.array().items(Joi.number()).default([])
});

// Helper to ensure date strings are used for SQLite comparisons
const toIsoString = (dateInput) => {
    return new Date(dateInput).toISOString();
};

export const getBookings = async (req, res) => {
    try {
        const bookings = await db.all('SELECT * FROM bookings WHERE user_id = ? ORDER BY start_time ASC', [req.user.id]);

        // Fetch equipment for each booking
        // This is N+1 but simple for now. Better to join or grouped fetch.
        // Doing grouped fetch for efficiency
        if (bookings.length > 0) {
            const bookingIds = bookings.map(b => b.id).join(',');
            const equipment = await db.all(`
                SELECT be.booking_id, e.*
                FROM booking_equipment be
                JOIN equipment e ON be.equipment_id = e.id
                WHERE be.booking_id IN (${bookingIds})
            `);

            bookings.forEach(b => {
                b.equipment = equipment.filter(e => e.booking_id === b.id);
            });
        }

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createBooking = async (req, res) => {
    try {
        const { error, value } = bookingSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const startTimeIso = toIsoString(value.start_time);
        const endTimeIso = toIsoString(value.end_time);

        // Conflict Detection: Check if assigned equipment is already booked in this timeframe
        if (value.equipment_ids && value.equipment_ids.length > 0) {
             const placeholders = value.equipment_ids.map(() => '?').join(',');

             const conflicts = await db.all(`
                SELECT b.id, b.client_name, e.name as equipment_name
                FROM bookings b
                JOIN booking_equipment be ON b.id = be.booking_id
                JOIN equipment e ON be.equipment_id = e.id
                WHERE be.equipment_id IN (${placeholders})
                AND b.status != 'Cancelled'
                AND (
                    (b.start_time <= ? AND b.end_time >= ?) OR
                    (b.start_time <= ? AND b.end_time >= ?) OR
                    (b.start_time >= ? AND b.end_time <= ?)
                )
             `, [...value.equipment_ids, endTimeIso, startTimeIso, startTimeIso, startTimeIso, startTimeIso, endTimeIso]);

             if (conflicts.length > 0) {
                 const conflictMsg = conflicts.map(c => `${c.equipment_name} is booked by ${c.client_name}`).join(', ');
                 return res.status(409).json({ error: `Equipment conflict: ${conflictMsg}` });
             }
        }

        const result = await db.run(
            `INSERT INTO bookings (user_id, client_name, client_phone, event_type, start_time, end_time, location, status, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [req.user.id, value.client_name, value.client_phone, value.event_type, startTimeIso, endTimeIso, value.location, value.status, value.notes]
        );

        const bookingId = result.lastID;

        if (value.equipment_ids && value.equipment_ids.length > 0) {
            for (const equipId of value.equipment_ids) {
                await db.run('INSERT INTO booking_equipment (booking_id, equipment_id) VALUES (?, ?)', [bookingId, equipId]);
            }
        }

        const newBooking = await db.get('SELECT * FROM bookings WHERE id = ?', [bookingId]);
        // Return with equipment (empty initially or what we just added)
        newBooking.equipment = value.equipment_ids; // Simplified for response
        res.status(201).json(newBooking);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const updateBooking = async (req, res) => {
    try {
        // Validation (partial allowed usually, but schema checks required)
        // Re-using strict schema for simplicity of update
        const { error, value } = bookingSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const booking = await db.get('SELECT * FROM bookings WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        const startTimeIso = toIsoString(value.start_time);
        const endTimeIso = toIsoString(value.end_time);

         // Conflict Detection (Excluding self)
         if (value.equipment_ids && value.equipment_ids.length > 0) {
            const placeholders = value.equipment_ids.map(() => '?').join(',');

            const conflicts = await db.all(`
               SELECT b.id, b.client_name, e.name as equipment_name
               FROM bookings b
               JOIN booking_equipment be ON b.id = be.booking_id
               JOIN equipment e ON be.equipment_id = e.id
               WHERE be.equipment_id IN (${placeholders})
               AND b.id != ?
               AND b.status != 'Cancelled'
               AND (
                   (b.start_time <= ? AND b.end_time >= ?) OR
                   (b.start_time <= ? AND b.end_time >= ?) OR
                   (b.start_time >= ? AND b.end_time <= ?)
               )
            `, [...value.equipment_ids, req.params.id, endTimeIso, startTimeIso, startTimeIso, startTimeIso, startTimeIso, endTimeIso]);

            if (conflicts.length > 0) {
                const conflictMsg = conflicts.map(c => `${c.equipment_name} is booked by ${c.client_name}`).join(', ');
                return res.status(409).json({ error: `Equipment conflict: ${conflictMsg}` });
            }
       }

        await db.run(
            `UPDATE bookings SET client_name = ?, client_phone = ?, event_type = ?, start_time = ?, end_time = ?, location = ?, status = ?, notes = ?
             WHERE id = ?`,
            [value.client_name, value.client_phone, value.event_type, startTimeIso, endTimeIso, value.location, value.status, value.notes, req.params.id]
        );

        // Update Equipment
        await db.run('DELETE FROM booking_equipment WHERE booking_id = ?', [req.params.id]);
        if (value.equipment_ids && value.equipment_ids.length > 0) {
            for (const equipId of value.equipment_ids) {
                await db.run('INSERT INTO booking_equipment (booking_id, equipment_id) VALUES (?, ?)', [req.params.id, equipId]);
            }
        }

        const updatedBooking = await db.get('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
        res.json(updatedBooking);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const result = await db.run('DELETE FROM bookings WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (result.changes === 0) return res.status(404).json({ error: 'Booking not found' });
        res.json({ message: 'Booking deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

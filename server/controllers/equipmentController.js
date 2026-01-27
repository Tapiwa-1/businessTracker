import { db } from '../config/db.js';
import Joi from 'joi';

const equipmentSchema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    serial_number: Joi.string().allow('', null),
    specs: Joi.string().allow('', null),
    price: Joi.number().min(0).allow(null),
    condition: Joi.string().valid('Good', 'Fair', 'Needs Repair', 'Broken').default('Good'),
    status: Joi.string().valid('Available', 'Booked', 'Out for hire', 'Under maintenance').default('Available'),
    image_url: Joi.string().allow('', null)
});

export const getEquipment = async (req, res) => {
    try {
        const equipment = await db.all('SELECT * FROM equipment WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createEquipment = async (req, res) => {
    try {
        const { error, value } = equipmentSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const result = await db.run(
            `INSERT INTO equipment (user_id, name, category, serial_number, specs, price, condition, status, image_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [req.user.id, value.name, value.category, value.serial_number, value.specs, value.price, value.condition, value.status, value.image_url]
        );

        const newItem = await db.get('SELECT * FROM equipment WHERE id = ?', [result.lastID]);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateEquipment = async (req, res) => {
    try {
        const { error, value } = equipmentSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const item = await db.get('SELECT * FROM equipment WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (!item) return res.status(404).json({ error: 'Equipment not found' });

        await db.run(
            `UPDATE equipment SET name = ?, category = ?, serial_number = ?, specs = ?, price = ?, condition = ?, status = ?, image_url = ?
             WHERE id = ?`,
            [value.name, value.category, value.serial_number, value.specs, value.price, value.condition, value.status, value.image_url, req.params.id]
        );

        const updatedItem = await db.get('SELECT * FROM equipment WHERE id = ?', [req.params.id]);
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteEquipment = async (req, res) => {
    try {
        const result = await db.run('DELETE FROM equipment WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (result.changes === 0) return res.status(404).json({ error: 'Equipment not found' });
        res.json({ message: 'Equipment deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

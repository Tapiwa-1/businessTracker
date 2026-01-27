import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import Joi from 'joi';

const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  password_confirmation: Joi.string().valid(Joi.ref('password')).required().messages({ 'any.only': 'Passwords do not match' })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  username: Joi.string().required(),
  current_password: Joi.string().allow('').optional(),
  password: Joi.string().min(6).optional(),
  password_confirmation: Joi.string().valid(Joi.ref('password')).when('password', { is: Joi.exist(), then: Joi.required(), otherwise: Joi.optional() }).messages({ 'any.only': 'Passwords do not match' })
});

export const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = {};
        error.details.forEach(detail => {
            const key = detail.path[0];
            if (!errors[key]) errors[key] = [];
            errors[key].push(detail.message);
        });
      return res.status(422).json({
        message: 'The given data was invalid.',
        errors
      });
    }

    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(422).json({
        message: 'The given data was invalid.',
        errors: {
          email: ['The email has already been taken.']
        }
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
    const userId = result.lastID;

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.status(201).json({
      access_token: token,
      token_type: 'Bearer',
      user: { id: userId, username, email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = {};
        error.details.forEach(detail => {
            const key = detail.path[0];
            if (!errors[key]) errors[key] = [];
            errors[key].push(detail.message);
        });
        return res.status(422).json({
            message: 'The given data was invalid.',
            errors
          });
    }

    const { email, password } = req.body;

    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({
          message: 'These credentials do not match our records.',
          errors: {
              email: ['These credentials do not match our records.']
          }
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            message: 'These credentials do not match our records.',
            errors: {
                email: ['These credentials do not match our records.']
            }
        });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.json({
      access_token: token,
      token_type: 'Bearer',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const me = async (req, res) => {
    try {
        const user = await db.get('SELECT id, username, email, created_at FROM users WHERE id = ?', [req.user.id]);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const logout = async (req, res) => {
    res.json({ message: 'Successfully logged out' });
};

export const updateProfile = async (req, res) => {
    try {
        const { error } = updateProfileSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                const key = detail.path[0];
                if (!errors[key]) errors[key] = [];
                errors[key].push(detail.message);
            });
            return res.status(422).json({
                message: 'The given data was invalid.',
                errors
            });
        }

        const { username, current_password, password } = req.body;
        const userId = req.user.id;

        const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);

        if (password) {
            // If changing password, must verify current password
            if (!current_password) {
                 return res.status(422).json({
                    message: 'The given data was invalid.',
                    errors: { current_password: ['Current password is required to set a new password.'] }
                });
            }
            const isMatch = await bcrypt.compare(current_password, user.password);
            if (!isMatch) {
                return res.status(422).json({
                    message: 'The given data was invalid.',
                    errors: { current_password: ['Current password is incorrect.'] }
                });
            }
             const salt = await bcrypt.genSalt(10);
             const hashedPassword = await bcrypt.hash(password, salt);
             await db.run('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, hashedPassword, userId]);
        } else {
             await db.run('UPDATE users SET username = ? WHERE id = ?', [username, userId]);
        }

        const updatedUser = await db.get('SELECT id, username, email, created_at FROM users WHERE id = ?', [userId]);
        res.json(updatedUser);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        await db.run('DELETE FROM users WHERE id = ?', [userId]);
        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

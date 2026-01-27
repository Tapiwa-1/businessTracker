import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import Joi from 'joi';

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        message: 'The given data was invalid.',
        errors: {
          [error.details[0].path[0]]: [error.details[0].message]
        }
      });
    }

    const { email, password } = req.body;

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

    const result = await db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    const userId = result.lastID;

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    // Laravel structure often returns the user and token
    res.status(201).json({
      access_token: token,
      token_type: 'Bearer',
      user: { id: userId, email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(422).json({
            message: 'The given data was invalid.',
            errors: {
              [error.details[0].path[0]]: [error.details[0].message]
            }
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
      user: { id: user.id, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const me = async (req, res) => {
    try {
        const user = await db.get('SELECT id, email, created_at FROM users WHERE id = ?', [req.user.id]);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const logout = async (req, res) => {
    // Since we are using stateless JWT, we can't really "invalidate" the token server-side without a blacklist.
    // However, the API endpoint allows the frontend to send a signal, and we return a success message.
    res.json({ message: 'Successfully logged out' });
};

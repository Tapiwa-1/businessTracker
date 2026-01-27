import db from '../config/db.js';
import Joi from 'joi';

const transactionSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').required(),
  date: Joi.date().iso().required(),
  amount: Joi.number().positive().required(),
  source: Joi.string().when('type', { is: 'income', then: Joi.required(), otherwise: Joi.optional() }),
  name: Joi.string().when('type', { is: 'expense', then: Joi.required(), otherwise: Joi.optional() }),
  comments: Joi.string().allow('').optional()
});

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await db.all('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC', [userId]);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addTransaction = async (req, res) => {
  try {
    const { error } = transactionSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const userId = req.user.id;
    const { type, date, amount, source, name, comments } = req.body;

    const result = await db.run(
      'INSERT INTO transactions (user_id, type, date, amount, source, name, comments) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, type, date, amount, source || null, name || null, comments || null]
    );

    res.status(201).json({ id: result.lastID, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

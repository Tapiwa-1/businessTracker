import express from 'express';
import { getTransactions, addTransaction } from '../controllers/transactionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getTransactions);
router.post('/', authenticateToken, addTransaction);

export default router;

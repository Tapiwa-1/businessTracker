import express from 'express';
import { getDashboardData } from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authenticateToken, getDashboardData);

export default router;

import express from 'express';
import { register, login, me, logout } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticateToken, me);
router.get('/me', authenticateToken, me); // Alias
router.post('/logout', authenticateToken, logout);

export default router;

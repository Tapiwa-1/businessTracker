import express from 'express';
import { register, login, me, logout, updateProfile, deleteAccount } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticateToken, me);
router.get('/me', authenticateToken, me);
router.post('/logout', authenticateToken, logout);
router.put('/user', authenticateToken, updateProfile);
router.delete('/user', authenticateToken, deleteAccount);

export default router;

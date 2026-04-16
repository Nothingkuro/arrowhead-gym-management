import { Router } from 'express';
import {
  getUsers,
  getProfile,
  updateProfile,
  updateUser,
} from '../controllers/profile.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Get all users (admin only)
router.get('/users', requireAuth, requireRole('ADMIN'), getUsers);

// Get current user profile
router.get('/profile', requireAuth, getProfile);

// Update own profile (username/password)
router.put('/profile', requireAuth, updateProfile);

// Update another user (admin only)
router.put('/users/:userId', requireAuth, requireRole('ADMIN'), updateUser);

export default router;

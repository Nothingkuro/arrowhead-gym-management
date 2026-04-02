import { Router } from 'express';
import { createMember, getMembers } from '../controllers/member.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);
router.get('/members', getMembers);
router.post('/members', createMember);

export default router;

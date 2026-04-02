import { Router } from 'express';
import { createMember, getMembers, updateMember } from '../controllers/member.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);
router.get('/members', getMembers);
router.post('/members', createMember);
router.patch('/members/:memberId', updateMember);

export default router;

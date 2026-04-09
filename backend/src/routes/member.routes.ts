import { Router } from 'express';
import {
	createMember,
	deactivateMember,
	getMembers,
	updateMember,
} from '../controllers/member.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);
router.get('/members', getMembers);
router.post('/members', createMember);
router.patch('/members/:memberId', updateMember);
router.patch('/members/:memberId/deactivate', deactivateMember);

export default router;

import { Router } from 'express';
import {
  createMembershipPlan,
  deleteMembershipPlan,
  getMembershipPlans,
  updateMembershipPlan,
} from '../controllers/membershipPlan.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/membership-plans', getMembershipPlans);
router.post('/membership-plans', requireRole('ADMIN'), createMembershipPlan);
router.put('/membership-plans/:planId', requireRole('ADMIN'), updateMembershipPlan);
router.delete('/membership-plans/:planId', requireRole('ADMIN'), deleteMembershipPlan);

export default router;
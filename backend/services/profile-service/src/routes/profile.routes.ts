import { Router } from 'express';
import profileController from '../controllers/profile.controller';

const router = Router();

// Get user profile
router.get('/:userId', profileController.getProfile.bind(profileController));

// Update complete profile
router.put('/:userId/complete', profileController.updateCompleteProfile.bind(profileController));
router.post('/:userId/complete', profileController.updateCompleteProfile.bind(profileController));

// Get profile completion status
router.get('/:userId/completion', profileController.getCompletionStatus.bind(profileController));

export default router;

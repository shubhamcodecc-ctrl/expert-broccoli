import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/profile', UserController.getProfile);
router.get('/preferences', UserController.getPreferences);
router.put('/preferences', UserController.updatePreferences);
router.post('/preferences/add-category', UserController.addCategory);
router.post('/preferences/block-channel', UserController.blockChannel);

export default router;

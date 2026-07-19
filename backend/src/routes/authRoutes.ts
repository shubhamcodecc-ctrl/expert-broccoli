import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateRegister, validateLogin, handleValidationErrors } from '../middleware/validation';

const router = Router();

router.post('/register', validateRegister, handleValidationErrors, AuthController.register);
router.post('/login', validateLogin, handleValidationErrors, AuthController.login);

export default router;

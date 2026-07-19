import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../middleware/auth';
import { AuthService } from '../services/authService';
import { AppError } from '../middleware/errorHandler';

export class AuthController {
  static async register(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;

      const result = await AuthService.register({
        email,
        password,
        name,
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login({
        email,
        password,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

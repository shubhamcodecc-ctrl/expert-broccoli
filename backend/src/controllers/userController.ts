import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../middleware/auth';
import { UserService } from '../services/userService';
import { AppError } from '../middleware/errorHandler';

export class UserController {
  static async getProfile(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      }

      const user = await UserService.getUserProfile(req.userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPreferences(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      }

      const preferences = await UserService.getPreferences(req.userId);

      res.status(200).json({
        success: true,
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePreferences(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      }

      const preferences = await UserService.updatePreferences(req.userId, req.body);

      res.status(200).json({
        success: true,
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addCategory(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      }

      const { category } = req.body;
      const preferences = await UserService.addCategory(req.userId, category);

      res.status(200).json({
        success: true,
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }

  static async blockChannel(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      }

      const { channelId } = req.body;
      const preferences = await UserService.blockChannel(req.userId, channelId);

      res.status(200).json({
        success: true,
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface IAuthRequest extends Request {
  userId?: string;
  user?: any;
}

export const authenticate = (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'No token provided',
          code: 'NO_TOKEN',
          statusCode: 401,
        },
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET as string) as any;
    req.userId = decoded.userId;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid token',
        code: 'INVALID_TOKEN',
        statusCode: 401,
      },
    });
  }
};

export const optionalAuth = (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.JWT_SECRET as string) as any;
      req.userId = decoded.userId;
      req.user = decoded;
    }
  } catch (error) {
    // Optional auth, so we don't throw error
  }

  next();
};

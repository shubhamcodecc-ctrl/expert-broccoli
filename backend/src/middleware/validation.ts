import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        details: errors.array(),
      },
    });
  }
  next();
};

export const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').optional().isString(),
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString(),
];

export const validateWatchLog = [
  body('videoId').isString(),
  body('watchedDuration').isInt({ min: 0 }),
  body('totalDuration').isInt({ min: 0 }),
  body('completionRate').isInt({ min: 0, max: 100 }),
];

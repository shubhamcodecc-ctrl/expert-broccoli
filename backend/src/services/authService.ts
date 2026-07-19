import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { config } from '../config';
import { AppError } from '../middleware/errorHandler';

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export class AuthService {
  /**
   * Register a new user
   */
  static async register(input: RegisterInput): Promise<AuthResponse> {
    const { email, password, name } = input;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists', 400, 'USER_EXISTS');
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      config.JWT_SECRET as string,
      { expiresIn: config.JWT_EXPIRE }
    );

    return {
      success: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    };
  }

  /**
   * Login user
   */
  static async login(input: LoginInput): Promise<AuthResponse> {
    const { email, password } = input;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      config.JWT_SECRET as string,
      { expiresIn: config.JWT_EXPIRE }
    );

    return {
      success: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    };
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string) {
    return jwt.verify(token, config.JWT_SECRET as string);
  }
}

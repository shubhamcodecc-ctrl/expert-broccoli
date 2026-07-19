import User, { IUser } from '../models/User';
import { AppError } from '../middleware/errorHandler';

export class UserService {
  /**
   * Get user profile
   */
  static async getUserProfile(userId: string) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    return user;
  }

  /**
   * Get user preferences
   */
  static async getPreferences(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    return user.preferences;
  }

  /**
   * Update user preferences
   */
  static async updatePreferences(
    userId: string,
    preferences: Partial<IUser['preferences']>
  ) {
    const user = await User.findByIdAndUpdate(
      userId,
      { preferences: { ...preferences } },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    return user.preferences;
  }

  /**
   * Add category to user preferences
   */
  static async addCategory(userId: string, category: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    if (!user.preferences.categories.includes(category)) {
      user.preferences.categories.push(category);
      await user.save();
    }

    return user.preferences;
  }

  /**
   * Block a channel
   */
  static async blockChannel(userId: string, channelId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    if (!user.preferences.blockedChannels.includes(channelId)) {
      user.preferences.blockedChannels.push(channelId);
      await user.save();
    }

    return user.preferences;
  }

  /**
   * Unblock a channel
   */
  static async unblockChannel(userId: string, channelId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    user.preferences.blockedChannels = user.preferences.blockedChannels.filter(
      (id) => id !== channelId
    );
    await user.save();

    return user.preferences;
  }
}

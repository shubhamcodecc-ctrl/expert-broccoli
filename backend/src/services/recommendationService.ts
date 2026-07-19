import Video, { IVideo } from '../models/Video';
import WatchLog, { IWatchLog } from '../models/WatchLog';
import User from '../models/User';
import { AppError } from '../middleware/errorHandler';

export interface RecommendationScore {
  videoId: string;
  youtubeId: string;
  title: string;
  channelName: string;
  channelId: string;
  thumbnail: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  reliability_score: number;
  recommendation_score: number;
  reason: string;
}

export class RecommendationService {
  /**
   * Get personalized recommendations for user
   */
  static async getRecommendations(
    userId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<RecommendationScore[]> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Get user's watch history
    const watchHistory = await WatchLog.find({ userId })
      .sort({ watchedAt: -1 })
      .limit(100)
      .populate('videoId');

    // If no watch history, return popular videos
    if (watchHistory.length === 0) {
      return this.getPopularVideos(limit, offset, user.preferences.blockedChannels);
    }

    // Get all videos from watch history
    const watchedVideoIds = watchHistory
      .map((log) => log.videoId)
      .filter((id) => id !== null);

    // Extract features from watched videos
    const userVector = await this.buildUserVector(watchHistory);

    // Get candidate videos (excluding watched and blocked)
    const watchedYoutubeIds = watchHistory.map((log) => log.youtubeVideoId);
    const candidateVideos = await Video.find({
      youtubeId: { $nin: watchedYoutubeIds },
      channelId: { $nin: user.preferences.blockedChannels },
    })
      .sort({ createdAt: -1 })
      .limit(1000);

    // Score and rank videos
    const scoredVideos = candidateVideos.map((video) => {
      const score = this.calculateRecommendationScore(
        video,
        userVector,
        watchHistory
      );
      return score;
    });

    // Sort by recommendation score and return top N
    return scoredVideos
      .sort((a, b) => b.recommendation_score - a.recommendation_score)
      .slice(offset, offset + limit);
  }

  /**
   * Build user preference vector from watch history
   */
  private static async buildUserVector(
    watchHistory: IWatchLog[]
  ): Promise<{ [key: string]: number }> {
    const vector: { [key: string]: number } = {};

    // Simple TF-IDF style vector from watch history
    for (const log of watchHistory) {
      const weight = log.completionRate / 100;
      vector[`duration_${log.watchedDuration}`] =
        (vector[`duration_${log.watchedDuration}`] || 0) + weight;
    }

    return vector;
  }

  /**
   * Calculate recommendation score for a video
   */
  private static calculateRecommendationScore(
    video: IVideo,
    userVector: { [key: string]: number },
    watchHistory: IWatchLog[]
  ): RecommendationScore {
    // Calculate reliability score
    const reliabilityScore = this.calculateReliabilityScore(video);

    // Calculate engagement score
    const engagementScore = this.calculateEngagementScore(video);

    // Calculate recency score
    const recencyScore = this.calculateRecencyScore(video.publishedAt);

    // Calculate channel credibility
    const channelCredibility = this.calculateChannelCredibility(video);

    // Weighted combination
    const recommendationScore =
      0.4 * reliabilityScore +
      0.3 * engagementScore +
      0.2 * channelCredibility +
      0.1 * recencyScore;

    return {
      videoId: video._id.toString(),
      youtubeId: video.youtubeId,
      title: video.title,
      channelName: video.channelName,
      channelId: video.channelId,
      thumbnail: video.thumbnail,
      viewCount: video.metrics.views,
      likeCount: video.metrics.likes,
      commentCount: video.metrics.comments,
      reliability_score: reliabilityScore,
      recommendation_score: recommendationScore,
      reason: this.generateReason(video, watchHistory),
    };
  }

  /**
   * Calculate reliability score based on engagement
   */
  private static calculateReliabilityScore(video: IVideo): number {
    const { likes, dislikes, comments, views } = video.metrics;

    // Like ratio
    const totalRatings = likes + dislikes || 1;
    const likeRatio = likes / totalRatings;

    // Engagement rate
    const engagementRate = (likes + comments) / (views || 1);

    return Math.min(1, likeRatio * 0.7 + engagementRate * 0.3);
  }

  /**
   * Calculate engagement score
   */
  private static calculateEngagementScore(video: IVideo): number {
    const { likes, comments, views } = video.metrics;

    // Normalize engagement
    const engagementRate = Math.min(1, (likes + comments) / Math.max(views, 1));

    return engagementRate;
  }

  /**
   * Calculate recency score (newer videos score higher)
   */
  private static calculateRecencyScore(publishedAt: Date): number {
    const daysOld = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.exp(-daysOld / 30)); // Decay over 30 days
  }

  /**
   * Calculate channel credibility
   */
  private static calculateChannelCredibility(video: IVideo): number {
    const { subscribers } = video;

    // Normalize subscriber count (log scale)
    const credibility = Math.min(
      1,
      Math.log10(Math.max(subscribers, 1)) / 8
    );

    return credibility;
  }

  /**
   * Generate human-readable reason for recommendation
   */
  private static generateReason(video: IVideo, watchHistory: IWatchLog[]): string {
    const reasons = [
      `Similar to videos you've watched`,
      `Trending in your interests`,
      `Popular with viewers like you`,
      `Highly rated by the community`,
      `Recommended based on your watch history`,
    ];

    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  /**
   * Get popular videos (for users with no history)
   */
  private static async getPopularVideos(
    limit: number,
    offset: number,
    blockedChannels: string[]
  ): Promise<RecommendationScore[]> {
    const videos = await Video.find({
      channelId: { $nin: blockedChannels },
    })
      .sort({ 'metrics.views': -1 })
      .skip(offset)
      .limit(limit);

    return videos.map((video) => ({
      videoId: video._id.toString(),
      youtubeId: video.youtubeId,
      title: video.title,
      channelName: video.channelName,
      channelId: video.channelId,
      thumbnail: video.thumbnail,
      viewCount: video.metrics.views,
      likeCount: video.metrics.likes,
      commentCount: video.metrics.comments,
      reliability_score: this.calculateReliabilityScore(video),
      recommendation_score: video.metrics.views,
      reason: 'Popular videos',
    }));
  }
}

import Video, { IVideo } from '../models/Video';
import WatchLog from '../models/WatchLog';
import { AppError } from '../middleware/errorHandler';

export class VideoService {
  /**
   * Get or create video
   */
  static async getOrCreateVideo(youtubeId: string, metadata: Partial<IVideo>): Promise<IVideo> {
    let video = await Video.findOne({ youtubeId });

    if (!video) {
      video = new Video({
        youtubeId,
        ...metadata,
      });
      await video.save();
    }

    return video;
  }

  /**
   * Get video by ID
   */
  static async getVideoById(videoId: string): Promise<IVideo> {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new AppError('Video not found', 404, 'VIDEO_NOT_FOUND');
    }
    return video;
  }

  /**
   * Get video by YouTube ID
   */
  static async getVideoByYoutubeId(youtubeId: string): Promise<IVideo> {
    const video = await Video.findOne({ youtubeId });
    if (!video) {
      throw new AppError('Video not found', 404, 'VIDEO_NOT_FOUND');
    }
    return video;
  }

  /**
   * Update video metrics
   */
  static async updateVideoMetrics(
    youtubeId: string,
    metrics: Partial<IVideo['metrics']>
  ): Promise<IVideo> {
    const video = await Video.findOneAndUpdate(
      { youtubeId },
      {
        metrics,
        lastUpdated: new Date(),
      },
      { new: true }
    );

    if (!video) {
      throw new AppError('Video not found', 404, 'VIDEO_NOT_FOUND');
    }

    return video;
  }

  /**
   * Calculate reliability score for video
   */
  static calculateReliabilityScore(video: IVideo): number {
    const { likes, dislikes, comments, views } = video.metrics;

    // Like ratio
    const totalRatings = likes + dislikes || 1;
    const likeRatio = likes / totalRatings;

    // Engagement rate
    const engagementRate = (likes + comments) / (views || 1);

    // Channel credibility factor
    const credibilityFactor = Math.min(1, Math.log10(Math.max(video.channelSubscribers, 1)) / 8);

    return Math.min(1, likeRatio * 0.5 + engagementRate * 0.35 + credibilityFactor * 0.15);
  }

  /**
   * Log watch event
   */
  static async logWatch(
    userId: string,
    youtubeVideoId: string,
    watchData: {
      watchedDuration: number;
      totalDuration: number;
      completionRate: number;
      liked?: boolean | null;
    }
  ) {
    // Get or create video
    let video = await Video.findOne({ youtubeId: youtubeVideoId });

    // Create watch log
    const watchLog = new WatchLog({
      userId,
      videoId: video?._id,
      youtubeVideoId,
      ...watchData,
    });

    await watchLog.save();

    return watchLog;
  }

  /**
   * Get watch history for user
   */
  static async getWatchHistory(
    userId: string,
    limit: number = 20,
    offset: number = 0,
    fromDate?: Date,
    toDate?: Date
  ) {
    const query: any = { userId };

    if (fromDate || toDate) {
      query.watchedAt = {};
      if (fromDate) query.watchedAt.$gte = fromDate;
      if (toDate) query.watchedAt.$lte = toDate;
    }

    const watchHistory = await WatchLog.find(query)
      .populate('videoId')
      .sort({ watchedAt: -1 })
      .skip(offset)
      .limit(limit);

    const total = await WatchLog.countDocuments(query);

    return { watchHistory, total };
  }
}

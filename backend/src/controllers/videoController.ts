import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../middleware/auth';
import { RecommendationService } from '../services/recommendationService';
import { VideoService } from '../services/videoService';
import { AppError } from '../middleware/errorHandler';

export class VideoController {
  static async getRecommendations(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      }

      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
      const offset = parseInt(req.query.offset as string) || 0;

      const recommendations = await RecommendationService.getRecommendations(
        req.userId,
        limit,
        offset
      );

      res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getVideoDetails(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { youtubeId } = req.params;

      const video = await VideoService.getVideoByYoutubeId(youtubeId);
      const reliabilityScore = VideoService.calculateReliabilityScore(video);

      res.status(200).json({
        success: true,
        data: {
          videoId: video.youtubeId,
          title: video.title,
          description: video.description,
          channelName: video.channelName,
          channelId: video.channelId,
          channelSubscribers: video.channelSubscribers,
          publishedAt: video.publishedAt,
          viewCount: video.metrics.views,
          likeCount: video.metrics.likes,
          commentCount: video.metrics.comments,
          duration: video.duration,
          reliability_score: reliabilityScore,
          url: `https://youtube.com/watch?v=${video.youtubeId}`,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getReliabilityScore(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { youtubeId } = req.params;

      const video = await VideoService.getVideoByYoutubeId(youtubeId);
      const reliabilityScore = VideoService.calculateReliabilityScore(video);

      res.status(200).json({
        success: true,
        data: {
          videoId: video.youtubeId,
          overallScore: reliabilityScore,
          components: {
            engagementScore: (video.metrics.likes + video.metrics.comments) / (video.metrics.views || 1),
            channelCredibility: Math.min(1, Math.log10(Math.max(video.channelSubscribers, 1)) / 8),
            likeDislikeRatio: video.metrics.likes / (video.metrics.likes + video.metrics.dislikes || 1),
            recencyScore: Math.max(0, Math.exp(-((Date.now() - video.publishedAt.getTime()) / (1000 * 60 * 60 * 24)) / 30)),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async logWatch(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      }

      const { videoId, watchedDuration, totalDuration, completionRate, liked } = req.body;

      const watchLog = await VideoService.logWatch(req.userId, videoId, {
        watchedDuration,
        totalDuration,
        completionRate,
        liked: liked || null,
      });

      res.status(201).json({
        success: true,
        data: watchLog,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getWatchHistory(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      }

      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = parseInt(req.query.offset as string) || 0;
      const fromDate = req.query.fromDate ? new Date(req.query.fromDate as string) : undefined;
      const toDate = req.query.toDate ? new Date(req.query.toDate as string) : undefined;

      const { watchHistory, total } = await VideoService.getWatchHistory(
        req.userId,
        limit,
        offset,
        fromDate,
        toDate
      );

      res.status(200).json({
        success: true,
        data: watchHistory,
        total,
      });
    } catch (error) {
      next(error);
    }
  }
}

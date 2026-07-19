import mongoose, { Schema, Document } from 'mongoose';

export interface IWatchLog extends Document {
  userId: mongoose.Types.ObjectId;
  videoId: mongoose.Types.ObjectId;
  youtubeVideoId: string;
  watchedAt: Date;
  watchedDuration: number;
  totalDuration: number;
  completionRate: number;
  liked: boolean | null;
}

const watchLogSchema = new Schema<IWatchLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
    },
    youtubeVideoId: {
      type: String,
      required: true,
    },
    watchedAt: {
      type: Date,
      default: Date.now,
    },
    watchedDuration: {
      type: Number,
      default: 0,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    completionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    liked: {
      type: Boolean,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

watchLogSchema.index({ userId: 1, watchedAt: -1 });
watchLogSchema.index({ youtubeVideoId: 1 });
watchLogSchema.index({ createdAt: -1 });

export default mongoose.model<IWatchLog>('WatchLog', watchLogSchema);

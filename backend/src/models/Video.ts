import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  youtubeId: string;
  title: string;
  description: string;
  channelId: string;
  channelName: string;
  channelSubscribers: number;
  publishedAt: Date;
  thumbnail: string;
  duration: string;
  metrics: {
    views: number;
    likes: number;
    dislikes: number;
    comments: number;
  };
  reliabilityScore: number;
  lastUpdated: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    youtubeId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    channelId: {
      type: String,
      required: true,
    },
    channelName: {
      type: String,
      required: true,
    },
    channelSubscribers: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: 'PT0S',
    },
    metrics: {
      views: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },
      dislikes: {
        type: Number,
        default: 0,
      },
      comments: {
        type: Number,
        default: 0,
      },
    },
    reliabilityScore: {
      type: Number,
      default: 0.5,
      min: 0,
      max: 1,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

videoSchema.index({ youtubeId: 1 });
videoSchema.index({ channelId: 1 });
videoSchema.index({ createdAt: -1 });

export default mongoose.model<IVideo>('Video', videoSchema);

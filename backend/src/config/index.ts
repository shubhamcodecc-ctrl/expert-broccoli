import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube-recommender',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  EXTENSION_API_KEY: process.env.EXTENSION_API_KEY || 'extension-api-key',
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || '',
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
};

export default config;

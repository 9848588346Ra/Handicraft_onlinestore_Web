import 'dotenv/config';

export const env = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/handicraft',
  JWT_SECRET: process.env.JWT_SECRET || 'handicraft-secret-change-in-production',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

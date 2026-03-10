import mongoose from 'mongoose';
import { env } from '../config/env.js';
import app from './app.js';
import { runSeed } from '../scripts/seed.js';

async function start() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('MongoDB connected');
    await runSeed();
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

start();

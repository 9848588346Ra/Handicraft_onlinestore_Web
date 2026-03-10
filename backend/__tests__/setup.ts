import mongoose from 'mongoose';
import { env } from '../config/env.js';

beforeAll(async () => {
  const uri = process.env.MONGODB_URI || env.MONGODB_URI;
  const testUri = uri.replace(/\/[^/?]*(\?|$)/, '/handicraft_test$1');
  await mongoose.connect(testUri);
});

afterAll(async () => {
  await mongoose.connection.close();
});

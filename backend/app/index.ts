import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import authRoutes from '../infrastructure/http/routes/auth.js';
import cartRoutes from '../infrastructure/http/routes/cart.js';
import ordersRoutes from '../infrastructure/http/routes/orders.js';
import productsRoutes from '../infrastructure/http/routes/products.js';
import { runSeed } from '../scripts/seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

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

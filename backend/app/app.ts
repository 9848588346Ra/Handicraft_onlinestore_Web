import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import authRoutes from '../infrastructure/http/routes/auth.js';
import cartRoutes from '../infrastructure/http/routes/cart.js';
import ordersRoutes from '../infrastructure/http/routes/orders.js';
import productsRoutes from '../infrastructure/http/routes/products.js';

const app = express();

app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

export default app;

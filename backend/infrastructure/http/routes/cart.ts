import { Router } from 'express';
import { Cart } from '../../database/CartModel.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) cart = await Cart.create({ userId: req.userId, items: [] });
    res.json({
      success: true,
      data: { items: cart.items },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get cart' });
  }
});

router.put('/', async (req: AuthRequest, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items array required' });
    }
    const cart = await Cart.findOneAndUpdate(
      { userId: req.userId },
      { items: items.filter((i: { productId: string; quantity: number }) => i.productId && i.quantity > 0) },
      { new: true, upsert: true }
    );
    res.json({
      success: true,
      data: { items: cart.items },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update cart' });
  }
});

router.delete('/', async (req: AuthRequest, res) => {
  try {
    await Cart.findOneAndUpdate({ userId: req.userId }, { items: [] });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
});

export default router;

import { Router } from 'express';
import { cartRepository } from '../../database/repositories/index.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const items = await cartRepository.findByUserId(req.userId!);
    res.json({
      success: true,
      data: { items },
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
    const filtered = items.filter((i: { productId: string; quantity: number }) => i.productId && i.quantity > 0);
    const result = await cartRepository.upsert(req.userId!, filtered);
    res.json({
      success: true,
      data: { items: result },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update cart' });
  }
});

router.delete('/', async (req: AuthRequest, res) => {
  try {
    await cartRepository.clear(req.userId!);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
});

export default router;

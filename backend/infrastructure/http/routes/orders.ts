import { Router } from 'express';
import { orderRepository } from '../../database/repositories/index.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { receiverName, phone, address, paymentMethod } = req.body;
    if (!receiverName || !phone || !address || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    const order = await orderRepository.create({
      userId: req.userId!,
      receiverName,
      phone,
      address,
      paymentMethod,
    });
    res.status(201).json({
      success: true,
      data: {
        order: {
          orderId: order.orderId,
          receiverName: order.receiverName,
          phone: order.phone,
          address: order.address,
          paymentMethod: order.paymentMethod,
          createdAt: order.createdAt,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

router.get('/', async (req: AuthRequest, res) => {
  try {
    const orders = await orderRepository.findByUserId(req.userId!);
    res.json({
      success: true,
      data: {
        orders: orders.map((o) => ({
          orderId: o.orderId,
          receiverName: o.receiverName,
          phone: o.phone,
          address: o.address,
          paymentMethod: o.paymentMethod,
          createdAt: o.createdAt,
        })),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get orders' });
  }
});

router.put('/:orderId', async (req: AuthRequest, res) => {
  try {
    const { orderId } = req.params;
    const { receiverName, phone, address, paymentMethod } = req.body;
    const order = await orderRepository.update(orderId, req.userId!, {
      receiverName,
      phone,
      address,
      paymentMethod,
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({
      success: true,
      data: {
        order: {
          orderId: order.orderId,
          receiverName: order.receiverName,
          phone: order.phone,
          address: order.address,
          paymentMethod: order.paymentMethod,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update order' });
  }
});

export default router;

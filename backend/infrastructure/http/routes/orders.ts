import { Router } from 'express';
import { Order } from '../../database/OrderModel.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

function generateOrderId() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';
  for (let i = 0; i < 14; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

router.use(authMiddleware);

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { receiverName, phone, address, paymentMethod } = req.body;
    if (!receiverName || !phone || !address || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    const orderId = generateOrderId();
    const order = await Order.create({
      orderId,
      userId: req.userId,
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
          createdAt: order.createdAt?.toISOString(),
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

router.get('/', async (req: AuthRequest, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: {
        orders: orders.map((o) => ({
          orderId: o.orderId,
          receiverName: o.receiverName,
          phone: o.phone,
          address: o.address,
          paymentMethod: o.paymentMethod,
          createdAt: o.createdAt?.toISOString(),
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
    const order = await Order.findOne({ orderId, userId: req.userId });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.receiverName = receiverName ?? order.receiverName;
    order.phone = phone ?? order.phone;
    order.address = address ?? order.address;
    order.paymentMethod = paymentMethod ?? order.paymentMethod;
    await order.save();
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

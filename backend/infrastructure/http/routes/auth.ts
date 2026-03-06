import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../database/UserModel.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { env } from '../../../config/env.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const user = await User.create({ name, email, password, phone: phone || '' });
    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      success: true,
      data: {
        user: { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone },
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      data: {
        user: { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone, role: user.role },
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

router.get('/me', authMiddleware, (req: AuthRequest, res) => {
  res.json({
    success: true,
    data: { user: req.user },
  });
});

export default router;

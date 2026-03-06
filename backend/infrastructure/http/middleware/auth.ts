import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env.js';
import { User } from '../../database/UserModel.js';

export interface AuthRequest extends Request {
  userId?: string;
  user?: { id: string; name: string; email: string; phone?: string; role?: string };
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    req.userId = user._id.toString();
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
    };
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin only' });
  }
  next();
}

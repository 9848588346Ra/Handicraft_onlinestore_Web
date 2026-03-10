import type { IOrderRepository } from '../../../application/ports/IOrderRepository.js';
import type { IOrder } from '../../../domain/entities/index.js';
import { Order } from '../OrderModel.js';

function toOrder(doc: { orderId: string; userId: { toString: () => string }; receiverName: string; phone: string; address: string; paymentMethod: string; createdAt?: Date }): IOrder {
  return {
    orderId: doc.orderId,
    userId: doc.userId.toString(),
    receiverName: doc.receiverName,
    phone: doc.phone,
    address: doc.address,
    paymentMethod: doc.paymentMethod,
    createdAt: doc.createdAt?.toISOString(),
  };
}

export const orderRepository: IOrderRepository = {
  async create(data: Omit<IOrder, 'orderId' | 'createdAt'>): Promise<IOrder> {
    const orderId = Array.from({ length: 14 }, () => '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 36)]).join('');
    const order = await Order.create({
      orderId,
      userId: data.userId,
      receiverName: data.receiverName,
      phone: data.phone,
      address: data.address,
      paymentMethod: data.paymentMethod,
    });
    return toOrder(order);
  },

  async findByUserId(userId: string): Promise<IOrder[]> {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return orders.map((o) => toOrder(o));
  },

  async findByOrderIdAndUserId(orderId: string, userId: string): Promise<IOrder | null> {
    const order = await Order.findOne({ orderId, userId });
    if (!order) return null;
    return toOrder(order);
  },

  async update(orderId: string, userId: string, data: Partial<Pick<IOrder, 'receiverName' | 'phone' | 'address' | 'paymentMethod'>>): Promise<IOrder | null> {
    const order = await Order.findOne({ orderId, userId });
    if (!order) return null;
    if (data.receiverName != null) order.receiverName = data.receiverName;
    if (data.phone != null) order.phone = data.phone;
    if (data.address != null) order.address = data.address;
    if (data.paymentMethod != null) order.paymentMethod = data.paymentMethod;
    await order.save();
    return toOrder(order);
  },
};

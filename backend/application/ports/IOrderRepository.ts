import type { IOrder } from '../../domain/entities/index.js';

export interface IOrderRepository {
  create(data: Omit<IOrder, 'orderId' | 'createdAt'>): Promise<IOrder>;
  findByUserId(userId: string): Promise<IOrder[]>;
  findByOrderIdAndUserId(orderId: string, userId: string): Promise<IOrder | null>;
  update(orderId: string, userId: string, data: Partial<Pick<IOrder, 'receiverName' | 'phone' | 'address' | 'paymentMethod'>>): Promise<IOrder | null>;
}

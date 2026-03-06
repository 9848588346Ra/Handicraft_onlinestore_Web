import type { Order } from '@/domain/entities';

export interface IOrderRepository {
  create(data: {
    receiverName: string;
    phone: string;
    address: string;
    paymentMethod: string;
  }): Promise<
    | { success: true; order: Order }
    | { success: false; message: string }
  >;
  getMy(): Promise<
    | { success: true; orders: Order[] }
    | { success: false; message: string }
  >;
  update(
    orderId: string,
    data: { receiverName: string; phone: string; address: string; paymentMethod: string }
  ): Promise<
    | { success: true; order: Order }
    | { success: false; message: string }
  >;
}

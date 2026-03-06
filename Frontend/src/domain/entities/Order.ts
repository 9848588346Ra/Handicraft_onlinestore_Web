/**
 * Domain entity: Order
 * Pure type - no framework dependencies
 */
export interface Order {
  orderId: string;
  receiverName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  createdAt?: string;
}

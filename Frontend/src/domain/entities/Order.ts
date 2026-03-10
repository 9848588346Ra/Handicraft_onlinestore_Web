export interface Order {
  orderId: string;
  receiverName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  createdAt?: string;
}

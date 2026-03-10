export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: 'user' | 'admin';
}

export interface IProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  longDescription?: string;
  image: string;
  tag?: string;
  inStock?: number;
}

export interface ICartItem {
  productId: string;
  quantity: number;
}

export interface IOrder {
  orderId: string;
  userId: string;
  receiverName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  createdAt?: string;
}

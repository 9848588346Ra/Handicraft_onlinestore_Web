import type { IAuthRepository, ICartRepository, IOrderRepository, IProductRepository } from '@/application/ports';
import type { CurrentUser } from '@/domain/entities';
import { request, setToken, clearToken, getToken, getApiBase } from './HttpClient';

const authApi: IAuthRepository = {
  async register(data) {
    const res = await request<{ user: { id: string; name: string; email: string; phone?: string }; token: string }>(
      'POST',
      '/api/auth/register',
      data
    );
    if (!res.success) return res;
    setToken(res.data.token);
    return {
      success: true as const,
      user: {
        name: res.data.user.name,
        email: res.data.user.email,
        phone: res.data.user.phone ?? '',
      },
    };
  },

  async login(email: string, password: string) {
    const res = await request<{ user: { id: string; name: string; email: string; phone?: string; role?: string }; token: string }>(
      'POST',
      '/api/auth/login',
      { email, password }
    );
    if (!res.success) return res;
    setToken(res.data.token);
    return {
      success: true as const,
      user: {
        name: res.data.user.name,
        email: res.data.user.email,
        phone: res.data.user.phone ?? '',
        role: res.data.user.role,
      },
    };
  },

  async me(): Promise<{ success: true; user: CurrentUser } | { success: false; message: string }> {
    const res = await request<{ user: { id: string; name: string; email: string; phone?: string; role?: string } }>(
      'GET',
      '/api/auth/me'
    );
    if (!res.success) return res;
    return {
      success: true,
      user: {
        name: res.data.user.name,
        email: res.data.user.email,
        phone: res.data.user.phone ?? '',
        role: res.data.user.role,
      },
    };
  },

  logout() {
    clearToken();
  },
};

const cartApi: ICartRepository = {
  async get() {
    const res = await request<{ items: { productId: string; quantity: number }[] }>('GET', '/api/cart');
    if (!res.success) return res;
    return { success: true, items: res.data.items ?? [] };
  },

  async set(items) {
    const res = await request<{ items: { productId: string; quantity: number }[] }>('PUT', '/api/cart', { items });
    if (!res.success) return res;
    return { success: true, items: res.data.items };
  },

  async clear() {
    return request('DELETE', '/api/cart');
  },
};

const orderApi: IOrderRepository = {
  async create(data) {
    const res = await request<{
      order: { orderId: string; receiverName: string; phone: string; address: string; paymentMethod: string; createdAt: string };
    }>('POST', '/api/orders', data);
    if (!res.success) return res;
    return {
      success: true as const,
      order: {
        orderId: res.data.order.orderId,
        receiverName: res.data.order.receiverName,
        phone: res.data.order.phone,
        address: res.data.order.address,
        paymentMethod: res.data.order.paymentMethod,
      },
    };
  },

  async getMy() {
    const res = await request<{
      orders: { orderId: string; receiverName: string; phone: string; address: string; paymentMethod: string; createdAt?: string }[];
    }>('GET', '/api/orders');
    if (!res.success) return res;
    return { success: true, orders: res.data.orders ?? [] };
  },

  async update(orderId: string, data) {
    const res = await request<{
      order: { orderId: string; receiverName: string; phone: string; address: string; paymentMethod: string };
    }>('PUT', `/api/orders/${encodeURIComponent(orderId)}`, data);
    if (!res.success) return res;
    return { success: true, order: res.data.order };
  },
};

const productApi: IProductRepository = {
  async getAll() {
    const res = await request<{ products: { id: string; name: string; price: number; image: string; category: string; description: string; longDescription?: string; tag?: string; inStock?: number }[] }>(
      'GET',
      '/api/products'
    );
    if (!res.success) return res;
    return { success: true, products: res.data.products ?? [] };
  },

  async getById(id: string) {
    const res = await request<{ product: { id: string; name: string; price: number; image: string; category: string; description: string; longDescription?: string; tag?: string; inStock?: number } }>(
      'GET',
      `/api/products/${encodeURIComponent(id)}`
    );
    if (!res.success) return res;
    return { success: true, product: res.data.product };
  },

  async create(formData: FormData) {
    const token = getToken();
    if (!token) return { success: false as const, message: 'Not authenticated' };
    const url = `${getApiBase()}/api/products`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return { success: false as const, message: json.message || res.statusText || 'Request failed' };
      return json as { success: true; message: string; data: { product: object } };
    } catch (err) {
      return { success: false as const, message: err instanceof Error ? err.message : 'Network error' };
    }
  },
};

export const api = {
  auth: authApi,
  cart: cartApi,
  orders: orderApi,
  products: productApi,
};

export { getToken, setToken, clearToken };

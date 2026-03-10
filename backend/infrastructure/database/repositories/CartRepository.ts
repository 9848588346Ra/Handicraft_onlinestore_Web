import type { ICartRepository } from '../../../application/ports/ICartRepository.js';
import type { ICartItem } from '../../../domain/entities/index.js';
import { Cart } from '../CartModel.js';

export const cartRepository: ICartRepository = {
  async findByUserId(userId: string): Promise<ICartItem[]> {
    const cart = await Cart.findOne({ userId });
    if (!cart) return [];
    return cart.items.map((i: { productId: string; quantity: number }) => ({ productId: i.productId, quantity: i.quantity }));
  },

  async upsert(userId: string, items: ICartItem[]): Promise<ICartItem[]> {
    const filtered = items.filter((i) => i.productId && i.quantity > 0);
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { items: filtered },
      { new: true, upsert: true }
    );
    return cart.items.map((i: { productId: string; quantity: number }) => ({ productId: i.productId, quantity: i.quantity }));
  },

  async clear(userId: string): Promise<void> {
    await Cart.findOneAndUpdate({ userId }, { items: [] });
  },
};

import type { ICartItem } from '../../domain/entities/index.js';

export interface ICartRepository {
  findByUserId(userId: string): Promise<ICartItem[]>;
  upsert(userId: string, items: ICartItem[]): Promise<ICartItem[]>;
  clear(userId: string): Promise<void>;
}

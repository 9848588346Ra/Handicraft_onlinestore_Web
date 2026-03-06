import type { CartItem } from '@/domain/entities';

export interface ICartRepository {
  get(): Promise<
    | { success: true; items: CartItem[] }
    | { success: false; message: string }
  >;
  set(items: CartItem[]): Promise<
    | { success: true; items: CartItem[] }
    | { success: false; message: string }
  >;
  clear(): Promise<{ success: true } | { success: false; message: string }>;
}

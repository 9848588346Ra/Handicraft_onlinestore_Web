import type { Product } from '@/domain/entities';

export interface IProductRepository {
  getAll(): Promise<
    | { success: true; products: Product[] }
    | { success: false; message: string }
  >;
  getById(id: string): Promise<
    | { success: true; product: Product }
    | { success: false; message: string }
  >;
  create(formData: FormData): Promise<
    | { success: true; message: string; data: { product: object } }
    | { success: false; message: string }
  >;
}

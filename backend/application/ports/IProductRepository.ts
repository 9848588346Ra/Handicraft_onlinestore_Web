import type { IProduct } from '../../domain/entities/index.js';

export interface IProductRepository {
  findAll(): Promise<IProduct[]>;
  findById(id: string): Promise<IProduct | null>;
  create(data: Omit<IProduct, 'id'>): Promise<IProduct>;
}

import type { IProductRepository } from '../../../application/ports/IProductRepository.js';
import type { IProduct } from '../../../domain/entities/index.js';
import { Product } from '../ProductModel.js';

function toProduct(doc: { _id: { toString: () => string }; name: string; price: number; category: string; description: string; longDescription?: string; image: string; tag?: string; inStock?: number }): IProduct {
  return {
    id: doc._id.toString(),
    name: doc.name,
    price: doc.price,
    category: doc.category,
    description: doc.description,
    longDescription: doc.longDescription ?? '',
    image: doc.image,
    tag: doc.tag ?? '',
    inStock: doc.inStock ?? 99,
  };
}

export const productRepository: IProductRepository = {
  async findAll(): Promise<IProduct[]> {
    const products = await Product.find();
    return products.map((p) => toProduct(p));
  },

  async findById(id: string): Promise<IProduct | null> {
    const product = await Product.findById(id);
    if (!product) return null;
    return toProduct(product);
  },

  async create(data: Omit<IProduct, 'id'>): Promise<IProduct> {
    const product = await Product.create({
      name: data.name,
      price: data.price,
      category: data.category,
      description: data.description,
      longDescription: data.longDescription ?? '',
      image: data.image,
      tag: data.tag ?? '',
      inStock: data.inStock ?? 99,
    });
    return toProduct(product);
  },
};

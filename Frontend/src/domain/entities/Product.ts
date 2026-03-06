/**
 * Domain entity: Product
 * Pure type - no framework dependencies
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  description: string;
  longDescription?: string;
  tag?: string;
  inStock?: number;
}

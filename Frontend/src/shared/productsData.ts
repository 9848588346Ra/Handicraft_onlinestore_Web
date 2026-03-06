import type { Product } from '@/domain/entities';

export type { Product };
export const PRODUCTS: Product[] = [
  { id: '1', name: 'Colorful Felt Ball Mat', price: 53, image: '/images/Ballmat.jpeg', category: 'Ball Mat', description: 'Handmade felt balls in assorted colors, perfect for décor or play. 100% natural wool.', longDescription: 'This vibrant felt ball mat is handcrafted by skilled artisans using 100% natural wool.', tag: '100% Pure', inStock: 21 },
  { id: '2', name: 'Handwoven Fabric Rolls', price: 56, image: '/images/Rugrool.jpeg', category: 'Fabric', description: 'Traditional woven textiles in multiple colors. Ideal for crafting and home projects.', longDescription: 'Our handwoven fabric rolls are made using traditional techniques.', inStock: 15 },
  { id: '3', name: 'Blue Felt Balls Set', price: 45, image: '/images/Rug.jpeg', category: 'Pump Ball', description: 'Soft felt balls, chemical-free and safe. Great for decorations or sensory play.', longDescription: 'A set of soft, chemical-free felt balls in calming blue tones.', tag: 'Chemical Free', inStock: 30 },
  { id: '4', name: 'Felt Slippers', price: 62, image: '/images/Shoes.jpeg', category: 'Shoes', description: 'Cozy handmade felt slippers. Comfortable and durable.', longDescription: 'These cozy felt slippers are handmade with care.', tag: 'Chemical Free', inStock: 12 },
  { id: '5', name: 'Woven Coaster Set', price: 38, image: '/images/RCoster.jpeg', category: 'Bowls', description: 'Eco-friendly woven coasters. Natural materials, thick and durable.', longDescription: 'Set of eco-friendly coasters made from natural fibers.', tag: '100% Pure', inStock: 25 },
  { id: '6', name: 'Leaf Purse', price: 72, image: '/images/LEafpurse.jpeg', category: 'Purses', description: 'Handcrafted leaf-shaped felt purse. Colorful and practical for everyday use.', longDescription: 'A charming leaf-shaped purse made from soft felt with traditional leaf motifs. Perfect for carrying essentials.', tag: 'Handmade', inStock: 8 },
  { id: '7', name: 'Angel Ornament', price: 48, image: '/images/angel.jpeg', category: 'Decorative', description: 'Handcrafted felt angel ornament. A lovely gift or home accent.', longDescription: 'Delicate handcrafted felt angel ornament.', tag: 'Handmade', inStock: 20 },
  { id: '8', name: 'Owl Pouch', price: 55, image: '/images/owl.jpg', category: 'Purses', description: 'Cute owl-shaped felt pouch. Practical and charming.', longDescription: 'A charming owl-shaped pouch made from soft felt.', inStock: 14 },
  { id: '9', name: 'Green Felt Hat', price: 68, image: '/images/GreeenHat.jpeg', category: 'Hat', description: 'Handmade felt hat with decorative trim. One of a kind.', longDescription: 'Handmade felt hat in a rich green, finished with decorative trim.', inStock: 10 },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getRelatedProducts(productId: string, category: string, limit = 3): Product[] {
  return PRODUCTS.filter((p) => p.id !== productId && p.category === category).slice(0, limit);
}

export function getRelatedProductsFallback(productId: string, limit = 3): Product[] {
  return PRODUCTS.filter((p) => p.id !== productId).slice(0, limit);
}

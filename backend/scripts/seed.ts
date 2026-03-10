import { Product } from '../infrastructure/database/ProductModel.js';
import { userRepository, productRepository } from '../infrastructure/database/repositories/index.js';

const INITIAL_PRODUCTS = [
  { name: 'Colorful Felt Ball Mat', price: 53, category: 'Ball Mat', description: 'Handmade felt balls in assorted colors.', longDescription: 'This vibrant felt ball mat is handcrafted by skilled artisans using 100% natural wool.', image: '/images/Ballmat.jpeg', tag: '100% Pure', inStock: 21 },
  { name: 'Handwoven Fabric Rolls', price: 56, category: 'Fabric', description: 'Traditional woven textiles in multiple colors.', longDescription: 'Our handwoven fabric rolls are made using traditional techniques.', image: '/images/Rugrool.webp', inStock: 15 },
  { name: 'Blue Felt Balls Set', price: 45, category: 'Pump Ball', description: 'Soft felt balls, chemical-free and safe.', longDescription: 'A set of soft, chemical-free felt balls in calming blue tones.', image: '/images/Rug.avif', tag: 'Chemical Free', inStock: 30 },
  { name: 'Felt Slippers', price: 62, category: 'Shoes', description: 'Cozy handmade felt slippers.', longDescription: 'These cozy felt slippers are handmade with care.', image: '/images/Shoes.webp', tag: 'Chemical Free', inStock: 12 },
  { name: 'Woven Coaster Set', price: 38, category: 'Bowls', description: 'Eco-friendly woven coasters.', longDescription: 'Set of eco-friendly coasters made from natural fibers.', image: '/images/RCoster.webp', tag: '100% Pure', inStock: 25 },
  { name: 'Patterned Woven Fabric', price: 72, category: 'Fabric', description: 'Colorful patterned fabric with traditional design.', longDescription: 'Stunning patterned fabric featuring traditional motifs.', image: '/images/LEafpurse.webp', inStock: 8 },
  { name: 'Angel Ornament', price: 48, category: 'Decorative', description: 'Handcrafted felt angel ornament.', longDescription: 'Delicate handcrafted felt angel ornament.', image: '/images/angel.webp', tag: 'Handmade', inStock: 20 },
  { name: 'Owl Pouch', price: 55, category: 'Purses', description: 'Cute owl-shaped felt pouch.', longDescription: 'A charming owl-shaped pouch made from soft felt.', image: '/images/owl.jpg', inStock: 14 },
  { name: 'Green Felt Hat', price: 68, category: 'Hat', description: 'Handmade felt hat with decorative trim.', longDescription: 'Handmade felt hat in a rich green, finished with decorative trim.', image: '/images/GreeenHat.webp', inStock: 10 },
];

export async function runSeed() {
  const adminExists = await userRepository.findByEmail('rajkarki123@gmail.com');
  if (!adminExists) {
    await userRepository.create({
      name: 'Admin',
      email: 'rajkarki123@gmail.com',
      password: '123456',
      role: 'admin',
    });
    console.log('Admin user created (rajkarki123@gmail.com / 123456)');
  }

  const products = await productRepository.findAll();
  if (products.length === 0) {
    await Product.insertMany(INITIAL_PRODUCTS);
    console.log('Initial products seeded');
  }
}

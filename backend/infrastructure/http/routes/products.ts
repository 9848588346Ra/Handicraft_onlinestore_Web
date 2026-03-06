import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { Product } from '../../database/ProductModel.js';
import { authMiddleware, adminOnly, AuthRequest } from '../middleware/auth.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      data: {
        products: products.map((p) => ({
          id: p._id.toString(),
          name: p.name,
          price: p.price,
          image: p.image,
          category: p.category,
          description: p.description,
          longDescription: p.longDescription,
          tag: p.tag,
          inStock: p.inStock,
        })),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({
      success: true,
      data: {
        product: {
          id: product._id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          description: product.description,
          longDescription: product.longDescription,
          tag: product.tag,
          inStock: product.inStock,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Product not found' });
  }
});

router.post('/', authMiddleware, adminOnly, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    const { name, price, category, description, longDescription, tag, image } = req.body;
    let imagePath = image;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }
    if (!name || !price || !category || !description || !imagePath) {
      return res.status(400).json({ success: false, message: 'Name, price, category, description, and image required' });
    }
    const product = await Product.create({
      name,
      price: Number(price),
      category,
      description,
      longDescription: longDescription || '',
      image: imagePath,
      tag: tag || '',
    });
    res.status(201).json({
      success: true,
      message: 'Product added',
      data: { product: { id: product._id.toString() } },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add product' });
  }
});

export default router;

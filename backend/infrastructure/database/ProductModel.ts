import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String, default: '' },
  image: { type: String, required: true },
  tag: { type: String, default: '' },
  inStock: { type: Number, default: 99 },
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);

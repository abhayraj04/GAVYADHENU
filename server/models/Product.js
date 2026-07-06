import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  category: String,
  subCategory: String,
  brand: { type: String, default: 'Gavyadhenu' },
  price: { type: Number, required: true },
  mrp: Number,
  stock: { type: Number, default: 0 },
  unit: String,
  images: [String],
  badges: [String],
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  isBestSeller: { type: Boolean, default: false },
  isNewLaunch: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isCombo: { type: Boolean, default: false },
  benefits: [String],
  ingredients: [String],
  sourceInfo: String,
  processingMethod: String
}, { timestamps: true });

productSchema.pre('save', function() {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-5);
  }
});

export default mongoose.model('Product', productSchema);

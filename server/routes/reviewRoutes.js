import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const review = await Review.create({ user: req.user._id, product: req.body.productId, rating: req.body.rating, comment: req.body.comment });
    const reviews = await Review.find({ product: req.body.productId });
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(req.body.productId, { rating: avg.toFixed(1), reviewCount: reviews.length });
    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: error.message || 'Failed to create review' });
  }
});

router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch reviews' });
  }
});

export default router;

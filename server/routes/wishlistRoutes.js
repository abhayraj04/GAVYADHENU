import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ products: user.wishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch wishlist' });
  }
});

router.post('/add', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.wishlist.map(id => id.toString()).includes(req.body.productId)) user.wishlist.push(req.body.productId);
    await user.save();
    res.json({ message: 'Added to wishlist' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: error.message || 'Failed to add to wishlist' });
  }
});

router.delete('/remove/:productId', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
    await user.save();
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: error.message || 'Failed to remove from wishlist' });
  }
});

export default router;

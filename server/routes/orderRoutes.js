import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
const router = express.Router();

router.use(protect);

router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const orderItems = [];
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      orderItems.push({ product: product._id, name: product.name, quantity: item.quantity, price: product.price });
      totalAmount += product.price * item.quantity;
    }
    const rewardCoinsEarned = Math.floor(totalAmount / 100);
    const order = await Order.create({ user: req.user._id, items: orderItems, shippingAddress, paymentMethod, totalAmount, rewardCoinsEarned });
    await User.findByIdAndUpdate(req.user._id, { $inc: { rewardCoins: rewardCoinsEarned } });
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message || 'Failed to create order' });
  }
});

router.get('/my-orders', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch orders' });
  }
});

export default router;

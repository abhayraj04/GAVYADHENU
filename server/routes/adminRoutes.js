import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import { createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();
router.use(protect, admin);

router.get('/dashboard', async (req, res) => {
  try {
    const products = await Product.countDocuments();
    const users = await User.countDocuments({ role: 'user' });
    const orders = await Order.countDocuments();
    const revenueData = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]);
    res.json({ products, users, orders, revenue: revenueData[0]?.total || 0 });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch dashboard data' });
  }
});

router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch orders' });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.orderStatus }, { new: true });
    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: error.message || 'Failed to update order status' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch users' });
  }
});

router.get('/coupons', async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch coupons' });
  }
});

router.post('/coupons', async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ message: error.message || 'Failed to create coupon' });
  }
});

export default router;

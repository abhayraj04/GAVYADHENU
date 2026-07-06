import express from 'express';
import Coupon from '../models/Coupon.js';
const router = express.Router();

router.post('/apply', async (req, res) => {
  try {
    const { code, totalAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
    if (!coupon || coupon.expiryDate < new Date() || totalAmount < coupon.minOrderAmount) {
      return res.status(400).json({ message: 'Invalid coupon' });
    }
    let discountAmount = coupon.discountType === 'percentage' ? totalAmount * coupon.discountValue / 100 : coupon.discountValue;
    discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    res.json({ discountAmount });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({ message: error.message || 'Failed to apply coupon' });
  }
});

export default router;

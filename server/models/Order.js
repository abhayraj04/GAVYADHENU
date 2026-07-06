import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    price: Number
  }],
  shippingAddress: Object,
  paymentMethod: { type: String, enum: ['COD', 'Razorpay'], default: 'COD' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  orderStatus: { type: String, enum: ['Placed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'], default: 'Placed' },
  couponDiscount: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  rewardCoinsEarned: { type: Number, default: 0 },
  totalAmount: Number
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);

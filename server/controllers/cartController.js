import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const populatedCart = (userId) => Cart.findOne({ user: userId }).populate('items.product');

export const getCart = async (req, res) => {
  try {
    let cart = await populatedCart(req.user._id);
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    cart = await populatedCart(req.user._id);
    res.json(cart || { items: [] });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch cart' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    const item = cart.items.find(i => i.product.toString() === productId);
    if (item) item.quantity += Number(quantity);
    else cart.items.push({ product: productId, quantity, price: product.price });
    await cart.save();
    res.json(await populatedCart(req.user._id));
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: error.message || 'Failed to add to cart' });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    const item = cart.items.find(i => i.product.toString() === productId);
    if (item) item.quantity = Math.max(1, Number(quantity));
    await cart.save();
    res.json(await populatedCart(req.user._id));
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: error.message || 'Failed to update cart' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    res.json(await populatedCart(req.user._id));
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: error.message || 'Failed to remove from cart' });
  }
};

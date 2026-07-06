import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const { keyword, category, featured } = req.query;
    const filter = {};
    if (keyword) filter.name = { $regex: keyword, $options: 'i' };
    if (category) filter.category = { $regex: `^${category}$`, $options: 'i' };
    if (featured === 'true' || featured === true || featured === '1') filter.isFeatured = true;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch products' });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (req.user) {
      // Optional: recently viewed can be implemented here
    }
    res.json(product);
  } catch (error) {
    console.error('Get product by slug error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch product' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: error.message || 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: error.message || 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: error.message || 'Failed to delete product' });
  }
};

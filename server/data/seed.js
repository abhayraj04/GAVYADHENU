import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

dotenv.config();
await connectDB();

await User.deleteMany();
await Product.deleteMany();
await Coupon.deleteMany();
await Cart.deleteMany();
await Order.deleteMany();
await Review.deleteMany();

await User.create({
  name: 'Gavyadhenu Admin',
  email: 'admin@gavyadhenu.com',
  phone: '9999999999',
  password: 'admin123',
  role: 'admin'
});
const baseUrl = process.env.SERVER_URL || 'http://localhost:5000';

const products = [
  { name:'Gavyadhenu Desi Ghee - Bilona Method', description:'Traditional A2 Gir cow milk ghee made by bilona churning for authentic wellness.', category:'Ghee', price:999, mrp:1199, stock:60, unit:'500ml', images:['/uploads/products/ghee.jpg'], badges:['Best Seller'], isFeatured:true, isBestSeller:true, benefits:['Rich aroma','Authentic taste','Natural nourishment'], ingredients:['A2 Gir cow milk fat'] },
  { name:'Gavyadhenu Cold Pressed Groundnut Oil', description:'Fresh cold pressed groundnut oil for healthy Indian cooking.', category:'Cold Pressed Oils', price:349, mrp:449, stock:80, unit:'1L', images:[`${baseUrl}/uploads/products/groundnut_oil.jpg`], badges:['Cold Pressed'], isFeatured:true, benefits:['Natural flavour','Baby-safe','No chemicals'] },
  { name:'Gavyadhenu Wild Forest Honey', description:'Pure honey sourced from forest blossoms for natural sweetness.', category:'Honey', price:449, mrp:599, stock:50, unit:'500g', images:[`${baseUrl}/uploads/products/honey.jpg`], badges:['Pure'], isFeatured:true, benefits:['No added sugar','Health support','Natural antioxidants'] },
  { name:'Gavyadhenu MP Sharbati Wheat Flour', description:'Stone-milled MP Sharbati flour for soft, nutritious rotis.', category:'Organic Atta', price:299, mrp:369, stock:90, unit:'1kg', images:[`${baseUrl}/uploads/products/wheat_flour.jpg`], badges:['Organic'], isFeatured:true, benefits:['High fiber','Freshly milled','Rich nutrition'] },
  { name:'Gavyadhenu Pure & Natural Sattu Powder', description:'Roasted chana sattu powder for cooling energy and digestion.', category:'Superfoods', price:329, mrp:399, stock:90, unit:'500g', images:[`${baseUrl}/uploads/products/sattu_powder.jpg`], badges:['Nutrition'], isFeatured:true, benefits:['Protein rich','Gut health','No additives'] },
  { name:'Gavyadhenu Himalayan Roasted Makhana', description:'Crunchy roasted makhana with Himalayan pink salt for wholesome snacking.', category:'Dry Fruits', price:399, mrp:499, stock:70, unit:'200g', images:[`${baseUrl}/uploads/products/makhana.jpg`], badges:['Healthy Snack'], benefits:['Low calorie','High protein','Gluten free'] },
  { name:'Gavyadhenu Herbal Chyawanprash', description:'Ayurvedic herbal chyawanprash for immunity and vitality.', category:'Herbal Products', price:459, mrp:559, stock:60, unit:'450g', images:[`${baseUrl}/uploads/products/chyawanprash.jpg`], badges:['Immunity'], benefits:['Herbal nourishment','Daily wellness','Natural herbs'] },
  { name:'Gavyadhenu Immunity Booster Combo', description:'Combo with honey, ghee and herbal mix to support immunity.', category:'Combos', price:1299, mrp:1599, stock:40, unit:'Pack of 3', images:[`${baseUrl}/uploads/products/immunity_combo.jpg`], badges:['Combo'], isCombo:true, benefits:['Value pack','Immunity support','Family share'] },
  { name:'Gavyadhenu Immunity Tea Mix', description:'Herbal immunity tea mix with tulsi, ginger and spices.', category:'Immunity Boosters', price:299, mrp:349, stock:80, unit:'200g', images:[`${baseUrl}/uploads/products/immunity_tea.jpg`], badges:['Warm & Healthy'], benefits:['Natural defense','Calming tea','Daily wellness'] },
  { name:'Gavyadhenu Red Chilli Powder', description:'Deep red chilli powder for authentic Indian flavors.', category:'Spices', price:199, mrp:249, stock:90, unit:'200g', images:[`${baseUrl}/uploads/products/red_chilli.jpg`], badges:['Spice'], benefits:['Bold heat','Fresh aroma','Pure ingredients'] }
];

for (const product of products) {
  await Product.create(product);
}

await Coupon.create({
  code: 'PURE20',
  discountType: 'percentage',
  discountValue: 20,
  minOrderAmount: 500,
  maxDiscount: 300,
  expiryDate: new Date(Date.now() + 1000*60*60*24*90),
  isActive: true
});

console.log('Gavyadhenu sample data inserted');
process.exit();

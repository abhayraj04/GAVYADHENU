# Gavyadhenu MERN Project - Setup & Run Guide

## ✅ Installation Complete

All dependencies have been successfully installed for both the client and server.

### 📦 Installed Packages

#### Client (React + Vite)
- React 18+
- React Router DOM
- Axios
- Vite
- Lucide React Icons

#### Server (Node.js + Express)
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Bcryptjs (Password Hashing)
- Razorpay (Payment Gateway)
- Nodemailer (Email)
- CORS & Morgan (Middleware)
- Slugify
- Nodemon (Development)

---

## 🚀 How to Run the Project

### Prerequisites
1. **MongoDB** should be running locally on `mongodb://127.0.0.1:27017` or update MONGO_URI in `.env`
2. **Node.js** and **npm** should be installed

### Step 1: Start the Server

```bash
cd server
npm run dev
# or
npm start
```

Server will run on: `http://localhost:5000`

### Step 2: Start the Client (in a new terminal)

```bash
cd client
npm run dev
```

Client will run on: `http://localhost:5173`

### Step 3: Seed Database (Optional - for sample data)

```bash
cd server
npm run seed
```

This creates:
- Admin user: `admin@gavyadhenu.com` / `admin123`
- 10 sample products
- Sample coupon: `PURE20` (20% off)

---

## ⚙️ Environment Configuration

### Server (.env)
Located at: `server/.env`

Key variables:
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `CLIENT_URL` - Frontend URL for CORS
- `JWT_SECRET` - Secret for JWT tokens
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` - Payment gateway credentials
- `EMAIL_USER` & `EMAIL_PASSWORD` - Email configuration

### Client (.env)
Located at: `client/.env`

Key variables:
- `VITE_API_URL` - API endpoint (default: http://localhost:5000/api)

---

## 📊 Available Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `DELETE /api/cart/:id` - Remove from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order

### Admin
- `GET /api/admin/products` - Manage products
- `GET /api/admin/orders` - View all orders
- `GET /api/admin/users` - Manage users

---

## 🛠️ Build for Production

### Build Client
```bash
cd client
npm run build
# Output: client/dist/
```

### Run Server in Production
```bash
cd server
npm start
# Set NODE_ENV=production in .env
```

---

## 📝 Notes

- Make sure MongoDB is running before starting the server
- Update Razorpay and email credentials in `.env` for payments and emails
- JWT_SECRET should be a strong, unique string in production
- CORS is configured to allow requests from `CLIENT_URL`

---

## 🔒 Security Tips for Production

1. Change `JWT_SECRET` to a strong random string
2. Use environment variables for all sensitive data
3. Enable HTTPS
4. Set `NODE_ENV=production`
5. Use proper database backups
6. Implement rate limiting
7. Add input validation and sanitization

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check `MONGO_URI` in server/.env

### Port Already in Use
- Change PORT in server/.env
- Change Vite port for client: `npm run dev -- --port 3000`

### CORS Errors
- Update `CLIENT_URL` in server/.env to match your client URL

### Missing Dependencies
- Run `npm install` in both client and server folders again

---

✨ **Project is ready to use!**

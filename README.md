# Gavyadhenu – Organic Food E-Commerce Platform Using MERN Stack

Gavyadhenu is a full-stack organic food e-commerce website inspired by premium natural product stores.  
It includes customer shopping features, admin management features, product catalog, cart, wishlist, coupon system, reviews, and order management.

## Tech Stack
Frontend: React + Vite, React Router DOM, Axios  
Backend: Node.js, Express.js, MongoDB, Mongoose  
Authentication: JWT + Bcrypt  
Payment: Razorpay placeholder route included  
Styling: Custom CSS

## Main Features
### Customer
- Register/Login
- Product browsing
- Product search and category filter
- Product details
- Cart
- Wishlist
- Apply coupon
- Place order
- My orders
- Reviews and ratings
- Recently viewed products UI section
- Blog/recipe page

### Admin
- Admin dashboard
- Add/Edit/Delete products
- Manage orders
- Manage users
- Manage coupons
- Sales overview placeholder

## Deployment Notes
This project is prepared for Git-based deployment with a root workspace setup and production build scripts. For deployments that host both the API and the frontend together, the server will serve the built Vite client from the client/dist folder when NODE_ENV=production is set.

### Environment Variables
Set these in your deployment platform:
- PORT
- NODE_ENV=production
- MONGO_URI
- JWT_SECRET
- CLIENT_URL or FRONTEND_URL

## How to Run

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
npm run seed
npm run dev
```

### 2. Frontend
```bash
cd client
npm install
npm run dev
```

## Default Admin Login
Email: admin@gavyadhenu.com  
Password: admin123

## Backend URL
http://localhost:5000

## Frontend URL
http://localhost:5173

## Project Title for Report
Gavyadhenu: Organic Food E-Commerce Platform Using MERN Stack

## Note
Use your own logo/images before final submission.

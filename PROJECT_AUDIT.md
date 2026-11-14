# GAVYADHENU — COMPREHENSIVE COMMERCIAL-GRADE E-COMMERCE AUDIT (PHASE 1)
**Date:** November 13, 2026  
**Auditor:** Senior MERN Stack Architect & E-Commerce Lead  
**Repository:** [abhayraj04/GAVYADHENU](https://github.com/abhayraj04/GAVYADHENU)  
**Baseline Git Commit:** `a94cecc`

---

## EXECUTIVE SUMMARY

Gavyadhenu is a premium organic dairy and farmstead e-commerce platform rooted in Vedic traditions and purity standards. An exhaustive architectural, security, and feature-by-feature code audit was conducted on the repository to assess its commercial readiness. 

While the platform boasts a rich visual storefront, responsive design, custom luxury product packaging renders, and an extensive AI toolset (Dhenu agricultural companion, Crop Doctor, Pashu Care livestock manager), the fundamental e-commerce pillars—specifically **real backend customer authentication, MongoDB database persistence, live Razorpay webhook/signature verification, and true multi-step checkout state**—currently rely on developer sandbox simulations, OAuth placeholders, or in-memory array stores.

This audit classifies all components against rigorous commercial standards:
- **1. Fully Functional:** Verified operational end-to-end with tests and real logic.
- **2. Partially Functional:** Core logic exists but lacks production persistence, verification, or edge-case handling.
- **3. UI Only / Non-Functional:** Interface rendered, but backed by mock actions, placeholders, or simulated states.
- **4. Missing:** Essential commercial functionality not yet implemented.
- **5. Broken:** Code or flow that fails during execution or violates core specifications.

---

## 1. ARCHITECTURAL & SUBSYSTEM AUDIT

### 1.1 Frontend Architecture & Routing
- **Framework:** React 19 (`react: ^19.2.1`), Vite 5, TypeScript 5.9, Tailwind CSS v4, Radix UI primitives.
- **Routing:** Lightweight client-side routing via `wouter` (`Route`, `Switch` in `client/src/App.tsx`).
- **State Management:** `@tanstack/react-query` v5 coordinating with `@trpc/react-query` v11, local React states, Contexts (`ThemeContext`, `LanguageContext`).
- **Storefront Components:** 
  - `Storefront.tsx`: Hero banner, product catalog grid, quick-view modal, price-filter pills, category filters, "Our Vision" section, back-to-top floating button, mobile navigation drawer.
  - `ProductDetails.tsx`: Detail view with quantity selection, breadcrumbs, specifications, related recommendations, and review cards.
  - `Portal.tsx`: Shared multi-role portal rendering Customer, Seller, and Admin workspaces.
  - `Checkout.tsx`: Address selection and payment method selector.
- **Classification:** **Partially Functional** (Storefront and routing work smoothly, but routing lacks declarative customer/admin route-guards against unauthorized URL navigation; relies on client-side role fallback).

### 1.2 Backend Architecture & API Routes
- **Framework:** Express 4 (`express: ^4.21.2`) on Node.js with `tsx` runner.
- **API Paradigm:** Hybrid tRPC v11 (`server/routers.ts`) with supplementary REST endpoints (`server/rest.ts`, `server/_core/index.ts`).
- **Procedures:** `publicProcedure`, `protectedProcedure`, `adminProcedure`, `sellerProcedure`.
- **Classification:** **Partially Functional** (tRPC routers are structured cleanly with Zod schema validation; however, authentication context injection relies on mock OpenID cookies or OAuth callback, and backend mutations write to in-memory fallback stores rather than a dedicated persistent MongoDB instance).

### 1.3 Database Connectivity & Schema Persistence
- **Current State:** The repository contains a Drizzle ORM schema defined for MySQL (`drizzle/schema.ts`) and an extensive in-memory state engine in `server/db.ts` (`inMemoryStore`) that populates upon process boot.
- **User Requirement:** Commercial deployment requires MongoDB as the primary persistent document database for Users, Products, Categories, Orders, Carts, Reviews, and Coupons.
- **Classification:** **UI Only / Non-Functional (Persistence-wise)** (In-memory storage resets on server restarts; actual MongoDB connection strings and Mongoose/native MongoDB persistence adapters are missing).

### 1.4 Authentication Implementation
- **Current Mechanism:** 
  - `devLogin` mutation in `server/routers.ts` (sets cookies for `demo_customer_rahul`, `demo_seller_giramrit`, `demo_admin_kartik`).
  - Skeleton OAuth initiation via `startLogin()`.
- **Missing Commercial Features:**
  - Real email/password registration with bcrypt password hashing.
  - Mobile number validation (+91 standard).
  - Email verification token generation, expiration, and verification endpoint.
  - Secure password reset flow (forgot password, one-time cryptographically secure token, expiry, password update).
  - Session invalidation on password change or logout.
- **Classification:** **UI Only / Non-Functional** (Relies on sandbox persona switching and mock cookies; no customer registration or secure credential storage exists).

### 1.5 Product & Category Management
- **Catalog:** 17 authentic organic products across categories: Desi Cow Ghee, A2 Ghee, Natural Oils, Organic Spices, Healthy Snacks, Farm Grains, Traditional Foods, and Sustainable Living.
- **Inventory & Pricing:** Stored in catalog records with MRP, sale price, stock count, and seller linkage.
- **Status Workflow:** Products support `draft`, `pending_approval`, `approved`, `rejected`, `out_of_stock`.
- **Classification:** **Partially Functional** (Public browsing and seller submission flows exist in memory; admin approval updates in-memory array, but changes do not persist to MongoDB or survive process restarts).

### 1.6 Product Images & Visual Assets
- **Asset Status:** 
  - 13 products feature custom 1:1 photorealistic Gavyadhenu packaging renders in `client/public/products/` with consistent gold-fluted caps, amber glass jars, and heritage labeling.
  - 4 products (`mp-sharbati-wheat-flour`, `quiet-morning-brew`, `coconut-scrubber`, `pashu-starter-pack`) currently use authentic unbranded real photography.
- **Missing Features:**
  - Multi-image gallery per product (e.g. nutrition table, back label, unboxed harvest view).
  - Interactive image zoom on hover/touch on `ProductDetails.tsx`.
  - Reusable `<ProductImage />` component with skeleton placeholders and fallback error handling.
- **Classification:** **Partially Functional** (High-quality primary hero renders exist; multi-image zoom and unified fallback component missing).

### 1.7 Shopping Cart & Checkout
- **Cart Mechanism:** `carts` table/store keyed by `userId` and `productId`. Supports add, quantity update, remove, and subtotal calculation.
- **Delivery Calculation:** Rule-based (free shipping over ₹999; ₹79 standard delivery below ₹999).
- **Checkout Process:** Single-page step-like view in `client/src/pages/Checkout.tsx`.
- **Deficiencies:**
  - Cart is strictly server-bound; guest visitors have no localStorage fallback cart before logging in.
  - Stock validation does not perform atomic check-and-decrement at checkout confirmation.
  - Coupon application engine is absent from the checkout interface.
- **Classification:** **Partially Functional** (Add/remove works for authenticated users, but guest cart, checkout coupon discounts, and atomic inventory locks are missing).

### 1.8 Payment Functionality
- **Cash on Delivery (COD):** Functional in-memory; creates order with `paymentStatus: "pending"`.
- **Razorpay Integration:**
  - Payment options display "Razorpay-ready online payment".
  - Backend schema has `payments` table with `providerOrderId`, `providerPaymentId`.
  - **Critical Flaw:** Frontend does not load the Razorpay checkout script (`https://checkout.razorpay.com/v1/checkout.js`), does not trigger the Razorpay modal with `order_id`, and does not verify HMAC-SHA256 signatures (`razorpay_signature`) via backend webhook or return callback.
- **Classification:** **UI Only / Non-Functional** (Razorpay option directly creates an unverified order without opening the Razorpay payment gateway).

### 1.9 Order Management & Lifecycle
- **Statuses Supported:** `placed`, `confirmed`, `processing`, `shipped`, `out_for_delivery`, `delivered`, `cancelled`, `returned`, `refund_initiated`, `refunded`.
- **Capabilities:**
  - Customer order history with timeline tracking.
  - Order cancellation mutation (`cancelCustomerOrder`).
  - Invoice display and printable view in customer portal.
- **Deficiencies:**
  - No automated transactional email notifications (order confirmation, shipping dispatch, cancellation receipt).
  - No customer return-request initiation form.
  - Inventory restoration on cancellation is performed in memory only.
- **Classification:** **Partially Functional** (Lifecycle states and tracking UI work in memory; lacking email dispatch, formal return request flow, and persistent inventory adjustment).

### 1.10 Admin & Seller Dashboards
- **Admin Workspace (`Portal.tsx?role=admin`):**
  - Executive Business Intelligence panels (`BusinessIntelligencePanels.tsx`): GMV, conversion rate, return rate, category share charts, repeat purchase analysis.
  - Seller verification queue (approve/reject partners).
  - Product catalog queue (approve/reject seller listings).
- **Seller Workspace (`Portal.tsx?role=seller`):**
  - Store profile manager, listing creator, order fulfillment manager with status dropdown.
- **Deficiencies:**
  - Admin access is switchable via client-side persona button without password or MFA protection.
  - CSV export for sales reports and tax summaries is missing.
  - Customer management (view/suspend accounts) is missing from admin interface.
- **Classification:** **Partially Functional** (Rich analytics and moderation UI exist, but lack persistent MongoDB data, CSV exports, customer management, and strict admin login guards).

### 1.11 Testing & Quality Assurance
- **Test Runner:** Vitest v2.1.9 (`vitest run`).
- **Suites:** 11 test files, 41 passing unit/integration tests across AI modules, multilingual engine, pashu care, catalog filtering, and authorization middleware.
- **Deficiencies:**
  - No end-to-end integration tests for customer registration, email verification, and password reset.
  - No test suite for Razorpay payment signature verification.
  - No tests for atomic inventory decrement during concurrent checkout.
- **Classification:** **Partially Functional** (High test pass rate for isolated features, but end-to-end commerce flows lack coverage).

### 1.12 Security, Headers & Vulnerabilities
- **Environment Management:** Centralized in `server/_core/env.ts` with Zod validation.
- **Vulnerabilities Identified:**
  1. *Unauthenticated Persona Switching:* `devLogin` procedure in `server/routers.ts` allows any client to obtain admin or seller session without credentials.
  2. *Payment Bypass:* Orders can be placed with `paymentMethod: "razorpay"` without gateway authorization.
  3. *Missing Security Headers:* Express application lacks `helmet` for CSP, X-Frame-Options, and HSTS headers.
  4. *Rate Limiting:* No `express-rate-limit` on login, registration, or password reset endpoints.
  5. *In-Memory Session Leaks:* OpenID cookie manipulation without cryptographic signature verification.
- **Classification:** **Broken / High Risk** (Must be hardened before public release).

### 1.13 Deployment & Production Configuration
- **Build Scripts:** `vite build` for client; `esbuild server/_core/index.ts --platform=node` for server.
- **Docker:** No multi-stage `Dockerfile` or `docker-compose.yml` for unified frontend, backend, and MongoDB containerization.
- **Process Management:** Missing health check endpoints (`/healthz`, `/readyz`).
- **Classification:** **Missing** (Production containerization and health probes not yet configured).

---

## 2. DETAILED FEATURE CLASSIFICATION MATRIX

| Feature Area | Specific Capability | Status Classification | Notes & Action Required |
|---|---|---|---|
| **Auth** | Customer Registration (Name, Email, Phone, Password) | **Missing** | Implement bcrypt hashing, Zod validation, duplicate check in MongoDB. |
| **Auth** | Email Verification with Expirable Tokens | **Missing** | Implement crypto token generator, email mailer, and verification route. |
| **Auth** | Customer Login & Session JWT/Cookie | **Partially Functional** | Convert from devLogin persona to signed JWT httpOnly cookies. |
| **Auth** | Password Visibility Toggle & Validation | **UI Only** | Wire to real form state with live feedback. |
| **Auth** | Forgot / Reset Password Flow | **Missing** | Implement reset token model, nodemailer transporter, and reset page. |
| **Auth** | Role-Based Route Protection | **Partially Functional** | Enforce at both tRPC middleware and React Router level. |
| **Product** | 1:1 Consistent Packaging Images | **Partially Functional** | 13/17 luxury packaging renders complete; remaining 4 need high-res assets. |
| **Product** | Multi-Image Gallery & Zoom | **Missing** | Build `<ProductImageGallery />` with thumbnail selector and lens zoom. |
| **Product** | Image Fallback & Lazy Loading | **Missing** | Build unified `<ProductImage />` component with blur hash/skeleton. |
| **Catalog** | Search with Instant Suggestions | **Partially Functional** | Search works in memory; needs debounced autocomplete dropdown. |
| **Catalog** | Price & Category Filtering | **Fully Functional** | Clean interactive pills and slider implemented in storefront. |
| **Cart** | Add / Remove / Update Quantity | **Fully Functional** | Instant reactive updates in header basket drawer. |
| **Cart** | Guest Cart Persistence | **Missing** | Sync localStorage cart into MongoDB upon customer login. |
| **Cart** | Coupon Code Engine | **UI Only** | Build coupon validation API (percentage & flat discounts). |
| **Checkout** | Multi-step Checkout Flow | **Partially Functional** | Address selection works; missing distinct Step 1 -> Step 5 wizard. |
| **Payment** | Cash On Delivery (COD) | **Fully Functional** | Generates placed order with COD terms. |
| **Payment** | Razorpay Gateway Modal & Signature Verification | **Broken** | Requires Razorpay SDK, order creation endpoint, and HMAC verification. |
| **Orders** | Unique Order ID & Lifecycle Tracking | **Fully Functional** | Visual tracking timeline with date stamps. |
| **Orders** | PDF / Printable Invoice | **Fully Functional** | Clean invoice generator rendered in customer order view. |
| **Orders** | Customer Cancellation & Return Request | **Partially Functional** | Cancellation works; return request form with reason missing. |
| **Admin** | Revenue & Sales Analytics (BI) | **Partially Functional** | Rich charts exist; data is calculated from in-memory records. |
| **Admin** | Product Approval / Rejection Workflow | **Fully Functional** | Instant state update with badge indicators. |
| **Admin** | Seller Verification Workflow | **Fully Functional** | Review KYC and GST details before granting seller privileges. |
| **Admin** | Customer Management & Ban/Unban | **Missing** | Add customer list table with order totals and status toggles. |
| **Admin** | Export Reports to CSV | **Missing** | Add one-click export for orders, inventory, and revenue. |
| **Security** | Rate Limiting & Helmet Headers | **Missing** | Add `helmet` and `express-rate-limit` to Express pipeline. |
| **Database**| Persistent MongoDB Storage | **Missing** | Connect Mongoose/MongoDB, create schemas, migrate catalog data. |

---

## 3. PHASED IMPLEMENTATION ROADMAP (PHASES 2 – 12)

### Phase 2: Premium Product Image System & Assets
- Build reusable `<ProductImage />` with loading skeleton, error fallback, and WebP format support.
- Build `<ProductImageGallery />` with thumbnail selection and lens magnification zoom.
- Curate consistent high-res photography for remaining 4 products (`mp-sharbati-wheat-flour`, `quiet-morning-brew`, `coconut-scrubber`, `pashu-starter-pack`).

### Phase 3: Real MongoDB Database Layer
- Install and configure Mongoose (`mongoose: ^8.x`).
- Implement schemas: `User`, `Product`, `Order`, `Cart`, `Review`, `Coupon`, `Address`, `AuditLog`.
- Seed initial catalog and categories into MongoDB with high-fidelity assets.
- Integrate MongoDB adapter seamlessly into `server/db.ts` maintaining tRPC procedure compatibility.

### Phase 4: Production Authentication & Security Hardening
- Implement customer registration API with bcrypt password hashing (`bcryptjs: ^2.4.3`) and phone validation.
- Implement customer login with JWT / secure signed httpOnly cookies.
- Build email verification and forgot/reset password token flows.
- Add `helmet` security headers, CORS origin locking, and rate limiting on sensitive auth endpoints.
- Restrict `devLogin` exclusively to non-production environments with strict flag.

### Phase 5: Customer Account & Shopping Experience
- Build guest-to-customer cart migration upon login.
- Implement coupon code system (`GAVYA10`, `SHUDDH50`) with minimum cart value validation.
- Implement interactive product reviews and ratings with verified purchase badge.
- Implement customer return request flow with photo upload and reason selection.

### Phase 6: Commercial Razorpay Integration
- Integrate official `razorpay` Node.js SDK on backend.
- Create `/api/payment/razorpay/create-order` endpoint.
- Embed Razorpay Checkout script on frontend with options (name, description, theme `#2d5a27`, prefill user phone/email).
- Implement `/api/payment/razorpay/verify` with cryptographic HMAC-SHA256 signature check.
- Handle success, failure, dismissal, and refund statuses cleanly.

### Phase 7: Advanced Admin & Operations Dashboard
- Wire all BI charts directly to MongoDB aggregation pipelines.
- Implement Customer Management view (list, order count, total spent, suspend/activate).
- Add CSV export utilities for Orders, Sales, and Low Stock alerts.
- Restrict admin panel with mandatory password re-authentication.

### Phase 8: Comprehensive Verification & Production Readiness
- Write automated Vitest suites covering registration, authentication, cart discount, and Razorpay signature verification.
- Verify 100% TypeScript compilation (`tsc --noEmit`).
- Verify responsive layout across mobile (375px), tablet (768px), laptop (1280px), and 4K displays.
- Prepare Docker configuration and health check probes.

---

## 4. SIGN-OFF & APPROVAL GATE

Per strict operational rules, **no code will be pushed to GitHub until all phases are implemented, comprehensively tested, verified, and explicitly approved by the user.**

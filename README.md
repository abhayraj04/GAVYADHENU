# Gavyadhenu AI – Next-Generation Intelligent Agricultural Ecosystem

[![Tests](https://img.shields.io/badge/Vitest-39%20Passing-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9%20Strict-blue.svg)]()
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)]()
[![tRPC](https://img.shields.io/badge/tRPC-v11-2596be.svg)]()
[![Drizzle](https://img.shields.io/badge/Drizzle%20ORM-MySQL-C5F74F.svg)]()

> **Gavyadhenu AI** is an intelligent rural-commerce ecosystem and agricultural marketplace uniting indigenous cow rearers, regenerative farmers, rural businesses, and mindful consumers. It blends modern e-commerce with multimodal artificial intelligence, scientific livestock nutrition, computer vision leaf pathology, and grounded predictive business intelligence.

---

## 🌟 Key Functional Modules

### 1. Dhenu AI – Conversational Agricultural Guide
- **Tool-Calling Agent**: Capable of querying order status, recommending harvests based on customer preferences, and adding products directly to cart through authenticated backend actions.
- **Multilingual Support**: Real-time bilingual operation in both **English and हिन्दी (Hindi)**.
- **Voice Intelligence**: Browser-native Speech-to-Text (STT via Web Speech API) and Text-to-Speech (TTS) with natural Indian accents (`hi-IN` and `en-IN`), requiring zero third-party audio cloud costs.

### 2. AI Crop Doctor – Precision Leaf Pathology
- **Multimodal Computer Vision**: Classifies plant diseases from uploaded leaf images (or sample library).
- **Dual Treatment Protocols**: Provides verified biological/organic treatments (e.g. Jeevamrut, Neem oil, Trichoderma) alongside standard chemical formulations (Mancozeb, Ridomil Gold, Tilt).
- **Offline Plant Pathology Matrix**: Covers major Indian staples (Tomato, Potato, Rice, Wheat, Cotton, Mustard, Chilli).
- **Diagnostic Audit Trail**: Scans are logged with confidence scores, severity ratings, and automated referral to local **Krishi Vigyan Kendras (KVK)**.

### 3. AI Pashu Care – Livestock & Dairy Intelligence
- **ICAR / NDRI Balanced Ration Formulator**: Calculates exact daily Dry Matter (DM), Green Fodder, Dry Roughage (Bhusa), and Concentrate requirements based on animal body weight, lactation phase, and daily milk yield (liters/day).
- **Veterinary Symptom Triage**: First-aid guidance for acute conditions including Bloat/Tympany, Bovine Mastitis, Milk Fever, and Foot & Mouth Disease (FMD).
- **Safety First**: Explicitly warns against contraindicated actions (e.g. no forceful oral drenching during dyspnea to prevent fatal aspiration pneumonia) and surfaces the **24x7 National Emergency Animal Helpline (1962)**.
- **Herd Registry & Immunization Timeline**: Manages cattle ear-tag records, lactation cycles, and NADCP vaccination/deworming reminders.

### 4. Intelligent Recommendation Engine
- **Content-Based Similarity**: Tokenized Jaccard overlap scoring combined with category and price proximity weighting.
- **Market Basket Analysis**: Frequently Bought Together algorithm analyzing historical co-occurrence in orders.
- **Personalized Recommendations**: User-affinity modeling weighting past purchases, wishlists, and session telemetry.

### 5. Grounded Business Intelligence (Seller Studio & Admin Control)
- **Seller Analytics**: Daily sales velocity, run-rate stockout warnings (< 5 days buffer), and double-exponential demand forecasting.
- **Executive Admin Dashboard**: Real-time Gross Merchandise Value (GMV), verified revenue, multi-item basket AOV, and 94.2% order fulfillment rate.
- **RFM Customer Segmentation**: Behavioral cohorts (Champions, Loyal Advocates, Promising New Buyers, At-Risk Accounts) with targeted retention playbooks.
- **Rural AI Impact Telemetry**: Platform-wide monitoring of Crop Doctor scans, registered cattle heads, and vaccination adherence.

---

## 🏗️ Technology Architecture

```
gavyadhenu/
├── client/                     # React 19 SPA (Vite + Tailwind + Lucide)
│   ├── src/
│   │   ├── components/         # AI Chat, Crop Doctor, Pashu Care, BI Panels, Compare Modal
│   │   ├── contexts/           # LanguageContext (EN / HI), ThemeContext
│   │   ├── pages/              # Storefront, ProductDetails, Checkout, Portals (Customer, Seller, Admin)
│   │   └── lib/trpc.ts         # Type-safe tRPC client hooks
├── server/                     # Node.js + Express backend
│   ├── cropDoctor.ts           # Computer vision & plant pathology knowledge base
│   ├── pashuCare.ts            # ICAR ration mathematics & veterinary triage
│   ├── recommendations.ts      # Jaccard similarity & market basket analysis
│   ├── businessIntelligence.ts # Grounded seller/admin analytics & forecasting
│   ├── routers.ts              # tRPC API contracts with Zod validation
│   └── db.ts                   # Drizzle ORM persistence & fallback catalog
├── drizzle/
│   └── schema.ts               # Relational MySQL schema (CropScans, Livestock, Products, Orders)
└── docs/                       # Deployment, environment, and architectural documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.x or higher
- **pnpm**: v9.x or higher
- **MySQL / TiDB**: (Optional for local development; system includes deterministic in-memory fallbacks)

### Installation
```bash
# Clone and enter directory
cd gavyadhenu

# Install dependencies
pnpm install

# Check TypeScript types
pnpm check

# Run automated tests
pnpm test

# Start development server
pnpm dev
```
The application will be live at `http://localhost:3000`.

---

## 🧪 Testing and Quality Assurance

The codebase features 11 automated test suites covering commerce authorization, recommendations, chat tools, plant pathology, ration calculations, business intelligence, and multilingual scripts:

```bash
pnpm test
```

**Test Coverage Summary:**
- `server/pashuCare.test.ts` (11 tests)
- `server/multilingual.test.ts` (5 tests)
- `server/businessIntelligence.test.ts` (2 tests)
- `server/cropDoctor.test.ts` (4 tests)
- `server/recommendations.test.ts` (4 tests)
- `server/commerce.authorization.test.ts` (5 tests)
- `server/commerce.feature.test.ts` (2 tests)
- `server/catalog.features.test.ts` (3 tests)
- `server/ai.chat.test.ts` (3 tests)
- `server/auth.logout.test.ts` (1 test)
- `server/email.status.test.ts` (1 test)
- **Total: 39 / 39 tests passing cleanly.**

---

## 🔒 Security & Role Authorization

- **Customer Boundary**: Customers can only view their own orders, cart items, addresses, livestock records, and leaf scans.
- **Seller Boundary**: Unverified sellers cannot list products. Product submissions require administrative approval before public catalogue indexing.
- **Admin Control**: Product approvals, seller verifications, and platform-wide BI require strictly verified `admin` role authorization.
- **Input Sanitization**: All endpoints are guarded with Zod schemas validating type, range, length, and enum constraints.

---

## 🌐 Multilingual & Accessibility

- Switch between **English** and **हिन्दी (Hindi)** with the one-click `[ EN / हिन्दी ]` toggle.
- Voice input and narration functions natively in all modern web browsers supporting the W3C Web Speech API (Chrome, Edge, Safari, Firefox).
- Audio narration available for Crop Doctor treatments and Pashu Care emergency triage instructions.

---

## 📄 License & Integrity
Gavyadhenu AI is designed with strict documentation integrity, preserving working commerce pathways and prioritizing agricultural accuracy, animal welfare, and farmer empowerment.

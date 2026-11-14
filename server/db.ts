import { and, asc, desc, eq, gt, gte, inArray, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  addresses,
  auditLogs,
  carts,
  cropScans,
  InsertUser,
  livestockHealthLogs,
  livestockRecords,
  notifications,
  orderItems,
  orders,
  payments,
  products,
  productViews,
  reviews,
  sellerProfiles,
  users,
  wishlistItems,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

export const fallbackProducts = [
  {
    product: {
      id: 1,
      sellerId: 1,
      name: "Bilona A2 Vedic Cow Ghee",
      slug: "bilona-a2-ghee",
      description: "Traditional curd-churned A2 Gir cow ghee crafted using the ancient Bilona method in clay pots over slow cow-dung fire. Rich in natural carotenoids, A2 beta-casein, and butyric acid.",
      category: "Kitchen",
      brand: "Gavyadhenu Heritage",
      sku: "GD-GHEE-500",
      imageUrl: "/products/bilona-a2-ghee.jpg",
      price: "899.00",
      mrp: "1099.00",
      stock: 48,
      status: "approved" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    seller: { storeName: "Gir Amrit Organic Sanctuary", userId: 1 },
  },
  {
    product: {
      id: 2,
      sellerId: 1,
      name: "Farmstead Roasted Makhana",
      slug: "farmstead-makhana",
      description: "Naturally grown, slow-roasted lotus seeds cultivated in clean wetland ponds. High in plant protein, zero trans fats, and light on the stomach.",
      category: "Kitchen",
      brand: "Gavyadhenu Farms",
      sku: "GD-MAKH-250",
      imageUrl: "/products/farmstead-makhana.jpg",
      price: "349.00",
      mrp: "425.00",
      stock: 65,
      status: "approved" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    seller: { storeName: "Mithila Lotus Collective", userId: 1 },
  },
  {
    product: {
      id: 3,
      sellerId: 1,
      name: "Golden Lakadong Haldi Ritual",
      slug: "golden-haldi-ritual",
      description: "Authentic high-curcumin (7.5%+) Lakadong turmeric powder organically cultivated in the Jaintia Hills. Tested for purity and free from artificial colorants.",
      category: "Wellness",
      brand: "Gavyadhenu Wellness",
      sku: "GD-HALD-100",
      imageUrl: "/products/lakadong-turmeric-front.jpg",
      price: "299.00",
      mrp: "349.00",
      stock: 55,
      status: "approved" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    seller: { storeName: "Meghalaya Hills Cooperative", userId: 1 },
  },
  {
    product: {
      id: 4,
      sellerId: 1,
      name: "Raw Wildflower Forest Honey",
      slug: "wildflower-honey",
      description: "Unpasteurized, unprocessed multi-floral forest nectar harvested with sustainable bee-friendly practices from deep deciduous forests.",
      category: "Kitchen",
      brand: "Gavyadhenu Forest",
      sku: "GD-HNY-250",
      imageUrl: "/products/wildflower-honey.jpg",
      price: "549.00",
      mrp: "649.00",
      stock: 35,
      status: "approved" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    seller: { storeName: "Satpura Forest Collective", userId: 1 },
  },
  {
    product: {
      id: 5,
      sellerId: 1,
      name: "Natural Earthen Aromatherapy Candle",
      slug: "earthen-home-candle",
      description: "Hand-poured pure soy wax candle in an artisan terracotta bowl with pure cedarwood and vetiver essential oils. Non-toxic clean burning.",
      category: "Home & Living",
      brand: "Gavyadhenu Earth",
      sku: "GD-CNDL-180",
      imageUrl: "/products/earthen-candle.jpg",
      price: "799.00",
      mrp: "899.00",
      stock: 22,
      status: "approved" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    seller: { storeName: "Kumbhar Pottery Artisans", userId: 1 },
  },
  {
    product: {
      id: 6,
      sellerId: 1,
      name: "Pashu Raksha Herbal Starter Pack",
      slug: "farm-care-starter",
      description: "All-in-one organic livestock health kit: herbal wound spray, organic mineral-salt lick block, and neem-turmeric antiseptic balm for cattle.",
      category: "Farm & Soil",
      brand: "Gavyadhenu Pashu",
      sku: "GD-CARE-001",
      imageUrl: "/products/pashu-starter-pack.jpg",
      price: "649.00",
      mrp: "799.00",
      stock: 30,
      status: "approved" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    seller: { storeName: "Gavyadhenu Partner Farms", userId: 1 },
  },
  {
    product: {
      id: 7,
      sellerId: 1,
      name: "Quiet Morning Herbal Tulsi Brew",
      slug: "quiet-morning-brew",
      description: "A calming caffeine-free blend of Krishna Tulsi, Rama Tulsi, Vana Tulsi, and green cardamom for respiratory strength and metabolic balance.",
      category: "Wellness",
      brand: "Gavyadhenu Wellness",
      sku: "GD-BREW-040",
      imageUrl: "/products/quiet-morning-brew.jpg",
      price: "449.00",
      mrp: "549.00",
      stock: 40,
      status: "approved" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    seller: { storeName: "Vrindavan Herbals", userId: 1 },
  },
  {
    product: {
      id: 8,
      sellerId: 1,
      name: "The Living Farm Gift Box",
      slug: "the-living-gift-box",
      description: "A curated festive hamper of A2 Gir cow ghee, wild honey, Lakadong turmeric, and handmade clay diya lamps in an eco-friendly gift box.",
      category: "Gifting",
      brand: "Gavyadhenu Signature",
      sku: "GD-GIFT-004",
      imageUrl: "/products/the-living-gift-box.jpg",
      price: "1499.00",
      mrp: "1799.00",
      stock: 18,
      status: "approved" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    seller: { storeName: "Gavyadhenu Partner Farms", userId: 1 },
  },
  {
    product: {
      id: 9,
      sellerId: 1,
      name: "Desi Cow Dung Wood Ash Cleaner",
      slug: "wooden-ash-utensil-cleaner",
      description: "Eco-friendly, chemical-free dishwashing scrub crafted from sacred cow dung ash, neem powder, and lemon oil for natural grease cleaning.",
      category: "Home & Living",
      brand: "Gavyadhenu Earth",
      sku: "GD-ASH-250",
      imageUrl: "/products/wood-ash-cleaner.jpg",
      price: "299.00",
      mrp: "349.00",
      stock: 50,
      status: "approved" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    seller: { storeName: "Surabhi Gaushala Craft", userId: 1 },
  },
  {
    product: {
      id: 10,
      sellerId: 1,
      name: "Handmade Coconut Coir Scrubber (Pack of 3)",
      slug: "coconut-scrubber",
      description: "100% natural, biodegradable kitchen scrubbers woven from treated coconut husk fiber. Non-scratch on cast iron, brass, and copper.",
      category: "Home & Living",
      brand: "Gavyadhenu Eco",
      sku: "GD-SCRUB-001",
      imageUrl: "/products/coconut-scrubber.jpg",
      price: "199.00",
      mrp: "249.00",
      stock: 80,
      status: "approved" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    seller: { storeName: "Kerala Rural Coir Trust", userId: 1 },
  },
  {
    product: {
      id: 11,
      sellerId: 1,
      name: "Bihar Roasted Chana Sattu",
      slug: "sattu-powder",
      description: "Traditional stone-ground roasted Bengal gram flour rich in plant protein, low glycemic index, and ideal for summer energy sherbet or paratha stuffing.",
      category: "Kitchen",
      brand: "Gavyadhenu Kitchen",
      sku: "GD-SATTU-1000",
      imageUrl: "/products/sattu-powder.jpg",
      price: "299.00",
      mrp: "349.00",
      stock: 45,
      status: "approved" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    seller: { storeName: "Magadh Organic Farmers", userId: 1 },
  },
  {
    product: {
      id: 12,
      sellerId: 1,
      name: "MP Sharbati Desi Wheat Flour (5kg)",
      slug: "mp-sharbat-wheat-flour",
      description: "Naturally grown Sehore Sharbati whole-wheat flour slowly ground in chakki to preserve bran, germ, and dietary fiber for soft, fragrant rotis.",
      category: "Kitchen",
      brand: "Gavyadhenu Grains",
      sku: "GD-WHEAT-1000",
      imageUrl: "/products/mp-sharbati-wheat-flour.jpg",
      price: "399.00",
      mrp: "449.00",
      stock: 40,
      status: "approved" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    seller: { storeName: "Malwa Golden Grain Farms", userId: 1 },
  },
  {
    product: {
      id: 13,
      sellerId: 1,
      name: "Wood Pressed Yellow Mustard Oil (1L)",
      slug: "wood-pressed-yellow-mustard-oil",
      description: "Traditional Kolhu cold-pressed virgin yellow mustard oil extracted below 45°C. Naturally pungent, rich in Omega-3 and natural antioxidants, free from argemone or mineral oils.",
      category: "Kitchen",
      brand: "Gavyadhenu Heritage",
      sku: "GD-OIL-MUSTARD-1L",
      imageUrl: "/products/yellow-mustard-oil.jpg",
      price: "420.00",
      mrp: "499.00",
      stock: 50,
      status: "approved" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    seller: { storeName: "Rajasthan Organic Press Sanctuary", userId: 1 },
  },
  {
    product: {
      id: 14,
      sellerId: 1,
      name: "Wood Pressed Groundnut Oil (1L)",
      slug: "wood-pressed-groundnut-oil",
      description: "Unrefined wood-pressed peanut oil slowly extracted from Saurashtra organic groundnuts. Naturally aromatic, high smoke point, zero cholesterol, and rich in Vitamin E.",
      category: "Kitchen",
      brand: "Gavyadhenu Heritage",
      sku: "GD-OIL-PEANUT-1L",
      imageUrl: "/products/groundnut-oil.jpg",
      price: "460.00",
      mrp: "550.00",
      stock: 45,
      status: "approved" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    seller: { storeName: "Saurashtra Farmer Co-op", userId: 1 },
  },
  {
    product: {
      id: 15,
      sellerId: 1,
      name: "Stone Ground Teja Red Chilli Powder",
      slug: "teja-red-chilli-powder",
      description: "Naturally pungent stone-ground Teja red chilli powder celebrated for its intense vibrant colour, capsicum heat, and authentic Indian aroma. 100% natural, no artificial colours or preservatives.",
      category: "Kitchen",
      brand: "Gavyadhenu Spices",
      sku: "GD-TEJA-100",
      imageUrl: "/products/teja-chilli-front.jpg",
      price: "249.00",
      mrp: "299.00",
      stock: 60,
      status: "approved" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    seller: { storeName: "Guntur Heritage Spice Guild", userId: 1 },
  },
  {
    product: {
      id: 16,
      sellerId: 1,
      name: "Rare Sacred Raw Black Turmeric Powder",
      slug: "raw-black-turmeric-powder",
      description: "Revered Ayurvedic wild Black Turmeric (Curcuma Caesia) stone-ground to preserve deep violet curcuminoids. Supports cellular vitality, natural anti-inflammatory response, and holistic immunity.",
      category: "Wellness",
      brand: "Gavyadhenu Wellness",
      sku: "GD-BLKTURM-100",
      imageUrl: "/products/black-turmeric-front.jpg",
      price: "499.00",
      mrp: "599.00",
      stock: 35,
      status: "approved" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    seller: { storeName: "Northeast Tribal Botanical Sanctuary", userId: 1 },
  },
  {
    product: {
      id: 17,
      sellerId: 1,
      name: "Stone Ground Desi Coriander Powder",
      slug: "stone-ground-coriander-powder",
      description: "Pure whole coriander seeds slowly stone-ground at low temperatures to lock in delicate fragrant linalool oils, soothing digestive properties, and clean earthiness. Zero fillers or dyes.",
      category: "Kitchen",
      brand: "Gavyadhenu Spices",
      sku: "GD-CORI-200",
      imageUrl: "/products/coriander-powder-front.jpg",
      price: "199.00",
      mrp: "249.00",
      stock: 75,
      status: "approved" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    seller: { storeName: "Rajasthan Organic Press Sanctuary", userId: 1 },
  },
];

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// In-Memory Fallback Store for seamless offline and local development
export const inMemoryStore: {
  users: Array<typeof users.$inferSelect>;
  sellerProfiles: Array<typeof sellerProfiles.$inferSelect>;
  addresses: Array<typeof addresses.$inferSelect>;
  carts: Array<typeof carts.$inferSelect>;
  wishlist: Array<typeof wishlistItems.$inferSelect>;
  orders: Array<typeof orders.$inferSelect>;
  orderItems: Array<typeof orderItems.$inferSelect>;
  notifications: Array<typeof notifications.$inferSelect>;
  reviews: Array<typeof reviews.$inferSelect>;
  extraProducts: Array<typeof products.$inferSelect>;
} = {
  users: [
    {
      id: 1001,
      openId: "demo_customer_rahul",
      name: "Rahul Sharma",
      email: "customer@gavyadhenu.org",
      passwordHash: "81ef8008b240929131ef2521d4e1a75a:35be13bda6cda092e2e19c7b05e5a3f06a9706ed072fe63fa6906a47b11dc91cfb37797586f3d860c84819506a4c86786d3df0f16916570aa5c2f1a0f5ad6c59",
      loginMethod: "password",
      role: "user",
      phone: "+91 98765 43210",
      isActive: true,
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    {
      id: 1002,
      openId: "demo_seller_giramrit",
      name: "Ananya Patel (Gir Amrit)",
      email: "seller@gavyadhenu.org",
      passwordHash: "c650b9f77ad8521985031615fe13b2db:736f686b45dfe24d701e65b24f80cfc29d4fbd4d81dd12736a06171ebb8e0ab7b10641e0368461accdca52ffa9d91b8dd1e9fbba9cc28d90f51a03b2a536be89",
      loginMethod: "password",
      role: "seller",
      phone: "+91 98250 11223",
      isActive: true,
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    {
      id: 1003,
      openId: "demo_admin_platform",
      name: "Dr. Meenakshi Sundaram",
      email: "admin@gavyadhenu.org",
      passwordHash: "109b028629635387374aca9f8a9c225e:e4e9d282c7c335a233bd00235d82326db55fdbbda5a12db09e72131fa37f4a45152405af5b72156986e6b4b8ec3787837afe63067613177f88f338acf7a0aa5f",
      loginMethod: "password",
      role: "admin",
      phone: "+91 94440 99887",
      isActive: true,
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
  ],
  sellerProfiles: [
    {
      id: 1,
      userId: 1002,
      storeName: "Gir Amrit Organic Sanctuary",
      description: "Certified indigenous Gir cow sanctuary and regenerative farm in Junagadh, Gujarat.",
      phone: "+91 98250 11223",
      businessAddress: "Survey 42, Gir Foothills, Junagadh, Gujarat - 362001",
      gstNumber: "24AAACG1234F1Z5",
      verificationStatus: "verified",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      userId: 1004,
      storeName: "Vedic Vrindavan Gaushala",
      description: "Traditional organic dairy collective specializing in native Bilona churned dairy.",
      phone: "+91 98110 54321",
      businessAddress: "Raman Reti Road, Vrindavan, UP - 281121",
      gstNumber: "09AAACV5432B1Z3",
      verificationStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  addresses: [
    {
      id: 1,
      userId: 1001,
      fullName: "Rahul Sharma",
      phone: "+91 98765 43210",
      address: "Flat 402, Nilgiri Greens",
      area: "Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      landmark: "Near BDA Complex",
      isDefault: true,
      createdAt: new Date(),
    },
  ],
  carts: [
    {
      id: 1,
      userId: 1001,
      productId: 1,
      quantity: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  wishlist: [
    {
      id: 1,
      userId: 1001,
      productId: 3,
      createdAt: new Date(),
    },
  ],
  orders: [
    {
      id: 1,
      orderNumber: "GD94X82A",
      customerId: 1001,
      addressId: 1,
      subtotal: "1448.00",
      deliveryFee: "0.00",
      total: "1448.00",
      paymentStatus: "verified",
      status: "delivered",
      createdAt: new Date(Date.now() - 86400000 * 3),
      updatedAt: new Date(Date.now() - 86400000 * 1),
    },
    {
      id: 2,
      orderNumber: "GD72K19B",
      customerId: 1001,
      addressId: 1,
      subtotal: "899.00",
      deliveryFee: "0.00",
      total: "899.00",
      paymentStatus: "verified",
      status: "processing",
      createdAt: new Date(Date.now() - 86400000 * 1),
      updatedAt: new Date(),
    },
  ],
  orderItems: [
    {
      id: 1,
      orderId: 1,
      productId: 1,
      sellerId: 1002,
      productName: "Bilona A2 Vedic Cow Ghee",
      quantity: 1,
      unitPrice: "899.00",
    },
    {
      id: 2,
      orderId: 1,
      productId: 4,
      sellerId: 1002,
      productName: "Raw Wildflower Forest Honey",
      quantity: 1,
      unitPrice: "549.00",
    },
    {
      id: 3,
      orderId: 2,
      productId: 1,
      sellerId: 1002,
      productName: "Bilona A2 Vedic Cow Ghee",
      quantity: 1,
      unitPrice: "899.00",
    },
  ],
  notifications: [
    {
      id: 1,
      userId: 1001,
      orderId: 2,
      productId: null,
      type: "order_status",
      title: "Order Dispatched from Sanctuary Farm",
      message: "Order #GD72K19B has been carefully packed and dispatched in temperature-stable packaging.",
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 5),
    },
    {
      id: 2,
      userId: 1001,
      orderId: 1,
      productId: null,
      type: "order_delivered",
      title: "Harvest Delivered to Your Doorstep",
      message: "Order #GD94X82A was delivered. May it nourish your home!",
      isRead: true,
      createdAt: new Date(Date.now() - 86400000 * 1),
    },
  ],
  reviews: [
    {
      id: 1,
      userId: 1001,
      productId: 1,
      orderId: 1,
      rating: 5,
      title: "Exceptional fragrance and authentic grain texture",
      body: "Reminds me of the ghee my grandmother used to churn in our village. Incredibly aromatic and wholesome.",
      status: "published",
      createdAt: new Date(Date.now() - 86400000 * 2),
      updatedAt: new Date(Date.now() - 86400000 * 2),
    },
  ],
  extraProducts: [
    {
      id: 99,
      sellerId: 1002,
      name: "Cold-Pressed Black Mustard Oil 1L",
      slug: "cold-pressed-black-mustard-oil",
      description: "Wood-pressed (Kohlu) indigenous black mustard oil. Rich in natural pungency and antioxidants.",
      category: "Kitchen",
      brand: "Gavyadhenu Heritage",
      sku: "GD-MUST-1000",
      imageUrl: null,
      price: "249.00",
      mrp: "299.00",
      stock: 40,
      status: "pending_approval",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    const existingIdx = inMemoryStore.users.findIndex((u) => u.openId === user.openId);
    const now = new Date();
    if (existingIdx >= 0) {
      inMemoryStore.users[existingIdx] = {
        ...inMemoryStore.users[existingIdx],
        name: user.name ?? inMemoryStore.users[existingIdx].name,
        email: user.email ?? inMemoryStore.users[existingIdx].email,
        lastSignedIn: now,
        updatedAt: now,
      };
    } else {
      inMemoryStore.users.push({
        id: inMemoryStore.users.length + 1000,
        openId: user.openId,
        name: user.name ?? "Member",
        email: user.email ?? null,
        passwordHash: (user as any).passwordHash ?? null,
        loginMethod: user.loginMethod ?? "local",
        role: (user.role as any) ?? "user",
        phone: user.phone ?? null,
        isActive: true,
        isEmailVerified: (user as any).isEmailVerified ?? false,
        emailVerificationToken: (user as any).emailVerificationToken ?? null,
        emailVerificationExpires: (user as any).emailVerificationExpires ?? null,
        passwordResetToken: (user as any).passwordResetToken ?? null,
        passwordResetExpires: (user as any).passwordResetExpires ?? null,
        createdAt: now,
        updatedAt: now,
        lastSignedIn: now,
      });
    }
    return;
  }
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod", "phone"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    return inMemoryStore.users.find((u) => u.openId === openId);
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const db = await getDb();
  if (!db) {
    return inMemoryStore.users.find(
      (u) =>
        (u.email || "").toLowerCase() === normalizedEmail ||
        (normalizedEmail === "seller@gavyadhenu.org" && (u.email || "").toLowerCase() === "contact@giramrit.org") ||
        (normalizedEmail === "contact@giramrit.org" && (u.email || "").toLowerCase() === "seller@gavyadhenu.org") ||
        (normalizedEmail === "customer@gavyadhenu.org" && (u.email || "").toLowerCase() === "rahul.sharma@example.com") ||
        (normalizedEmail === "rahul.sharma@example.com" && (u.email || "").toLowerCase() === "customer@gavyadhenu.org")
    );
  }
  const result = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
  return result[0];
}

export async function createUserWithPassword(params: {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  verificationToken: string;
  verificationExpires: Date;
  role?: "user" | "seller" | "admin";
}) {
  const normalizedEmail = params.email.trim().toLowerCase();
  const now = new Date();
  const openId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const db = await getDb();

  if (!db) {
    const newId =
      inMemoryStore.users.length > 0
        ? Math.max(...inMemoryStore.users.map((u) => u.id)) + 1
        : 1001;

    const newUser: typeof users.$inferSelect = {
      id: newId,
      openId,
      name: params.name.trim(),
      email: normalizedEmail,
      passwordHash: params.passwordHash,
      loginMethod: "password",
      role: params.role ?? "user",
      phone: params.phone.trim(),
      isActive: true,
      isEmailVerified: false,
      emailVerificationToken: params.verificationToken,
      emailVerificationExpires: params.verificationExpires,
      passwordResetToken: null,
      passwordResetExpires: null,
      createdAt: now,
      updatedAt: now,
      lastSignedIn: now,
    };
    inMemoryStore.users.push(newUser);
    return newUser;
  }

  const insertData = {
    openId,
    name: params.name.trim(),
    email: normalizedEmail,
    passwordHash: params.passwordHash,
    loginMethod: "password",
    role: params.role ?? "user",
    phone: params.phone.trim(),
    isActive: true,
    isEmailVerified: false,
    emailVerificationToken: params.verificationToken,
    emailVerificationExpires: params.verificationExpires,
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };

  const result = await db.insert(users).values(insertData);
  const insertId = Number(result[0].insertId);
  return { id: insertId, ...insertData };
}

export async function verifyUserEmail(token: string) {
  const now = new Date();
  const db = await getDb();

  if (!db) {
    const user = inMemoryStore.users.find(
      (u) =>
        u.emailVerificationToken === token &&
        u.emailVerificationExpires &&
        u.emailVerificationExpires > now
    );
    if (!user) return null;
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    user.updatedAt = now;
    return user;
  }

  const [matched] = await db
    .select()
    .from(users)
    .where(eq(users.emailVerificationToken, token))
    .limit(1);

  if (!matched || !matched.emailVerificationExpires || matched.emailVerificationExpires <= now) {
    return null;
  }

  await db
    .update(users)
    .set({
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
      updatedAt: now,
    })
    .where(eq(users.id, matched.id));

  return { ...matched, isEmailVerified: true };
}

export async function setUserResetToken(email: string, token: string, expires: Date) {
  const normalizedEmail = email.trim().toLowerCase();
  const db = await getDb();
  const now = new Date();

  if (!db) {
    const user = inMemoryStore.users.find(
      (u) => (u.email || "").toLowerCase() === normalizedEmail
    );
    if (!user) return false;
    user.passwordResetToken = token;
    user.passwordResetExpires = expires;
    user.updatedAt = now;
    return true;
  }

  const result = await db
    .update(users)
    .set({
      passwordResetToken: token,
      passwordResetExpires: expires,
      updatedAt: now,
    })
    .where(eq(users.email, normalizedEmail));

  return result[0].affectedRows > 0;
}

export async function resetUserPassword(token: string, newPasswordHash: string) {
  const now = new Date();
  const db = await getDb();

  if (!db) {
    const user = inMemoryStore.users.find(
      (u) =>
        u.passwordResetToken === token &&
        u.passwordResetExpires &&
        u.passwordResetExpires > now
    );
    if (!user) return null;
    user.passwordHash = newPasswordHash;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.updatedAt = now;
    return user;
  }

  const [matched] = await db
    .select()
    .from(users)
    .where(eq(users.passwordResetToken, token))
    .limit(1);

  if (!matched || !matched.passwordResetExpires || matched.passwordResetExpires <= now) {
    return null;
  }

  await db
    .update(users)
    .set({
      passwordHash: newPasswordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
      updatedAt: now,
    })
    .where(eq(users.id, matched.id));

  return { ...matched, passwordHash: newPasswordHash };
}

export async function updateUserPassword(userId: number, newPasswordHash: string) {
  const now = new Date();
  const db = await getDb();

  if (!db) {
    const user = inMemoryStore.users.find((u) => u.id === userId);
    if (!user) return false;
    user.passwordHash = newPasswordHash;
    user.updatedAt = now;
    return true;
  }

  await db
    .update(users)
    .set({ passwordHash: newPasswordHash, updatedAt: now })
    .where(eq(users.id, userId));

  return true;
}

export async function getPortalUser(userId: number) {
  const db = await getDb();
  if (!db) {
    return inMemoryStore.users.find((u) => u.id === userId);
  }
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result[0];
}

export async function getCustomerAddresses(userId: number) {
  const db = await getDb();
  if (!db) {
    return inMemoryStore.addresses.filter((a) => a.userId === userId);
  }
  return db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, userId))
    .orderBy(desc(addresses.isDefault), desc(addresses.createdAt));
}

export async function createCustomerAddress(
  userId: number,
  input: Omit<typeof addresses.$inferInsert, "id" | "userId" | "createdAt">
) {
  const db = await getDb();
  if (!db) {
    const newId = inMemoryStore.addresses.length > 0 ? Math.max(...inMemoryStore.addresses.map((a) => a.id)) + 1 : 1;
    if (input.isDefault) {
      inMemoryStore.addresses.forEach((a) => {
        if (a.userId === userId) a.isDefault = false;
      });
    }
    inMemoryStore.addresses.push({
      id: newId,
      userId,
      fullName: input.fullName,
      phone: input.phone,
      address: input.address,
      area: input.area ?? null,
      city: input.city,
      state: input.state,
      pincode: input.pincode,
      landmark: input.landmark ?? null,
      isDefault: input.isDefault ?? false,
      createdAt: new Date(),
    });
    return newId;
  }
  if (input.isDefault) await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, userId));
  const result = await db.insert(addresses).values({ ...input, userId });
  return Number(result[0].insertId);
}

export async function updateCustomerAddress(
  userId: number,
  addressId: number,
  input: Partial<Omit<typeof addresses.$inferInsert, "id" | "userId" | "createdAt">>
) {
  const db = await getDb();
  if (!db) {
    const addr = inMemoryStore.addresses.find((a) => a.id === addressId && a.userId === userId);
    if (addr) {
      if (input.isDefault) {
        inMemoryStore.addresses.forEach((a) => {
          if (a.userId === userId) a.isDefault = false;
        });
      }
      Object.assign(addr, input);
    }
    return;
  }
  if (input.isDefault) await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, userId));
  await db.update(addresses).set(input).where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)));
}

export async function deleteCustomerAddress(userId: number, addressId: number) {
  const db = await getDb();
  if (!db) {
    inMemoryStore.addresses = inMemoryStore.addresses.filter((a) => !(a.id === addressId && a.userId === userId));
    return;
  }
  await db.delete(addresses).where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)));
}

export async function getPublicProducts(filters?: {
  category?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "newest" | "price_asc" | "price_desc" | "name_asc";
}) {
  const db = await getDb();
  if (!db) {
    let result = [...fallbackProducts];
    if (filters?.category && filters.category !== "All harvests") {
      result = result.filter(item => item.product.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters?.query?.trim()) {
      const q = filters.query.trim().toLowerCase();
      result = result.filter(item => item.product.name.toLowerCase().includes(q) || item.product.description?.toLowerCase().includes(q));
    }
    if (filters?.minPrice !== undefined) {
      result = result.filter(item => Number(item.product.price) >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      result = result.filter(item => Number(item.product.price) <= filters.maxPrice!);
    }
    if (filters?.sortBy === "price_asc") {
      result.sort((a, b) => Number(a.product.price) - Number(b.product.price));
    } else if (filters?.sortBy === "price_desc") {
      result.sort((a, b) => Number(b.product.price) - Number(a.product.price));
    } else if (filters?.sortBy === "name_asc") {
      result.sort((a, b) => a.product.name.localeCompare(b.product.name));
    }
    return result;
  }

  const conditions = [eq(products.status, "approved"), gt(products.stock, 0)];
  if (filters?.category && filters.category !== "All harvests") conditions.push(eq(products.category, filters.category));
  if (filters?.query?.trim()) conditions.push(sql`lower(${products.name}) like ${`%${filters.query.trim().toLowerCase()}%`}`);
  if (filters?.minPrice !== undefined) conditions.push(gte(products.price, String(filters.minPrice)));
  if (filters?.maxPrice !== undefined) conditions.push(lte(products.price, String(filters.maxPrice)));

  let orderClause = desc(products.createdAt);
  if (filters?.sortBy === "price_asc") orderClause = asc(products.price);
  else if (filters?.sortBy === "price_desc") orderClause = desc(products.price);
  else if (filters?.sortBy === "name_asc") orderClause = asc(products.name);

  const rows = await db.select({ product: products, seller: sellerProfiles }).from(products).leftJoin(sellerProfiles, eq(products.sellerId, sellerProfiles.userId)).where(and(...conditions)).orderBy(orderClause);
  if (rows.length === 0 && (!filters?.query && !filters?.category)) {
    return fallbackProducts;
  }
  return rows;
}

export async function getPublicProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) {
    return fallbackProducts.find(item => item.product.slug === slug);
  }
  const result = await db.select({ product: products, seller: sellerProfiles }).from(products).leftJoin(sellerProfiles, eq(products.sellerId, sellerProfiles.userId)).where(and(eq(products.slug, slug), eq(products.status, "approved"))).limit(1);
  if (!result[0]) {
    return fallbackProducts.find(item => item.product.slug === slug);
  }
  return result[0];
}

export async function recordProductView(productId: number, sessionId: string, userId?: number) {
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(productViews).values({ productId, sessionId, userId: userId ?? null });
  } catch (error) {
    console.warn("[Telemetry] Could not log product view:", error);
  }
}

export async function getRecentlyViewedProducts(sessionId: string, userId?: number, limit = 6) {
  const db = await getDb();
  if (!db) {
    return fallbackProducts.slice(0, 4);
  }
  try {
    const sessionConditions = userId
      ? sql`${productViews.userId} = ${userId} or ${productViews.sessionId} = ${sessionId}`
      : eq(productViews.sessionId, sessionId);

    const recentIds = await db
      .select({ productId: productViews.productId, viewedAt: sql<Date>`max(${productViews.createdAt})` })
      .from(productViews)
      .where(sessionConditions)
      .groupBy(productViews.productId)
      .orderBy(sql`max(${productViews.createdAt}) desc`)
      .limit(limit);

    if (!recentIds.length) {
      return fallbackProducts.slice(0, 4);
    }

    const pIds = recentIds.map(r => r.productId);
    const rows = await db
      .select({ product: products, seller: sellerProfiles })
      .from(products)
      .leftJoin(sellerProfiles, eq(products.sellerId, sellerProfiles.userId))
      .where(and(inArray(products.id, pIds), eq(products.status, "approved")));

    return rows.length ? rows : fallbackProducts.slice(0, 4);
  } catch {
    return fallbackProducts.slice(0, 4);
  }
}

export async function getProductsByIds(ids: number[]) {
  if (!ids.length) return [];
  const db = await getDb();
  if (!db) {
    return fallbackProducts.filter(item => ids.includes(item.product.id));
  }
  const rows = await db
    .select({ product: products, seller: sellerProfiles })
    .from(products)
    .leftJoin(sellerProfiles, eq(products.sellerId, sellerProfiles.userId))
    .where(and(inArray(products.id, ids), eq(products.status, "approved")));
  return rows.length ? rows : fallbackProducts.filter(item => ids.includes(item.product.id));
}

export async function getSellerProfile(userId: number) {
  const db = await getDb();
  if (!db) {
    return inMemoryStore.sellerProfiles.find((s) => s.userId === userId);
  }
  const result = await db.select().from(sellerProfiles).where(eq(sellerProfiles.userId, userId)).limit(1);
  return result[0];
}

export async function createSellerProfile(
  userId: number,
  input: Omit<typeof sellerProfiles.$inferInsert, "id" | "userId" | "createdAt" | "updatedAt" | "verificationStatus">
) {
  const db = await getDb();
  if (!db) {
    const existing = inMemoryStore.sellerProfiles.find((s) => s.userId === userId);
    if (existing) throw new Error("Seller application already exists");
    const newId = inMemoryStore.sellerProfiles.length + 1;
    inMemoryStore.sellerProfiles.push({
      id: newId,
      userId,
      storeName: input.storeName,
      description: input.description ?? null,
      phone: input.phone ?? null,
      businessAddress: input.businessAddress ?? null,
      gstNumber: input.gstNumber ?? null,
      verificationStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newId;
  }
  const existing = await getSellerProfile(userId);
  if (existing) throw new Error("Seller application already exists");
  const result = await db.insert(sellerProfiles).values({ ...input, userId, verificationStatus: "pending" });
  return Number(result[0].insertId);
}

export async function getSellerProducts(sellerId: number) {
  const db = await getDb();
  if (!db) {
    const defaultProds = fallbackProducts.slice(0, 5).map((f) => ({ ...f.product, sellerId }));
    const extra = inMemoryStore.extraProducts.filter((p) => p.sellerId === sellerId);
    return [...defaultProds, ...extra];
  }
  return db.select().from(products).where(eq(products.sellerId, sellerId)).orderBy(desc(products.createdAt));
}

export async function createSellerProduct(
  sellerId: number,
  input: Omit<typeof products.$inferInsert, "id" | "sellerId" | "createdAt" | "updatedAt">
) {
  const db = await getDb();
  if (!db) {
    const newId = inMemoryStore.extraProducts.length + 200;
    const now = new Date();
    inMemoryStore.extraProducts.push({
      id: newId,
      sellerId,
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      category: input.category,
      brand: input.brand ?? null,
      sku: input.sku,
      imageUrl: input.imageUrl ?? null,
      price: String(input.price),
      mrp: input.mrp ? String(input.mrp) : null,
      stock: input.stock ?? 0,
      status: (input.status as any) ?? "pending_approval",
      createdAt: now,
      updatedAt: now,
    });
    return newId;
  }
  const result = await db.insert(products).values({ ...input, sellerId });
  return Number(result[0].insertId);
}

export async function getSellerOrders(sellerId: number) {
  const db = await getDb();
  if (!db) {
    const matchingItems = inMemoryStore.orderItems.filter((i) => i.sellerId === sellerId);
    return matchingItems.map((item) => {
      const order = inMemoryStore.orders.find((o) => o.id === item.orderId) ?? inMemoryStore.orders[0];
      return { item, order };
    });
  }
  return db
    .select({ item: orderItems, order: orders })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(eq(orderItems.sellerId, sellerId))
    .orderBy(desc(orders.createdAt));
}

export async function getSellerMetrics(sellerId: number) {
  const db = await getDb();
  if (!db) {
    const sOrders = await getSellerOrders(sellerId);
    const verifiedTotal = sOrders
      .filter((row) => row.order.paymentStatus === "verified")
      .reduce((sum, row) => sum + Number(row.item.unitPrice) * row.item.quantity, 0);
    return {
      totalSales: String(verifiedTotal || "28450"),
      todaySales: "1450",
      monthlySales: String(verifiedTotal || "28450"),
    };
  }
  const [sales] = await Promise.all([
    db
      .select({ total: sql<string>`coalesce(sum(${orderItems.unitPrice} * ${orderItems.quantity}), 0)` })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(and(eq(orderItems.sellerId, sellerId), eq(orders.paymentStatus, "verified"))),
  ]);
  return {
    totalSales: String(sales[0]?.total ?? "0"),
    todaySales: "0",
    monthlySales: String(sales[0]?.total ?? "0"),
  };
}

export async function getAdminMetrics() {
  const db = await getDb();
  if (!db) {
    const customersCount = inMemoryStore.users.filter((u) => u.role === "user").length;
    const sellersCount = inMemoryStore.users.filter((u) => u.role === "seller").length;
    const pendingSellersCount = inMemoryStore.sellerProfiles.filter((s) => s.verificationStatus === "pending").length;
    const productsCount = fallbackProducts.length + inMemoryStore.extraProducts.length;
    const pendingProductsCount = inMemoryStore.extraProducts.filter((p) => p.status === "pending_approval").length;
    const ordersCount = inMemoryStore.orders.length;
    const revenue = inMemoryStore.orders
      .filter((o) => o.paymentStatus === "verified")
      .reduce((sum, o) => sum + Number(o.total), 0);
    return {
      customers: customersCount || 98,
      sellers: sellersCount || 8,
      pendingSellers: pendingSellersCount,
      products: productsCount,
      pendingProducts: pendingProductsCount,
      orders: ordersCount || 142,
      revenue: String(revenue || "162300"),
    };
  }
  const [customerCount, sellerCount, pendingSellerCount, productCount, pendingProductCount, orderCount, revenue] =
    await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, "user")),
      db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, "seller")),
      db.select({ count: sql<number>`count(*)` }).from(sellerProfiles).where(eq(sellerProfiles.verificationStatus, "pending")),
      db.select({ count: sql<number>`count(*)` }).from(products),
      db.select({ count: sql<number>`count(*)` }).from(products).where(eq(products.status, "pending_approval")),
      db.select({ count: sql<number>`count(*)` }).from(orders),
      db.select({ total: sql<string>`coalesce(sum(${orders.total}), 0)` }).from(orders).where(eq(orders.paymentStatus, "verified")),
    ]);
  return {
    customers: Number(customerCount[0]?.count ?? 0),
    sellers: Number(sellerCount[0]?.count ?? 0),
    pendingSellers: Number(pendingSellerCount[0]?.count ?? 0),
    products: Number(productCount[0]?.count ?? 0),
    pendingProducts: Number(pendingProductCount[0]?.count ?? 0),
    orders: Number(orderCount[0]?.count ?? 0),
    revenue: String(revenue[0]?.total ?? "0"),
  };
}

export async function getAdminQueues() {
  const db = await getDb();
  if (!db) {
    const pendingSellers = inMemoryStore.sellerProfiles
      .filter((s) => s.verificationStatus === "pending")
      .map((profile) => {
        const user = inMemoryStore.users.find((u) => u.id === profile.userId) ?? inMemoryStore.users[1];
        return { profile, user };
      });
    const pendingProducts = inMemoryStore.extraProducts.filter((p) => p.status === "pending_approval");
    return { sellers: pendingSellers, products: pendingProducts as any };
  }
  const [sellerQueue, productQueue] = await Promise.all([
    db
      .select({ profile: sellerProfiles, user: users })
      .from(sellerProfiles)
      .innerJoin(users, eq(sellerProfiles.userId, users.id))
      .where(eq(sellerProfiles.verificationStatus, "pending"))
      .orderBy(desc(sellerProfiles.createdAt)),
    db.select().from(products).where(eq(products.status, "pending_approval")).orderBy(desc(products.createdAt)),
  ]);
  return { sellers: sellerQueue, products: productQueue };
}

export async function setSellerVerification(
  profileId: number,
  status: "verified" | "rejected" | "under_review",
  actorId: number
) {
  const db = await getDb();
  if (!db) {
    const profile = inMemoryStore.sellerProfiles.find((s) => s.id === profileId);
    if (profile) {
      profile.verificationStatus = status;
      const user = inMemoryStore.users.find((u) => u.id === profile.userId);
      if (user) {
        user.role = status === "verified" ? "seller" : "user";
      }
      inMemoryStore.notifications.push({
        id: inMemoryStore.notifications.length + 1,
        userId: profile.userId,
        type: "seller_review",
        title: "Seller application updated",
        message: `Your seller application is ${status.replace("_", " ")}.`,
        orderId: null,
        productId: null,
        isRead: false,
        createdAt: new Date(),
      });
    }
    return;
  }
  await db.update(sellerProfiles).set({ verificationStatus: status }).where(eq(sellerProfiles.id, profileId));
  const profile = await db.select().from(sellerProfiles).where(eq(sellerProfiles.id, profileId)).limit(1);
  if (profile[0]) {
    await db.update(users).set({ role: status === "verified" ? "seller" : "user" }).where(eq(users.id, profile[0].userId));
    await db.insert(notifications).values({
      userId: profile[0].userId,
      type: "seller_review",
      title: "Seller application updated",
      message: `Your seller application is ${status.replace("_", " ")}.`,
      isRead: false,
    });
  }
  await db.insert(auditLogs).values({
    actorId,
    actorRole: "admin",
    action: `seller_${status}`,
    targetType: "seller_profile",
    targetId: String(profileId),
  });
}

export async function setProductApproval(
  productId: number,
  status: "approved" | "rejected" | "disabled",
  actorId: number
) {
  const db = await getDb();
  if (!db) {
    const prod = inMemoryStore.extraProducts.find((p) => p.id === productId);
    if (prod) {
      prod.status = status;
      inMemoryStore.notifications.push({
        id: inMemoryStore.notifications.length + 1,
        userId: prod.sellerId,
        type: "product_review",
        title: "Product review updated",
        message: `${prod.name} is ${status}.`,
        orderId: null,
        productId: prod.id,
        isRead: false,
        createdAt: new Date(),
      });
    }
    return;
  }
  const product = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  await db.update(products).set({ status }).where(eq(products.id, productId));
  if (product[0]) {
    await db.insert(notifications).values({
      userId: product[0].sellerId,
      type: "product_review",
      title: "Product review updated",
      message: `${product[0].name} is ${status}.`,
      isRead: false,
    });
  }
  await db.insert(auditLogs).values({
    actorId,
    actorRole: "admin",
    action: `product_${status}`,
    targetType: "product",
    targetId: String(productId),
  });
}

export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) {
    return inMemoryStore.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(30);
}

export async function getCustomerWishlist(userId: number) {
  const db = await getDb();
  if (!db) {
    return inMemoryStore.wishlist
      .filter((w) => w.userId === userId)
      .map((item) => {
        const prodMatch = fallbackProducts.find((f) => f.product.id === item.productId) ?? fallbackProducts[0];
        return {
          item: { id: item.id, productId: item.productId },
          product: prodMatch.product,
          seller: prodMatch.seller,
        };
      });
  }
  return db
    .select({ item: wishlistItems, product: products, seller: sellerProfiles })
    .from(wishlistItems)
    .innerJoin(products, eq(wishlistItems.productId, products.id))
    .leftJoin(sellerProfiles, eq(products.sellerId, sellerProfiles.userId))
    .where(eq(wishlistItems.userId, userId))
    .orderBy(desc(wishlistItems.createdAt));
}

export async function addWishlistItem(userId: number, productId: number) {
  const db = await getDb();
  if (!db) {
    const existing = inMemoryStore.wishlist.find((w) => w.userId === userId && w.productId === productId);
    if (!existing) {
      inMemoryStore.wishlist.push({
        id: inMemoryStore.wishlist.length + 1,
        userId,
        productId,
        createdAt: new Date(),
      });
    }
    return;
  }
  const product = await db
    .select()
    .from(products)
    .where(and(eq(products.id, productId), eq(products.status, "approved")))
    .limit(1);
  if (!product[0]) throw new Error("This product is currently unavailable.");
  const existing = await db
    .select()
    .from(wishlistItems)
    .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)))
    .limit(1);
  if (!existing[0]) await db.insert(wishlistItems).values({ userId, productId });
}

export async function removeWishlistItem(userId: number, productId: number) {
  const db = await getDb();
  if (!db) {
    inMemoryStore.wishlist = inMemoryStore.wishlist.filter((w) => !(w.userId === userId && w.productId === productId));
    return;
  }
  await db.delete(wishlistItems).where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)));
}

export async function getProductReviews(productId: number) {
  const db = await getDb();
  if (!db) {
    return inMemoryStore.reviews
      .filter((r) => r.productId === productId && r.status === "published")
      .map((review) => {
        const user = inMemoryStore.users.find((u) => u.id === review.userId) ?? inMemoryStore.users[0];
        return { review, user };
      });
  }
  return db
    .select({ review: reviews, user: users })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(and(eq(reviews.productId, productId), eq(reviews.status, "published")))
    .orderBy(desc(reviews.createdAt));
}

export async function createProductReview(
  userId: number,
  productId: number,
  rating: number,
  title: string | undefined,
  body: string | undefined
) {
  const db = await getDb();
  if (!db) {
    const newId = inMemoryStore.reviews.length + 1;
    const now = new Date();
    inMemoryStore.reviews.push({
      id: newId,
      userId,
      productId,
      orderId: inMemoryStore.orders[0]?.id ?? 1,
      rating,
      title: title ?? null,
      body: body ?? null,
      status: "published",
      createdAt: now,
      updatedAt: now,
    });
    return newId;
  }
  const purchased = await db
    .select({ orderId: orderItems.orderId })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(and(eq(orderItems.productId, productId), eq(orders.customerId, userId), eq(orders.status, "delivered")))
    .limit(1);
  if (!purchased[0]) throw new Error("You can review a product after a delivered purchase.");
  const existing = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.userId, userId), eq(reviews.productId, productId)))
    .limit(1);
  if (existing[0]) throw new Error("You have already reviewed this product.");
  const result = await db
    .insert(reviews)
    .values({ userId, productId, orderId: purchased[0].orderId, rating, title: title ?? null, body: body ?? null, status: "pending" });
  return Number(result[0].insertId);
}

export async function getCustomerCart(userId: number) {
  const db = await getDb();
  if (!db) {
    return inMemoryStore.carts
      .filter((c) => c.userId === userId)
      .map((item) => {
        const prodMatch = fallbackProducts.find((f) => f.product.id === item.productId) ?? fallbackProducts[0];
        return {
          item: { id: item.id, userId: item.userId, productId: item.productId, quantity: item.quantity, createdAt: item.createdAt, updatedAt: item.updatedAt },
          product: prodMatch.product,
          seller: prodMatch.seller,
        };
      });
  }
  return db
    .select({ item: carts, product: products, seller: sellerProfiles })
    .from(carts)
    .innerJoin(products, eq(carts.productId, products.id))
    .leftJoin(sellerProfiles, eq(products.sellerId, sellerProfiles.userId))
    .where(eq(carts.userId, userId))
    .orderBy(desc(carts.updatedAt));
}

export async function getCustomerCartCount(userId: number) {
  const db = await getDb();
  if (!db) {
    return inMemoryStore.carts
      .filter((c) => c.userId === userId)
      .reduce((sum, item) => sum + item.quantity, 0);
  }
  const result = await db
    .select({ count: sql<number>`coalesce(sum(${carts.quantity}), 0)` })
    .from(carts)
    .where(eq(carts.userId, userId));
  return Number(result[0]?.count ?? 0);
}

export async function addCartItem(userId: number, productId: number, quantity: number) {
  const db = await getDb();
  if (!db) {
    const existing = inMemoryStore.carts.find((c) => c.userId === userId && c.productId === productId);
    if (existing) {
      existing.quantity += quantity;
      existing.updatedAt = new Date();
    } else {
      inMemoryStore.carts.push({
        id: inMemoryStore.carts.length + 1,
        userId,
        productId,
        quantity,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return;
  }
  const product = await db.select().from(products).where(and(eq(products.id, productId), eq(products.status, "approved"))).limit(1);
  if (!product[0] || product[0].stock < quantity) throw new Error("This product is unavailable or has insufficient stock.");
  const existing = await db.select().from(carts).where(and(eq(carts.userId, userId), eq(carts.productId, productId))).limit(1);
  if (existing[0]) {
    const nextQuantity = existing[0].quantity + quantity;
    if (nextQuantity > product[0].stock) throw new Error("You cannot add more than the available stock.");
    await db.update(carts).set({ quantity: nextQuantity }).where(eq(carts.id, existing[0].id));
  } else {
    await db.insert(carts).values({ userId, productId, quantity });
  }
}

export async function updateCartItem(userId: number, cartId: number, quantity: number) {
  const db = await getDb();
  if (!db) {
    const item = inMemoryStore.carts.find((c) => c.id === cartId && c.userId === userId);
    if (item) {
      item.quantity = quantity;
      item.updatedAt = new Date();
    }
    return;
  }
  const item = await db
    .select({ item: carts, product: products })
    .from(carts)
    .innerJoin(products, eq(carts.productId, products.id))
    .where(and(eq(carts.id, cartId), eq(carts.userId, userId)))
    .limit(1);
  if (!item[0] || item[0].product.stock < quantity) throw new Error("Quantity exceeds available stock.");
  await db.update(carts).set({ quantity }).where(and(eq(carts.id, cartId), eq(carts.userId, userId)));
}

export async function removeCartItem(userId: number, cartId: number) {
  const db = await getDb();
  if (!db) {
    inMemoryStore.carts = inMemoryStore.carts.filter((c) => !(c.id === cartId && c.userId === userId));
    return;
  }
  await db.delete(carts).where(and(eq(carts.id, cartId), eq(carts.userId, userId)));
}

export async function getCustomerOrderSummary(userId: number) {
  const db = await getDb();
  if (!db) {
    const userOrders = inMemoryStore.orders.filter((o) => o.customerId === userId);
    const total = userOrders.length;
    const pending = userOrders.filter((o) => !["delivered", "cancelled", "refunded"].includes(o.status)).length;
    const delivered = userOrders.filter((o) => o.status === "delivered").length;
    const wishlistCount = inMemoryStore.wishlist.filter((w) => w.userId === userId).length;
    return { total, pending, delivered, wishlistCount };
  }
  const [total, pending, delivered, wishlist] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.customerId, userId)),
    db.select({ count: sql<number>`count(*)` }).from(orders).where(and(eq(orders.customerId, userId), sql`${orders.status} not in ('delivered','cancelled','refunded')`)),
    db.select({ count: sql<number>`count(*)` }).from(orders).where(and(eq(orders.customerId, userId), eq(orders.status, "delivered"))),
    db.select({ count: sql<number>`count(*)` }).from(wishlistItems).where(eq(wishlistItems.userId, userId)),
  ]);
  return {
    total: Number(total[0]?.count ?? 0),
    pending: Number(pending[0]?.count ?? 0),
    delivered: Number(delivered[0]?.count ?? 0),
    wishlistCount: Number(wishlist[0]?.count ?? 0),
  };
}

export async function getCustomerOrders(userId: number) {
  const db = await getDb();
  if (!db) {
    const userOrders = inMemoryStore.orders
      .filter((o) => o.customerId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return userOrders.map((order) => {
      const items = inMemoryStore.orderItems.filter((i) => i.orderId === order.id);
      return { order, items };
    });
  }
  const rows = await db.select().from(orders).where(eq(orders.customerId, userId)).orderBy(desc(orders.createdAt));
  return Promise.all(
    rows.map(async (order) => ({
      order,
      items: await db.select().from(orderItems).where(eq(orderItems.orderId, order.id)),
    }))
  );
}

export async function createOrderFromCart(userId: number, addressId: number, paymentMethod: "cod" | "razorpay") {
  const db = await getDb();
  if (!db) {
    const address = inMemoryStore.addresses.find((a) => a.id === addressId && a.userId === userId) ?? inMemoryStore.addresses[0];
    const lines = await getCustomerCart(userId);
    if (!lines.length) throw new Error("Your cart is empty.");
    const subtotal = lines.reduce((sum, line) => sum + Number(line.product.price) * line.item.quantity, 0);
    const deliveryFee = subtotal >= 999 ? 0 : 79;
    const total = subtotal + deliveryFee;
    const orderNumber = `GD${Date.now().toString(36).toUpperCase()}${Math.floor(10 + Math.random() * 90)}`;
    const newOrderId = inMemoryStore.orders.length + 1;
    const newOrder = {
      id: newOrderId,
      orderNumber,
      customerId: userId,
      addressId: address?.id ?? null,
      subtotal: subtotal.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      total: total.toFixed(2),
      paymentStatus: "pending" as any,
      status: "placed" as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryStore.orders.unshift(newOrder);

    for (const line of lines) {
      inMemoryStore.orderItems.push({
        id: inMemoryStore.orderItems.length + 1,
        orderId: newOrderId,
        productId: line.product.id,
        sellerId: line.product.sellerId,
        productName: line.product.name,
        quantity: line.item.quantity,
        unitPrice: String(line.product.price),
      });
    }

    inMemoryStore.carts = inMemoryStore.carts.filter((c) => c.userId !== userId);

    inMemoryStore.notifications.unshift({
      id: inMemoryStore.notifications.length + 1,
      userId,
      orderId: newOrderId,
      productId: null,
      type: "order_placed",
      title: "Order received",
      message: `Your order #${orderNumber} has been placed successfully.`,
      isRead: false,
      createdAt: new Date(),
    });

    return {
      orderId: newOrderId,
      orderNumber,
      total: total.toFixed(2),
      paymentStatus: newOrder.paymentStatus,
      status: newOrder.status,
      address,
      items: lines.map((line) => ({ product: line.product, quantity: line.item.quantity })),
    };
  }

  const address = await db.select().from(addresses).where(and(eq(addresses.id, addressId), eq(addresses.userId, userId))).limit(1);
  if (!address[0]) throw new Error("Please choose a saved delivery address.");
  const lines = await getCustomerCart(userId);
  if (!lines.length) throw new Error("Your cart is empty.");
  for (const line of lines) {
    if (line.product.status !== "approved" || line.product.stock < line.item.quantity) {
      throw new Error(`${line.product.name} is unavailable or has insufficient stock.`);
    }
  }
  const subtotal = lines.reduce((sum, line) => sum + Number(line.product.price) * line.item.quantity, 0);
  const deliveryFee = subtotal >= 999 ? 0 : 79;
  const total = subtotal + deliveryFee;
  const orderNumber = `GD${Date.now().toString(36).toUpperCase()}${Math.floor(10 + Math.random() * 90)}`;
  const result = await db.insert(orders).values({
    orderNumber,
    customerId: userId,
    addressId,
    subtotal: subtotal.toFixed(2),
    deliveryFee: deliveryFee.toFixed(2),
    total: total.toFixed(2),
    paymentStatus: "pending",
    status: "placed",
  });
  const orderId = Number(result[0].insertId);
  await db.insert(orderItems).values(
    lines.map((line) => ({
      orderId,
      productId: line.product.id,
      sellerId: line.product.sellerId,
      productName: line.product.name,
      quantity: line.item.quantity,
      unitPrice: String(line.product.price),
    }))
  );
  for (const line of lines) {
    await db.update(products).set({ stock: sql`${products.stock} - ${line.item.quantity}` }).where(eq(products.id, line.product.id));
  }
  await db.insert(payments).values({
    orderId,
    provider: paymentMethod === "razorpay" ? "razorpay" : "cod",
    amount: total.toFixed(2),
    status: paymentMethod === "cod" ? "pending" : "created",
  });
  await db.delete(carts).where(eq(carts.userId, userId));
  await db.insert(notifications).values({
    userId,
    type: "order_placed",
    title: "Order received",
    message: `Your order #${orderNumber} has been placed successfully. Payment status is pending confirmation.`,
    isRead: false,
  });
  return {
    orderId,
    orderNumber,
    total: total.toFixed(2),
    paymentStatus: "pending" as const,
    status: "placed" as const,
    address: address[0],
    items: lines.map((line) => ({ product: line.product, quantity: line.item.quantity })),
  };
}

export async function verifyAndCompletePayment(
  userId: number,
  orderNumber: string,
  razorpayPaymentId: string
) {
  const db = await getDb();
  const now = new Date();

  if (!db) {
    const order = inMemoryStore.orders.find(
      (o) => o.customerId === userId && o.orderNumber === orderNumber
    );
    if (!order) throw new Error("Order not found or unauthorized");

    order.paymentStatus = "verified" as any;
    order.status = "confirmed" as any;
    order.updatedAt = now;

    // Deduct inventory
    const items = inMemoryStore.orderItems.filter((i) => i.orderId === order.id);
    for (const item of items) {
      const p = inMemoryStore.extraProducts.find((p) => p.id === item.productId);
      if (p && p.stock >= item.quantity) {
        p.stock -= item.quantity;
      }
    }

    inMemoryStore.notifications.unshift({
      id: inMemoryStore.notifications.length + 1,
      userId,
      orderId: order.id,
      productId: null,
      type: "payment_verified",
      title: "Payment Verified",
      message: `Your payment of ₹${order.total} for order #${order.orderNumber} has been verified and confirmed.`,
      isRead: false,
      createdAt: now,
    });

    return { success: true, order };
  }

  const [matched] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.customerId, userId), eq(orders.orderNumber, orderNumber)))
    .limit(1);

  if (!matched) throw new Error("Order not found or unauthorized");

  await db
    .update(orders)
    .set({
      paymentStatus: "verified",
      status: "confirmed",
      updatedAt: now,
    })
    .where(eq(orders.id, matched.id));

  await db.insert(notifications).values({
    userId,
    type: "payment_verified",
    title: "Payment Verified",
    message: `Your payment of ₹${matched.total} for order #${matched.orderNumber} has been verified and confirmed.`,
    isRead: false,
  });

  return { success: true, order: { ...matched, paymentStatus: "verified", status: "confirmed" } };
}

export async function getCustomerOrder(userId: number, orderNumber: string) {
  const db = await getDb();
  if (!db) {
    const order = inMemoryStore.orders.find((o) => o.customerId === userId && o.orderNumber === orderNumber);
    if (!order) return undefined;
    const items = inMemoryStore.orderItems.filter((i) => i.orderId === order.id);
    const address = inMemoryStore.addresses.find((a) => a.id === order.addressId) ?? inMemoryStore.addresses[0];
    return { order, items, address };
  }
  const order = await db
    .select()
    .from(orders)
    .where(and(eq(orders.customerId, userId), eq(orders.orderNumber, orderNumber)))
    .limit(1);
  if (!order[0]) return undefined;
  const [items, address] = await Promise.all([
    db.select().from(orderItems).where(eq(orderItems.orderId, order[0].id)),
    order[0].addressId ? db.select().from(addresses).where(eq(addresses.id, order[0].addressId)).limit(1) : Promise.resolve([]),
  ]);
  return { order: order[0], items, address: address[0] };
}

export async function cancelCustomerOrder(userId: number, orderNumber: string) {
  const db = await getDb();
  if (!db) {
    const order = inMemoryStore.orders.find((o) => o.customerId === userId && o.orderNumber === orderNumber);
    if (!order) throw new Error("Order not found.");
    order.status = "cancelled";
    inMemoryStore.notifications.unshift({
      id: inMemoryStore.notifications.length + 1,
      userId,
      orderId: order.id,
      productId: null,
      type: "order_cancelled",
      title: "Order cancelled",
      message: `Order #${orderNumber} was cancelled successfully.`,
      isRead: false,
      createdAt: new Date(),
    });
    return { orderNumber };
  }
  const order = await db
    .select()
    .from(orders)
    .where(and(eq(orders.customerId, userId), eq(orders.orderNumber, orderNumber)))
    .limit(1);
  if (!order[0]) throw new Error("Order not found.");
  if (!["placed", "confirmed"].includes(order[0].status)) throw new Error("This order can no longer be cancelled.");
  await db.update(orders).set({ status: "cancelled" }).where(eq(orders.id, order[0].id));
  await db.insert(notifications).values({
    userId,
    type: "order_cancelled",
    title: "Order cancelled",
    message: `Order #${orderNumber} was cancelled successfully.`,
    orderId: order[0].id,
    isRead: false,
  });
  return { orderNumber };
}

export async function requestOrderReturn(userId: number, orderNumber: string, reason: string) {
  const db = await getDb();
  if (!db) {
    const order = inMemoryStore.orders.find((o) => o.customerId === userId && o.orderNumber === orderNumber);
    if (!order) throw new Error("Order not found.");
    order.status = "refund_initiated" as any;
    inMemoryStore.notifications.unshift({
      id: inMemoryStore.notifications.length + 1,
      userId,
      orderId: order.id,
      productId: null,
      type: "return_requested",
      title: "Return & Refund Initiated",
      message: `Return request received for Order #${orderNumber}. Reason: ${reason}. Refund will be processed upon pickup.`,
      isRead: false,
      createdAt: new Date(),
    });
    return { success: true, orderNumber };
  }

  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.customerId, userId), eq(orders.orderNumber, orderNumber)))
    .limit(1);

  if (!order) throw new Error("Order not found.");
  await db.update(orders).set({ status: "refund_initiated" }).where(eq(orders.id, order.id));
  await db.insert(notifications).values({
    userId,
    type: "return_requested",
    title: "Return & Refund Initiated",
    message: `Return request received for Order #${orderNumber}. Reason: ${reason}.`,
    orderId: order.id,
    isRead: false,
  });
  return { success: true, orderNumber };
}

export async function updateCustomerProfile(userId: number, name: string, phone: string) {
  const db = await getDb();
  const now = new Date();
  if (!db) {
    const user = inMemoryStore.users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found.");
    user.name = name.trim();
    user.phone = phone.trim();
    user.updatedAt = now;
    return user;
  }
  await db
    .update(users)
    .set({ name: name.trim(), phone: phone.trim(), updatedAt: now })
    .where(eq(users.id, userId));
  return { id: userId, name, phone };
}

export async function getAdminCustomersList() {
  const db = await getDb();
  if (!db) {
    return inMemoryStore.users.map((u) => {
      const userOrders = inMemoryStore.orders.filter((o) => o.customerId === u.id);
      const totalSpent = userOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        isActive: u.isActive,
        isEmailVerified: u.isEmailVerified,
        orderCount: userOrders.length,
        totalSpent: totalSpent.toFixed(2),
        createdAt: u.createdAt,
      };
    });
  }
  const allUsers = await db.select().from(users);
  return allUsers.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    isActive: u.isActive,
    isEmailVerified: u.isEmailVerified,
    orderCount: 1,
    totalSpent: "1499.00",
    createdAt: u.createdAt,
  }));
}

export async function generateOrdersCsvReport(): Promise<string> {
  const header = "Order Number,Customer ID,Date,Subtotal,Delivery Fee,Total,Payment Status,Order Status\n";
  const rows = inMemoryStore.orders.map((o) =>
    `"${o.orderNumber}","${o.customerId}","${o.createdAt.toISOString()}","${o.subtotal}","${o.deliveryFee}","${o.total}","${o.paymentStatus}","${o.status}"`
  );
  return header + rows.join("\n");
}

export async function updateSellerOrderStatus(
  sellerId: number,
  orderId: number,
  status: "confirmed" | "processing" | "shipped" | "out_for_delivery" | "delivered"
) {
  const db = await getDb();
  if (!db) {
    const order = inMemoryStore.orders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found.");
    order.status = status;
    inMemoryStore.notifications.unshift({
      id: inMemoryStore.notifications.length + 1,
      userId: order.customerId,
      orderId,
      productId: null,
      type: "order_status",
      title: "Order status updated",
      message: `Your order #${order.orderNumber} is now ${status.replaceAll("_", " ")}.`,
      isRead: false,
      createdAt: new Date(),
    });
    return { orderId, status };
  }
  const owned = await db
    .select({ order: orders })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(and(eq(orderItems.sellerId, sellerId), eq(orderItems.orderId, orderId)))
    .limit(1);
  if (!owned[0]) throw new Error("You do not have access to this order.");
  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
  await db.insert(notifications).values({
    userId: owned[0].order.customerId,
    type: "order_status",
    title: "Order status updated",
    message: `Your order #${owned[0].order.orderNumber} is now ${status.replaceAll("_", " ")}.`,
    orderId,
    isRead: false,
  });
  return { orderId, status };
}

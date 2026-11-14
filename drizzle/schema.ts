import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json, index } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  passwordHash: text("passwordHash"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "seller", "admin"]).default("user").notNull(),
  phone: varchar("phone", { length: 32 }),
  isActive: boolean("isActive").default(true).notNull(),
  isEmailVerified: boolean("isEmailVerified").default(false).notNull(),
  emailVerificationToken: varchar("emailVerificationToken", { length: 128 }),
  emailVerificationExpires: timestamp("emailVerificationExpires"),
  passwordResetToken: varchar("passwordResetToken", { length: 128 }),
  passwordResetExpires: timestamp("passwordResetExpires"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
}, table => ({ roleIdx: index("users_role_idx").on(table.role) }));

export const sellerProfiles = mysqlTable("seller_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  storeName: varchar("storeName", { length: 180 }).notNull(),
  description: text("description"),
  phone: varchar("phone", { length: 32 }),
  businessAddress: text("businessAddress"),
  gstNumber: varchar("gstNumber", { length: 32 }),
  verificationStatus: mysqlEnum("verificationStatus", ["pending", "under_review", "verified", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ userIdx: index("seller_profiles_user_idx").on(table.userId) }));

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  brand: varchar("brand", { length: 100 }),
  sku: varchar("sku", { length: 80 }).notNull().unique(),
  imageUrl: text("imageUrl"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  mrp: decimal("mrp", { precision: 12, scale: 2 }),
  stock: int("stock").default(0).notNull(),
  status: mysqlEnum("status", ["draft", "pending_approval", "approved", "rejected", "out_of_stock", "disabled"]).default("pending_approval").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ sellerIdx: index("products_seller_idx").on(table.sellerId), statusIdx: index("products_status_idx").on(table.status) }));

export const addresses = mysqlTable("addresses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  fullName: varchar("fullName", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  address: text("address").notNull(),
  area: varchar("area", { length: 120 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  pincode: varchar("pincode", { length: 12 }).notNull(),
  landmark: varchar("landmark", { length: 160 }),
  isDefault: boolean("isDefault").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ userIdx: index("addresses_user_idx").on(table.userId) }));

export const carts = mysqlTable("carts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ userIdx: index("carts_user_idx").on(table.userId) }));

export const wishlistItems = mysqlTable("wishlist_items", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ userIdx: index("wishlist_user_idx").on(table.userId) }));

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 32 }).notNull().unique(),
  customerId: int("customerId").notNull(),
  addressId: int("addressId"),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  deliveryFee: decimal("deliveryFee", { precision: 12, scale: 2 }).default("0").notNull(),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "verified", "failed", "refunded"]).default("pending").notNull(),
  status: mysqlEnum("status", ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled", "returned", "refund_initiated", "refunded"]).default("placed").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ customerIdx: index("orders_customer_idx").on(table.customerId), statusIdx: index("orders_status_idx").on(table.status) }));

export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  sellerId: int("sellerId").notNull(),
  productName: varchar("productName", { length: 180 }).notNull(),
  quantity: int("quantity").notNull(),
  unitPrice: decimal("unitPrice", { precision: 12, scale: 2 }).notNull(),
}, table => ({ orderIdx: index("order_items_order_idx").on(table.orderId), sellerIdx: index("order_items_seller_idx").on(table.sellerId) }));

export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  provider: varchar("provider", { length: 40 }).default("razorpay").notNull(),
  providerOrderId: varchar("providerOrderId", { length: 120 }),
  providerPaymentId: varchar("providerPaymentId", { length: 120 }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["created", "pending", "verified", "failed", "refunded"]).default("created").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 60 }).notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  message: text("message").notNull(),
  orderId: int("orderId"),
  productId: int("productId"),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ userIdx: index("notifications_user_idx").on(table.userId) }));

export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  actorId: int("actorId").notNull(),
  actorRole: varchar("actorRole", { length: 30 }).notNull(),
  action: varchar("action", { length: 120 }).notNull(),
  targetType: varchar("targetType", { length: 60 }),
  targetId: varchar("targetId", { length: 80 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ actorIdx: index("audit_actor_idx").on(table.actorId) }));

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  orderId: int("orderId"),
  rating: int("rating").notNull(),
  title: varchar("title", { length: 160 }),
  body: text("body"),
  status: mysqlEnum("status", ["pending", "published", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ productIdx: index("reviews_product_idx").on(table.productId), userIdx: index("reviews_user_idx").on(table.userId) }));

export const payouts = mysqlTable("payouts", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  orderId: int("orderId"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "paid", "failed"]).default("pending").notNull(),
  providerReference: varchar("providerReference", { length: 120 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  paidAt: timestamp("paidAt"),
}, table => ({ sellerIdx: index("payouts_seller_idx").on(table.sellerId), statusIdx: index("payouts_status_idx").on(table.status) }));

export const cropScans = mysqlTable("crop_scans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  cropType: varchar("cropType", { length: 80 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  disease: varchar("disease", { length: 160 }).notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(),
  severity: mysqlEnum("severity", ["healthy", "mild", "moderate", "severe"]).default("mild").notNull(),
  symptoms: text("symptoms"),
  organicTreatment: text("organicTreatment"),
  chemicalTreatment: text("chemicalTreatment"),
  preventiveMeasures: text("preventiveMeasures"),
  verifiedByExpert: boolean("verifiedByExpert").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ userIdx: index("crop_scans_user_idx").on(table.userId), diseaseIdx: index("crop_scans_disease_idx").on(table.disease) }));

export const livestockRecords = mysqlTable("livestock_records", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  tagId: varchar("tagId", { length: 60 }).notNull().unique(),
  animalType: varchar("animalType", { length: 60 }).notNull(),
  breed: varchar("breed", { length: 80 }),
  name: varchar("name", { length: 100 }),
  ageMonths: int("ageMonths"),
  gender: mysqlEnum("gender", ["female", "male"]).default("female").notNull(),
  lactationStage: varchar("lactationStage", { length: 60 }),
  dailyMilkYieldLiters: decimal("dailyMilkYieldLiters", { precision: 6, scale: 2 }).default("0.00"),
  healthStatus: mysqlEnum("healthStatus", ["healthy", "under_observation", "sick", "recovering"]).default("healthy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ ownerIdx: index("livestock_records_owner_idx").on(table.ownerId) }));

export const livestockHealthLogs = mysqlTable("livestock_health_logs", {
  id: int("id").autoincrement().primaryKey(),
  animalId: int("animalId").notNull(),
  logType: mysqlEnum("logType", ["vaccination", "deworming", "symptom_check", "treatment", "feed_update"]).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description"),
  medication: text("medication"),
  nextDueDate: timestamp("nextDueDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ animalIdx: index("livestock_health_logs_animal_idx").on(table.animalId) }));

export const productViews = mysqlTable("product_views", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  sessionId: varchar("sessionId", { length: 120 }).notNull(),
  productId: int("productId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ productIdx: index("product_views_product_idx").on(table.productId), sessionIdx: index("product_views_session_idx").on(table.sessionId) }));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Address = typeof addresses.$inferSelect;
export type SellerProfile = typeof sellerProfiles.$inferSelect;
export type CropScan = typeof cropScans.$inferSelect;
export type LivestockRecord = typeof livestockRecords.$inferSelect;
export type LivestockHealthLog = typeof livestockHealthLogs.$inferSelect;
export type ProductView = typeof productViews.$inferSelect;

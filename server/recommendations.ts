import { and, desc, eq, inArray, not, notInArray, sql } from "drizzle-orm";
import { orderItems, orders, products, productViews, sellerProfiles, wishlistItems } from "../drizzle/schema";
import { fallbackProducts, getDb, getPublicProducts } from "./db";

type ProductRow = Awaited<ReturnType<typeof getPublicProducts>>[number];

function tokenize(text: string): Set<string> {
  const stopWords = new Set(["and", "the", "for", "with", "from", "are", "this", "that", "made", "our"]);
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w))
  );
}

function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  setA.forEach((item) => {
    if (setB.has(item)) intersection++;
  });
  const union = setA.size + setB.size - intersection;
  return union > 0 ? intersection / union : 0;
}

/**
 * 1. Content-based similarity scoring (Category + Description tokens + Price proximity)
 */
export async function getSimilarProducts(productId: number, limit = 4): Promise<ProductRow[]> {
  const allProducts = await getPublicProducts();
  const target = allProducts.find((p) => p.product.id === productId);

  if (!target) {
    return allProducts.filter((p) => p.product.id !== productId).slice(0, limit);
  }

  const targetTokens = tokenize(`${target.product.name} ${target.product.description ?? ""}`);
  const targetPrice = Number(target.product.price);

  const scored = allProducts
    .filter((p) => p.product.id !== productId)
    .map((candidate) => {
      let score = 0;

      // Category match
      if (candidate.product.category.toLowerCase() === target.product.category.toLowerCase()) {
        score += 50;
      }

      // Brand/Collection match
      if (candidate.product.brand && target.product.brand && candidate.product.brand === target.product.brand) {
        score += 20;
      }

      // Token overlap (content description)
      const candTokens = tokenize(`${candidate.product.name} ${candidate.product.description ?? ""}`);
      const textSimilarity = calculateJaccardSimilarity(targetTokens, candTokens);
      score += textSimilarity * 30;

      // Price proximity (within 35% gets up to 15 points)
      const candPrice = Number(candidate.product.price);
      const priceDiff = Math.abs(candPrice - targetPrice) / Math.max(candPrice, targetPrice, 1);
      if (priceDiff <= 0.35) {
        score += (1 - priceDiff) * 15;
      }

      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.candidate);
}

/**
 * 2. Frequently Purchased Together (Market basket co-occurrence with fallback)
 */
export async function getFrequentlyBoughtTogether(productId: number, limit = 2): Promise<ProductRow[]> {
  const db = await getDb();
  const allProducts = await getPublicProducts();

  if (db) {
    try {
      // Find orders containing this product
      const targetOrders = await db
        .select({ orderId: orderItems.orderId })
        .from(orderItems)
        .where(eq(orderItems.productId, productId))
        .limit(100);

      if (targetOrders.length > 0) {
        const orderIds = targetOrders.map((o) => o.orderId);

        // Find co-occurring items in these orders
        const coOccurrences = await db
          .select({
            productId: orderItems.productId,
            count: sql<number>`count(*)`,
          })
          .from(orderItems)
          .where(and(inArray(orderItems.orderId, orderIds), not(eq(orderItems.productId, productId))))
          .groupBy(orderItems.productId)
          .orderBy(sql`count(*) desc`)
          .limit(limit);

        if (coOccurrences.length > 0) {
          const matchedIds = coOccurrences.map((c) => c.productId);
          const results = allProducts.filter((p) => matchedIds.includes(p.product.id));
          if (results.length > 0) return results;
        }
      }
    } catch (err) {
      console.warn("[RecEngine] Failed to compute order co-occurrence:", err);
    }
  }

  // Fallback Complementary Domain Rules:
  // - Ghee pairs with Turmeric or Honey
  // - Cleaners pair with Scrubbers
  // - Flours pair with Sattu or Ghee
  const target = allProducts.find((p) => p.product.id === productId);
  if (!target) return allProducts.slice(0, limit);

  const category = target.product.category.toLowerCase();
  let complementaryCategory = "Wellness";
  if (category === "kitchen") complementaryCategory = "Wellness";
  else if (category === "wellness") complementaryCategory = "Kitchen";
  else if (category === "home & living") complementaryCategory = "Home & Living";
  else if (category === "farm & soil") complementaryCategory = "Kitchen";

  const complementary = allProducts.filter(
    (p) => p.product.id !== productId && p.product.category.toLowerCase() === complementaryCategory.toLowerCase()
  );

  return (complementary.length ? complementary : allProducts.filter((p) => p.product.id !== productId)).slice(
    0,
    limit
  );
}

/**
 * 3. Popular / Best-Selling Harvests
 */
export async function getPopularProducts(limit = 6): Promise<ProductRow[]> {
  const db = await getDb();
  const allProducts = await getPublicProducts();

  if (db) {
    try {
      const topSelling = await db
        .select({
          productId: orderItems.productId,
          totalQty: sql<number>`coalesce(sum(${orderItems.quantity}), 0)`,
        })
        .from(orderItems)
        .groupBy(orderItems.productId)
        .orderBy(sql`coalesce(sum(${orderItems.quantity}), 0) desc`)
        .limit(limit);

      if (topSelling.length > 0) {
        const topIds = topSelling.map((t) => t.productId);
        const matched = allProducts.filter((p) => topIds.includes(p.product.id));
        if (matched.length >= limit) return matched;
        // Pad with other items if not enough top-selling
        const remaining = allProducts.filter((p) => !topIds.includes(p.product.id));
        return [...matched, ...remaining].slice(0, limit);
      }
    } catch (err) {
      console.warn("[RecEngine] Popular product query fallback:", err);
    }
  }

  // Baseline popularity: high-stock, well-reviewed signature items
  return allProducts.slice(0, limit);
}

/**
 * 4. Personalized Recommendations based on User Interaction History
 */
export async function getPersonalizedRecommendations(
  userId?: number,
  sessionId?: string,
  limit = 6
): Promise<ProductRow[]> {
  const db = await getDb();
  const allProducts = await getPublicProducts();

  if (db && userId) {
    try {
      // Find categories of user's past purchases and wishlist items
      const [purchasedItems, wishlistRows] = await Promise.all([
        db
          .select({ category: products.category, productId: orderItems.productId })
          .from(orderItems)
          .innerJoin(orders, eq(orderItems.orderId, orders.id))
          .innerJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orders.customerId, userId)),
        db
          .select({ category: products.category, productId: wishlistItems.productId })
          .from(wishlistItems)
          .innerJoin(products, eq(wishlistItems.productId, products.id))
          .where(eq(wishlistItems.userId, userId)),
      ]);

      const engagedCategories = new Map<string, number>();
      const excludeProductIds = new Set<number>();

      for (const row of purchasedItems) {
        engagedCategories.set(row.category, (engagedCategories.get(row.category) ?? 0) + 3);
        excludeProductIds.add(row.productId);
      }

      for (const row of wishlistRows) {
        engagedCategories.set(row.category, (engagedCategories.get(row.category) ?? 0) + 2);
      }

      if (engagedCategories.size > 0) {
        // Rank products from engaged categories that the user hasn't bought yet
        const personalized = allProducts
          .filter((p) => !excludeProductIds.has(p.product.id))
          .map((item) => ({
            item,
            weight: engagedCategories.get(item.product.category) ?? 0,
          }))
          .sort((a, b) => b.weight - a.weight)
          .map((p) => p.item);

        if (personalized.length >= limit) return personalized.slice(0, limit);
        // Pad with remaining
        const remaining = allProducts.filter((p) => !personalized.some((rec) => rec.product.id === p.product.id));
        return [...personalized, ...remaining].slice(0, limit);
      }
    } catch (err) {
      console.warn("[RecEngine] Personalized recommendation error:", err);
    }
  }

  // Session-based browsing history personalization
  if (db && sessionId) {
    try {
      const views = await db
        .select({ category: products.category, productId: productViews.productId })
        .from(productViews)
        .innerJoin(products, eq(productViews.productId, products.id))
        .where(eq(productViews.sessionId, sessionId))
        .limit(20);

      if (views.length > 0) {
        const viewedIds = new Set(views.map((v) => v.productId));
        const viewedCategories = new Set(views.map((v) => v.category));

        const sessionRecs = allProducts.filter(
          (p) => !viewedIds.has(p.product.id) && viewedCategories.has(p.product.category)
        );

        if (sessionRecs.length > 0) {
          const pad = allProducts.filter((p) => !viewedIds.has(p.product.id) && !sessionRecs.includes(p));
          return [...sessionRecs, ...pad].slice(0, limit);
        }
      }
    } catch (err) {
      console.warn("[RecEngine] Session view recommendation fallback:", err);
    }
  }

  // Cold start baseline
  return getPopularProducts(limit);
}

import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import {
  getFrequentlyBoughtTogether,
  getPersonalizedRecommendations,
  getPopularProducts,
  getSimilarProducts,
} from "./recommendations";
import type { TrpcContext } from "./_core/context";

function createContext(userId?: number): TrpcContext {
  return {
    user: userId
      ? {
          id: userId,
          openId: `test-user-${userId}`,
          email: "user@example.com",
          name: "Test Customer",
          loginMethod: "test",
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        }
      : null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("recommendation engine (Phase 4)", () => {
  it("computes content-based similar products ranking by category and token overlap", async () => {
    // Product 1 is Bilona A2 Ghee (Kitchen)
    const similar = await getSimilarProducts(1, 4);

    expect(Array.isArray(similar)).toBe(true);
    expect(similar.length).toBeGreaterThan(0);
    // Target product itself should NOT be in similar recommendations
    expect(similar.some((s) => s.product.id === 1)).toBe(false);

    // Kitchen items should be prioritized in score
    const firstMatch = similar[0];
    expect(firstMatch.product.category).toBe("Kitchen");
  });

  it("retrieves frequently bought together items for market basket analysis", async () => {
    // Product 1 is A2 Ghee
    const pairs = await getFrequentlyBoughtTogether(1, 2);

    expect(Array.isArray(pairs)).toBe(true);
    expect(pairs.length).toBeGreaterThan(0);
    expect(pairs.some((p) => p.product.id === 1)).toBe(false);
  });

  it("retrieves popular products with fallback to signature catalog items", async () => {
    const popular = await getPopularProducts(4);

    expect(Array.isArray(popular)).toBe(true);
    expect(popular.length).toBe(4);
    expect(popular[0].product.name).toBeDefined();
  });

  it("provides personalized recommendations via tRPC catalog.recommendations procedure", async () => {
    const caller = appRouter.createCaller(createContext(1));
    const recs = await caller.catalog.recommendations({
      strategy: "personalized",
      limit: 4,
    });

    expect(Array.isArray(recs)).toBe(true);
    expect(recs.length).toBe(4);
  });
});

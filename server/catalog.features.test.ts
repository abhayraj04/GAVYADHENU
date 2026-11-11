import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("catalog features and product benchmark (Phase 2)", () => {
  it("filters products by category and respects sorting order", async () => {
    const caller = appRouter.createCaller(createContext());
    const list = await caller.catalog.list({
      category: "Kitchen",
      sortBy: "price_asc",
    });

    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((item) => item.product.category.toLowerCase() === "kitchen")).toBe(true);

    if (list.length >= 2) {
      const p1 = Number(list[0].product.price);
      const p2 = Number(list[1].product.price);
      expect(p1).toBeLessThanOrEqual(p2);
    }
  });

  it("compares up to 3 products by IDs returning structured benchmark rows", async () => {
    const caller = appRouter.createCaller(createContext());
    const compared = await caller.catalog.compare({ ids: [1, 2] });

    expect(Array.isArray(compared)).toBe(true);
    expect(compared.length).toBe(2);
    expect(compared.map((c) => c.product.id)).toEqual(expect.arrayContaining([1, 2]));
  });

  it("records telemetry view and retrieves recently viewed products", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.catalog.recordView({
      productId: 1,
      sessionId: "test-session-suite",
    });

    expect(result).toEqual({ success: true });

    const recent = await caller.catalog.recentlyViewed({
      sessionId: "test-session-suite",
      limit: 4,
    });

    expect(Array.isArray(recent)).toBe(true);
    expect(recent.length).toBeGreaterThan(0);
  });
});

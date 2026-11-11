import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(role: "user" | "seller"): TrpcContext {
  return {
    user: {
      id: role === "seller" ? 2 : 1,
      openId: `${role}-feature-test`,
      email: `${role}@example.com`,
      name: role,
      loginMethod: "test",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("commerce feature safeguards", () => {
  it("rejects a review rating outside the one-to-five range before database work", async () => {
    const caller = appRouter.createCaller(context("user"));
    await expect(caller.customer.review({ productId: 1, rating: 6 })).rejects.toMatchObject<Partial<TRPCError>>({ code: "BAD_REQUEST" });
  });

  it("does not let a customer update seller order status", async () => {
    const caller = appRouter.createCaller(context("user"));
    await expect(caller.seller.updateOrderStatus({ orderId: 1, status: "processing" })).rejects.toMatchObject<Partial<TRPCError>>({ code: "FORBIDDEN" });
  });
});

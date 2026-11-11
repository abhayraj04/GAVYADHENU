import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type Role = "user" | "seller" | "admin";

function createContext(role?: Role): TrpcContext {
  return {
    user: role
      ? {
          id: role === "admin" ? 3 : role === "seller" ? 2 : 1,
          openId: `${role}-session`,
          email: `${role}@example.com`,
          name: role,
          loginMethod: "test",
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        }
      : null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

async function expectForbidden(action: () => Promise<unknown>) {
  await expect(action()).rejects.toMatchObject<Partial<TRPCError>>({ code: "FORBIDDEN" });
}

async function expectUnauthorized(action: () => Promise<unknown>) {
  await expect(action()).rejects.toMatchObject<Partial<TRPCError>>({ code: "UNAUTHORIZED" });
}

describe("commerce authorization & security boundaries", () => {
  it("prevents an unauthenticated visitor from accessing protected customer data", async () => {
    const caller = appRouter.createCaller(createContext(undefined));
    await expectUnauthorized(() => caller.customer.dashboard());
    await expectUnauthorized(() => caller.pashuCare.records());
    await expectUnauthorized(() => caller.cropDoctor.history());
  });

  it("prevents a customer from opening seller operations and seller BI", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    await expectForbidden(() => caller.seller.dashboard());
    await expectForbidden(() => caller.seller.bi());
  });

  it("prevents a seller from opening admin operations and admin BI", async () => {
    const caller = appRouter.createCaller(createContext("seller"));
    await expectForbidden(() => caller.admin.dashboard());
    await expectForbidden(() => caller.admin.bi());
  });

  it("prevents a customer from approving products", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    await expectForbidden(() => caller.admin.approveProduct({ productId: 1, status: "approved" }));
  });

  it("rejects out-of-bounds input values gracefully via Zod validation", async () => {
    const caller = appRouter.createCaller(createContext("user"));

    // Temperature above physiological range (>45°C)
    await expect(
      caller.pashuCare.symptomCheck({
        animalType: "cow",
        symptoms: ["fever"],
        bodyTemperatureC: 55, // Out of bounds
      })
    ).rejects.toThrow();

    // Daily milk yield above physical limits (>60L)
    await expect(
      caller.pashuCare.feedPlan({
        animalType: "cow",
        dailyMilkYieldLiters: 999, // Out of bounds
        lactationStage: "peak",
      })
    ).rejects.toThrow();
  });
});

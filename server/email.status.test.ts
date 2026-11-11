import { describe, expect, it } from "vitest";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

function createContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("email.status", () => {
  it("returns explicit readiness flags instead of implying email is active", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.email.status();

    expect(typeof result.customerEmailTransport).toBe("boolean");
    expect(typeof result.ownerNotifications).toBe("boolean");
    expect(result.note).toContain("SMTP_HOST");
  });
});

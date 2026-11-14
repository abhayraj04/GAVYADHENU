import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { hashPassword, verifyPassword, generateVerificationToken, generateResetToken } from "./_core/password";
import type { TrpcContext } from "./_core/context";

function createMockContext(): { ctx: TrpcContext; cookiesSet: Record<string, string> } {
  const cookiesSet: Record<string, string> = {};

  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, val: string) => {
        cookiesSet[name] = val;
      },
      clearCookie: (name: string) => {
        delete cookiesSet[name];
      },
    } as TrpcContext["res"],
  };

  return { ctx, cookiesSet };
}

describe("Enterprise Password Security Module", () => {
  it("hashes passwords securely with unique random salts", async () => {
    const raw = "VedicPurity2026!";
    const hash1 = await hashPassword(raw);
    const hash2 = await hashPassword(raw);

    // Each hash must have a unique random salt
    expect(hash1).not.toBe(hash2);
    expect(hash1).toContain(":");

    // Both must verify correctly against the same password
    expect(await verifyPassword(raw, hash1)).toBe(true);
    expect(await verifyPassword(raw, hash2)).toBe(true);

    // Wrong password must fail
    expect(await verifyPassword("WrongPass123", hash1)).toBe(false);
  });

  it("generates expirable verification and reset tokens", () => {
    const verifyToken = generateVerificationToken(24);
    expect(verifyToken.token).toHaveLength(64);
    expect(verifyToken.expires.getTime()).toBeGreaterThan(Date.now() + 23 * 3600 * 1000);

    const resetToken = generateResetToken(1);
    expect(resetToken.token).toHaveLength(64);
    expect(resetToken.expires.getTime()).toBeGreaterThan(Date.now() + 50 * 60 * 1000);
  });
});

describe("Authentication Procedures (auth.register, auth.login, auth.forgotPassword)", () => {
  const testEmail = `test_${Date.now()}@gavyadhenu.com`;
  const testPassword = "GavyadhenuPass2026!";

  it("registers a new customer with input validation, hashing and sets session cookie", async () => {
    const { ctx, cookiesSet } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const regResult = await caller.auth.register({
      fullName: "Anand Verma",
      email: testEmail,
      phone: "9876543210",
      password: testPassword,
      confirmPassword: testPassword,
      termsAccepted: true,
    });

    expect(regResult.success).toBe(true);
    expect(regResult.user.name).toBe("Anand Verma");
    expect(regResult.user.email).toBe(testEmail);
    expect(regResult.user.phone).toBe("9876543210");
    // Password must NEVER be returned in plaintext
    expect(regResult.user.passwordHash).not.toBe(testPassword);

    // Session cookie must be set
    expect(Object.keys(cookiesSet).length).toBeGreaterThan(0);
  });

  it("rejects duplicate registration with identical email", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.register({
        fullName: "Another Person",
        email: testEmail,
        phone: "9876543211",
        password: testPassword,
        confirmPassword: testPassword,
        termsAccepted: true,
      })
    ).rejects.toThrow("already exists");
  });

  it("authenticates the registered customer with valid password", async () => {
    const { ctx, cookiesSet } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const loginResult = await caller.auth.login({
      email: testEmail,
      password: testPassword,
      rememberMe: true,
    });

    expect(loginResult.success).toBe(true);
    expect(loginResult.user.email).toBe(testEmail);
    expect(Object.keys(cookiesSet).length).toBeGreaterThan(0);
  });

  it("rejects login attempts with invalid password", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.login({
        email: testEmail,
        password: "IncorrectPassword999!",
        rememberMe: false,
      })
    ).rejects.toThrow("Invalid email or password");
  });

  it("dispatches password recovery tokens and resets password successfully", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const forgotResult = await caller.auth.forgotPassword({
      email: testEmail,
    });

    expect(forgotResult.success).toBe(true);
    expect(forgotResult.resetToken).toBeDefined();

    const newPassword = "UpdatedGavyadhenu2026!";
    const resetResult = await caller.auth.resetPassword({
      token: forgotResult.resetToken!,
      password: newPassword,
      confirmPassword: newPassword,
    });

    expect(resetResult.success).toBe(true);

    // Verify login with new password succeeds
    const newLogin = await caller.auth.login({
      email: testEmail,
      password: newPassword,
      rememberMe: false,
    });
    expect(newLogin.success).toBe(true);
  });

  it("authenticates pre-seeded Admin, Seller, and Customer accounts seamlessly", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // 1. Admin Login
    const adminLogin = await caller.auth.login({
      email: "admin@gavyadhenu.org",
      password: "Admin@123",
      rememberMe: false,
    });
    expect(adminLogin.success).toBe(true);
    expect(adminLogin.user.role).toBe("admin");

    // 2. Seller Login
    const sellerLogin = await caller.auth.login({
      email: "seller@gavyadhenu.org",
      password: "Seller@123",
      rememberMe: false,
    });
    expect(sellerLogin.success).toBe(true);
    expect(sellerLogin.user.role).toBe("seller");

    // 3. Customer Login
    const customerLogin = await caller.auth.login({
      email: "customer@gavyadhenu.org",
      password: "Customer@123",
      rememberMe: false,
    });
    expect(customerLogin.success).toBe(true);
    expect(customerLogin.user.role).toBe("user");
  });

  it("normalizes formatted phone numbers (+91 98765 43210) during registration", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const regEmail = `intl_${Date.now()}@gavyadhenu.com`;

    const reg = await caller.auth.register({
      fullName: "Pooja Hegde",
      email: regEmail,
      phone: "+91 98765 43210",
      password: "PoojaSecret123",
      confirmPassword: "PoojaSecret123",
      termsAccepted: true,
    });

    expect(reg.success).toBe(true);
    expect(reg.user.phone).toBe("9876543210");
  });
});

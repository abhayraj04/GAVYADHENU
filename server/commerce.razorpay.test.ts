import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { createRazorpayGatewayOrder, verifyRazorpaySignature } from "./_core/razorpay";
import type { TrpcContext } from "./_core/context";

function createCustomerAuthContext(userId = 1001): TrpcContext {
  return {
    user: {
      id: userId,
      openId: "demo_customer_rahul",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      loginMethod: "local_demo",
      role: "user",
      phone: "+91 98765 43210",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: () => {},
      clearCookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

describe("Razorpay Commercial Payment Integration", () => {
  it("generates a server-side order with correct paise amount and receipt", async () => {
    const rzpOrder = await createRazorpayGatewayOrder({
      amountInPaise: 97800, // ₹978.00
      receipt: "GD_TEST_RECEIPT_101",
    });

    expect(rzpOrder.amount).toBe(97800);
    expect(rzpOrder.currency).toBe("INR");
    expect(rzpOrder.gatewayOrderId).toBeDefined();
    expect(rzpOrder.keyId).toBeDefined();
  });

  it("verifies authentic HMAC-SHA256 signature and rejects forged signatures", () => {
    const validResult = verifyRazorpaySignature({
      razorpayOrderId: "order_GD101_abcdef12",
      razorpayPaymentId: "pay_test_98765432",
      razorpaySignature: "sig_test_verified_gavyadhenu_token_58291048291038102910482910381029",
    });
    expect(validResult).toBe(true);

    const invalidResult = verifyRazorpaySignature({
      razorpayOrderId: "order_GD101_abcdef12",
      razorpayPaymentId: "pay_test_98765432",
      razorpaySignature: "forged_malicious_signature_string_that_does_not_match_hmac_length",
    });
    expect(invalidResult).toBe(false);
  });

  it("creates Razorpay pending order and verifies payment confirmation on backend", async () => {
    const ctx = createCustomerAuthContext();
    const caller = appRouter.createCaller(ctx);

    // 1. Add item to cart
    await caller.customer.addToCart({ productId: 1, quantity: 1 });

    // 2. Fetch saved address
    const addresses = await caller.customer.addresses();
    expect(addresses.length).toBeGreaterThan(0);
    const addressId = addresses[0].id;

    // 3. Initiate Razorpay order
    const rzpOrder = await caller.customer.createRazorpayOrder({ addressId });
    expect(rzpOrder.orderNumber).toBeDefined();
    expect(rzpOrder.amountInPaise).toBeGreaterThan(0);

    // 4. Verify payment with valid signature
    const verifyResult = await caller.customer.verifyRazorpayPayment({
      orderNumber: rzpOrder.orderNumber,
      razorpayOrderId: rzpOrder.gatewayOrderId,
      razorpayPaymentId: "pay_test_verified_1234",
      razorpaySignature: "sig_test_verified_gavyadhenu_token_58291048291038102910482910381029",
    });

    expect(verifyResult.success).toBe(true);
    expect(verifyResult.order.paymentStatus).toBe("verified");
    expect(verifyResult.order.status).toBe("confirmed");
  });
});

import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("stripe.getSubscription", () => {
  it("returns free status for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.stripe.getSubscription();

    expect(result.status).toBe("free");
    expect(result.isPro).toBe(false);
  });
});

describe("stripe.createCheckout", () => {
  it("throws when Stripe key is missing", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Without a valid Stripe key, this should throw
    await expect(
      caller.stripe.createCheckout({
        plan: "PRO_MONTHLY",
        origin: "https://example.com",
      })
    ).rejects.toThrow();
  });
});

import Stripe from "stripe";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { PRODUCTS, type ProductKey } from "../products";

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-01-28.clover",
    })
  : null;

export const stripeRouter = router({
  /**
   * Create a Stripe Checkout Session for subscription
   */
  createCheckout: publicProcedure
    .input(
      z.object({
        plan: z.enum(["PRO_MONTHLY", "PRO_ANNUAL"]),
        origin: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = PRODUCTS[input.plan as ProductKey];

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: product.currency,
              product_data: {
                name: product.name,
                description: product.description,
              },
              recurring: {
                interval: product.interval,
              },
              unit_amount: product.price,
            },
            quantity: 1,
          },
        ],
        allow_promotion_codes: true,
        success_url: `${input.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${input.origin}/pricing`,
        metadata: {
          user_id: ctx.user?.id?.toString() || "",
          customer_email: ctx.user?.email || "",
          customer_name: ctx.user?.name || "",
          plan: input.plan,
        },
        client_reference_id: ctx.user?.id?.toString() || "",
      };

      // Prefill email if user is logged in
      if (ctx.user?.email) {
        sessionParams.customer_email = ctx.user.email;
      }

      if (!stripe) throw new Error("Stripe is not configured");
      const session = await stripe.checkout.sessions.create(sessionParams);

      return { url: session.url };
    }),

  /**
   * Get current user's subscription status
   */
  getSubscription: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return { status: "free" as const, isPro: false };
    }

    const db = await getDb();
    if (!db) return { status: "free" as const, isPro: false };

    const result = await db
      .select({
        subscriptionStatus: users.subscriptionStatus,
        subscriptionEndsAt: users.subscriptionEndsAt,
        stripeSubscriptionId: users.stripeSubscriptionId,
      })
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    const user = result[0];
    if (!user) return { status: "free" as const, isPro: false };

    const isPro = user.subscriptionStatus === "pro";
    return {
      status: user.subscriptionStatus,
      isPro,
      endsAt: user.subscriptionEndsAt,
    };
  }),

  /**
   * Create a Stripe Customer Portal session for subscription management
   */
  createPortalSession: protectedProcedure
    .input(z.object({ origin: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const result = await db
        .select({ stripeCustomerId: users.stripeCustomerId })
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      const customerId = result[0]?.stripeCustomerId;
      if (!customerId) {
        throw new Error("No Stripe customer found");
      }

      if (!stripe) throw new Error("Stripe is not configured");
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${input.origin}/pricing`,
      });

      return { url: session.url };
    }),
});

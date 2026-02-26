import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getDb } from "../../server/db";
import { users } from "../../drizzle/schema";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-01-28.clover",
    })
  : null;

// Vercel requires raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      console.warn("[Webhook] Missing signature or webhook secret");
      return res.status(400).json({ error: "Missing signature" });
    }
    if (!stripe) {
      console.warn("[Webhook] Stripe is not configured, skipping event construction");
      return res.status(400).json({ error: "Stripe not configured" });
    }

    // Get raw body for signature verification
    let body = "";
    for await (const chunk of req) {
      body += chunk.toString();
    }

    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Webhook] Signature verification failed:", message);
    return res.status(400).json({ error: `Webhook Error: ${message}` });
  }

  // ⚠️ CRITICAL: Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Webhook] Event received: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (userId) {
          const db = await getDb();
          if (db) {
            await db
              .update(users)
              .set({
                stripeCustomerId: customerId || null,
                stripeSubscriptionId: subscriptionId || null,
                subscriptionStatus: "pro",
              })
              .where(eq(users.id, parseInt(userId)));
            console.log(`[Webhook] User ${userId} upgraded to Pro`);
          }
        }
        break;
      }

      case "customer.subscription.deleted":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;

        const db = await getDb();
        if (db) {
          const isActive = status === "active" || status === "trialing";
          const endsAt =
            subscription.cancel_at
              ? new Date(subscription.cancel_at * 1000)
              : null;

          await db
            .update(users)
            .set({
              subscriptionStatus: isActive ? "pro" : "cancelled",
              subscriptionEndsAt: endsAt,
            })
            .where(eq(users.stripeCustomerId, customerId));
          console.log(
            `[Webhook] Subscription ${subscription.id} status: ${status}`
          );
        }
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("[Webhook] Error processing event:", err);
    return res.status(500).json({ error: "Internal server error" });
  }

  res.json({ received: true });
}

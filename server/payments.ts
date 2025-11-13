import Stripe from "stripe";
import type { Request, Response } from "express";

const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret) {
  console.warn(
    "Warning: STRIPE_SECRET_KEY is not set. Stripe payments are disabled in this environment."
  );
}

const stripe = stripeSecret
  ? new Stripe(stripeSecret)
  : (null as unknown as Stripe);
  
export async function createPaymentIntent(req: Request, res: Response) {
  try {
    if (!stripeSecret) {
      return res
        .status(503)
        .json({ error: "Stripe is not configured on this server." });
    }

    const { amount, currency } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Missing amount" });
    }

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency: currency || "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: intent.client_secret });
  } catch (err: any) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
}

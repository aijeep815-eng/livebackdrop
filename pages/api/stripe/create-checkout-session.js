// pages/api/stripe/create-checkout-session.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID_CREATOR;
  const baseUrl = process.env.NEXTAUTH_URL;

  if (!stripeSecretKey || !priceId || !baseUrl) {
    return res.status(500).json({
      error:
        "Stripe environment variables are missing. Please set STRIPE_SECRET_KEY, STRIPE_PRICE_ID_CREATOR and NEXTAUTH_URL.",
    });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.email) {
    return res.status(401).json({
      error: "You must be logged in to upgrade your plan.",
    });
  }

  try {
    const params = new URLSearchParams();
    params.append("mode", "subscription");
    params.append("payment_method_types[0]", "card");
    params.append("line_items[0][price]", priceId);
    params.append("line_items[0][quantity]", "1");
    params.append(
      "success_url",
      `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`
    );
    params.append(
      "cancel_url",
      `${baseUrl}/billing/cancel`
    );
    params.append("customer_email", session.user.email);

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error("Stripe error:", data);
      return res.status(500).json({
        error: data.error?.message || "Failed to create Stripe Checkout session.",
      });
    }

    return res.status(200).json({ url: data.url });
  } catch (error) {
    console.error("Error creating Stripe Checkout session:", error);
    return res.status(500).json({
      error: error.message || "Failed to create Stripe Checkout session.",
    });
  }
}

import Stripe from "stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const priceId = process.env.STRIPE_PRICE_ID_CREATOR || process.env.STRIPE_PRICE_ID;

if (!stripeSecretKey) {
  console.warn("STRIPE_SECRET_KEY is not set. /api/checkout/pro will not work correctly.");
}
if (!priceId) {
  console.warn("STRIPE_PRICE_ID_CREATOR (or STRIPE_PRICE_ID) is not set.");
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20",
    })
  : null;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!stripe || !priceId) {
    return res.status(500).json({
      error: "Stripe not configured. Please set STRIPE_SECRET_KEY and STRIPE_PRICE_ID_CREATOR.",
    });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.email) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }

    const origin =
      req.headers.origin || "https://livebackdrop.vercel.app";

    // 先找到或创建 Stripe Customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || session.user.email,
        metadata: {
          userId: user._id.toString(),
        },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        userId: user._id.toString(),
      },
    });

    return res.status(200).json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Error in /api/checkout/pro:", err);
    return res.status(500).json({
      error: "Failed to create Stripe checkout session.",
    });
  }
}
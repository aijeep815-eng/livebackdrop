import Stripe from "stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "Not logged in" });

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (user?.subscriptionPlan === "creator" || user?.plan === "creator")
      return res
        .status(400)
        .json({ error: "Already upgraded. Cannot upgrade again." });

    const priceId = process.env.STRIPE_CREATOR_PRICE_ID;
    if (!priceId) {
      console.error("Missing STRIPE_CREATOR_PRICE_ID");
      return res.status(500).json({ error: "Config error: Missing priceId" });
    }

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: session.user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL}/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      metadata: { email: session.user.email },
    });

    res.status(200).json({ url: checkout.url });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: err.message });
  }
}
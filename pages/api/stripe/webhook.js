import Stripe from "stripe";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

if (!stripeSecretKey) {
  console.warn("STRIPE_SECRET_KEY is not set. Stripe webhook will not work correctly.");
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20",
    })
  : null;

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function setUserPlanBySession(session) {
  const userId = session?.metadata?.userId || session?.client_reference_id;

  if (!userId) {
    console.warn("Stripe checkout.session.completed without userId metadata");
    return;
  }

  await dbConnect();
  const user = await User.findById(userId);
  if (!user) {
    console.warn("User not found for Stripe session userId:", userId);
    return;
  }

  user.plan = "creator";
  user.stripeCustomerId = session.customer || user.stripeCustomerId;
  // subscription can be id or object depending on Stripe config
  if (session.subscription) {
    user.stripeSubscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription.id;
  }

  await user.save();
  console.log("Updated user to Creator plan via Stripe checkout:", user.email || user._id);
}

async function downgradeUserByCustomerId(customerId) {
  if (!customerId) return;

  await dbConnect();
  const user = await User.findOne({ stripeCustomerId: customerId });
  if (!user) {
    console.warn("No user found for customer to downgrade:", customerId);
    return;
  }

  user.plan = "free";
  user.stripeSubscriptionId = undefined;
  await user.save();
  console.log("Downgraded user to Free plan for customer:", customerId);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  if (!stripe || !webhookSecret) {
    console.error("Stripe or STRIPE_WEBHOOK_SECRET not configured.");
    return res.status(500).send("Stripe not configured");
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        await setUserPlanBySession(session);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await downgradeUserByCustomerId(subscription.customer);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        console.warn("Stripe invoice.payment_failed for customer:", invoice.customer);
        // 可选：也可以在多次失败后降级用户套餐
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        console.log("Stripe invoice.payment_succeeded for customer:", invoice.customer);
        break;
      }

      default: {
        console.log(`Unhandled Stripe event type: ${event.type}`);
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Error handling Stripe webhook event:", err);
    return res.status(500).send("Webhook handler error");
  }
}
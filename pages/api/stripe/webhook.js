// pages/api/stripe/webhook.js
import { connectMongoUsage } from "../../../lib/mongoConnectUsage";
import Subscription from "../../../models/Subscription";

export const config = {
  api: {
    bodyParser: true, // 使用 Next 默认 JSON 解析；此版本不做签名验证，仅供开发使用
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ⚠️ 注意：这里没有验证 Stripe 签名，只适合开发环境。
  // 以后要上线生产，需要根据 STRIPE_WEBHOOK_SECRET 做签名校验。

  const event = req.body;

  try {
    await connectMongoUsage();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const email =
          session.customer_details?.email || session.customer_email || null;
        const subscriptionId = session.subscription || null;
        const customerId = session.customer || null;

        if (email && subscriptionId) {
          await Subscription.findOneAndUpdate(
            { email },
            {
              email,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              plan: "creator",
              status: "active",
            },
            { upsert: true, new: true }
          );
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const subscriptionId = subscription.id;
        const status = subscription.status; // active, canceled, past_due, etc.

        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: subscriptionId },
          { status },
          { new: true }
        );
        break;
      }
      default:
        // 其它事件暂不处理
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    res.status(500).json({ error: "Webhook handler failed." });
  }
}

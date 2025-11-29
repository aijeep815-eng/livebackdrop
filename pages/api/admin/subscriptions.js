// pages/api/admin/subscriptions.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectMongoUsage } from "../../../lib/mongoConnectUsage";
import Subscription from "../../../models/Subscription";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // 简单版本：谁能访问 /admin 区域，由前端/路由控制。
  // 以后如果你有 isAdmin 字段，可以在这里加更严格的检查。
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectMongoUsage();

    const subs = await Subscription.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return res.status(200).json({ subscriptions: subs });
  } catch (error) {
    console.error("Error loading subscriptions:", error);
    return res.status(500).json({ error: "Failed to load subscriptions" });
  }
}

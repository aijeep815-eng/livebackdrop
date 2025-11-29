// pages/api/usage/today.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectMongoUsage } from "../../../lib/mongoConnectUsage";
import UserUsage from "../../../models/UserUsage";
import Subscription from "../../../models/Subscription";

const DAILY_LIMIT = 5;

function getTodayString() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    // 未登录用户，前端可以视为访客
    return res.status(200).json({
      userId: null,
      date: getTodayString(),
      count: 0,
      limit: DAILY_LIMIT,
      loggedIn: false,
      isPremium: false,
      plan: "guest",
    });
  }

  const user = session.user;
  const userId = user.id || user._id || user.email;
  const email = user.email;

  await connectMongoUsage();

  const today = getTodayString();

  let isPremium = false;
  let plan = "free";

  if (email) {
    const sub = await Subscription.findOne({
      email,
      status: "active",
    }).lean();
    if (sub) {
      isPremium = true;
      plan = sub.plan || "creator";
    }
  }

  let count = 0;

  if (!isPremium && userId) {
    const doc = await UserUsage.findOne({ userId, date: today }).lean();
    count = doc?.count || 0;
  }

  return res.status(200).json({
    userId,
    date: today,
    count,
    limit: DAILY_LIMIT,
    loggedIn: true,
    isPremium,
    plan,
  });
}

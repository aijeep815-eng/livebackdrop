// pages/api/usage/today.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectMongoUsage } from "../../../lib/mongoConnectUsage";
import UserUsage from "../../../models/UserUsage";

const DAILY_LIMIT = 5;

function getTodayString() {
  const now = new Date();
  // Use UTC date to avoid timezone confusion; can adjust later if needed
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
    // 未登录用户，前端可以视为 0 次，用默认免费计划
    return res.status(200).json({
      userId: null,
      date: getTodayString(),
      count: 0,
      limit: DAILY_LIMIT,
      loggedIn: false,
    });
  }

  const user = session.user;
  const userId = user.id || user._id || user.email;

  if (!userId) {
    return res.status(200).json({
      userId: null,
      date: getTodayString(),
      count: 0,
      limit: DAILY_LIMIT,
      loggedIn: false,
    });
  }

  await connectMongoUsage();

  const today = getTodayString();

  const doc = await UserUsage.findOne({ userId, date: today });

  return res.status(200).json({
    userId,
    date: today,
    count: doc?.count || 0,
    limit: DAILY_LIMIT,
    loggedIn: true,
  });
}

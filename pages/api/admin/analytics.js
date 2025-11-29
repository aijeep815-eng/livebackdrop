// pages/api/admin/analytics.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectMongoUsage } from "../../../lib/mongoConnectUsage";
import Subscription from "../../../models/Subscription";
import User from "../../../models/User";
import UserUsage from "../../../models/UserUsage";

function formatDate(d) {
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectMongoUsage();

    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 6); // 最近 7 天

    const [totalUsers, subCounts, usageAgg] = await Promise.all([
      User.countDocuments({}),
      Subscription.aggregate([
        {
          $group: {
            _id: { status: "$status", plan: "$plan" },
            count: { $sum: 1 },
          },
        },
      ]),
      UserUsage.aggregate([
        {
          $match: {
            date: { $gte: formatDate(start) },
          },
        },
        {
          $group: {
            _id: "$date",
            totalCount: { $sum: "$count" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    let totalSubscriptions = 0;
    let activeSubscriptions = 0;
    let creatorActive = 0;

    subCounts.forEach((row) => {
      const status = row._id.status || "unknown";
      const plan = row._id.plan || "unknown";
      const count = row.count || 0;
      totalSubscriptions += count;
      if (status === "active") {
        activeSubscriptions += count;
        if (plan === "creator") {
          creatorActive += count;
        }
      }
    });

    // 组装最近 7 天的日期数组
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push(formatDate(d));
    }

    const usageByDate = {};
    usageAgg.forEach((row) => {
      usageByDate[row._id] = row.totalCount || 0;
    });

    const usageLast7Days = days.map((date) => ({
      date,
      total: usageByDate[date] || 0,
    }));

    return res.status(200).json({
      stats: {
        totalUsers,
        totalSubscriptions,
        activeSubscriptions,
        creatorActive,
      },
      usageLast7Days,
    });
  } catch (error) {
    console.error("Error loading analytics:", error);
    return res.status(500).json({ error: "Failed to load analytics" });
  }
}

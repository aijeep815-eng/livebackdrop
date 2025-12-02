import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.email) {
      return res.status(200).json({
        authenticated: false,
        plan: "guest",
        dailyGenerateLimit: 0,
        dailyUploadLimit: 0,
      });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    const plan =
      (user && (user.plan || user.subscriptionPlan)) || "free";

    let dailyGenerateLimit = 3;
    let dailyUploadLimit = 10;

    if (plan === "creator" || plan === "creator_unlimited") {
      dailyGenerateLimit = -1;
      dailyUploadLimit = -1;
    }

    return res.status(200).json({
      authenticated: true,
      plan,
      dailyGenerateLimit,
      dailyUploadLimit,
      email: session.user.email,
    });
  } catch (err) {
    console.error("/api/me/plan error:", err);
    return res.status(500).json({ error: "Failed to load plan status" });
  }
}
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user || !session.user.email) {
      return res
        .status(401)
        .json({ ok: false, error: "Not authenticated" });
    }

    await dbConnect();

    const update = {
      plan: "creator",
      subscriptionPlan: "creator",
    };

    await User.updateOne({ email: session.user.email }, { $set: update });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("/api/stripe/sync-plan error:", err);
    return res.status(500).json({ ok: false, error: "Failed to sync plan" });
  }
}
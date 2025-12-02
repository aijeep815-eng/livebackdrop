import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(200).json({ plan: "free" });

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) return res.status(200).json({ plan: "free" });

    res.status(200).json({
      plan: user.subscriptionPlan || "free",
    });
  } catch (err) {
    res.status(200).json({ plan: "free" });
  }
}

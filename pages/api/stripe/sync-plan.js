import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ ok: false });

    await dbConnect();
    await User.updateOne(
      { email: session.user.email },
      { subscriptionPlan: "creator" }
    );

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
}

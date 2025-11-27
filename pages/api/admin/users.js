// pages/api/admin/users.js
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    // 未登录
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await dbConnect();
    const dbUser = await User.findOne({ email: session.user.email }).lean();

    // 非管理员禁止访问
    if (!dbUser || dbUser.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const users = await User.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json(
      users.map((u) => ({
        _id: u._id,
        email: u.email,
        role: u.role || "user",
        createdAt: u.createdAt
      }))
    );
  } catch (e) {
    console.error("Error loading users", e);
    return res.status(500).json({ message: "Error loading users" });
  }
}

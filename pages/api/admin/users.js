// pages/api/admin/users.js
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  try {
    await dbConnect();
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(
      users.map((u) => ({
        _id: u._id,
        email: u.email,
        role: u.role || "user",
        createdAt: u.createdAt
      }))
    );
  } catch (e) {
    console.error("Error loading users", e);
    res.status(500).json({ message: "Error loading users" });
  }
}

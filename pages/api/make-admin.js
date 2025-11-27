// pages/api/make-admin.js
import dbConnect from "../../lib/dbConnect";
import User from "../../models/User";

export default async function handler(req, res) {
  try {
    await dbConnect();

    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ message: "Missing email" });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "User updated to admin successfully",
      user,
    });
  } catch (e) {
    console.error("make-admin error:", e);
    return res.status(500).json({ message: "Server error" });
  }
}

// pages/api/admin/backgrounds.js
import dbConnect from "../../../lib/dbConnect";
import Background from "../../../models/Background";
import User from "../../../models/User";

export default async function handler(req, res) {
  try {
    await dbConnect();

    // 后台查看最近 100 条背景记录（目前你还没写入，这里会返回空数组）
    const items = await Background.find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("user", "email")
      .lean();

    return res.status(200).json(
      items.map((item) => ({
        _id: item._id,
        email: item.user?.email || "",
        prompt: item.prompt || "",
        model: item.model || "",
        imageUrl: item.imageUrl,
        width: item.width || null,
        height: item.height || null,
        createdAt: item.createdAt
      }))
    );
  } catch (e) {
    console.error("Error loading backgrounds", e);
    return res.status(500).json({ message: "Error loading backgrounds" });
  }
}

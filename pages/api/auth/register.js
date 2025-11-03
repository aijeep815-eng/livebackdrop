import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name, email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing email or password" });
  await connectDB();
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: "Email already registered" });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name: name || "", email, password: hash });
  return res.status(201).json({ ok: true, id: user._id.toString() });
}

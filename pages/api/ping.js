import { connectDB } from '@/lib/mongodb';

export default async function handler(req, res) {
  try {
    await connectDB();
    return res.status(200).json({ ok: true, t: Date.now() });
  } catch (e) {
    return res.status(500).json({ ok: false });
  }
}

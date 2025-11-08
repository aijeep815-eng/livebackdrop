import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { email, password, name = '' } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    await connectDB();
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already registered.' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, name });
    return res.status(201).json({ ok: true, id: user._id });
  } catch (e) {
    console.error('Register error:', e);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// pages/api/auth/register.js
import { dbConnect } from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const { email, password, name } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: 'Email and password are required.' });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ ok: false, message: 'Password should be at least 6 characters.' });
  }

  await dbConnect();

  const existing = await User.findOne({ email });
  if (existing && existing.password) {
    return res.status(400).json({ ok: false, message: 'This email has already been registered.' });
  }

  const hashed = await bcrypt.hash(password, 10);

  if (existing && !existing.password) {
    // 之前是 Google 登录创建的账号，现在补上密码
    existing.password = hashed;
    existing.name = existing.name || name;
    existing.provider = 'mixed';
    await existing.save();
  } else if (!existing) {
    await User.create({
      email,
      name,
      password: hashed,
      provider: 'credentials',
    });
  }

  return res.status(201).json({ ok: true, message: 'Registered successfully.' });
}

// pages/api/user/change-password.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { dbConnect } from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ ok: false, message: '当前密码和新密码不能为空。' });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ ok: false, message: '新密码长度至少 6 位。' });
  }

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return res.status(400).json({ ok: false, message: '用户不存在。' });
  }

  if (!user.password) {
    return res.status(400).json({
      ok: false,
      message: '该账号是通过第三方登录创建，目前没有本地密码。',
    });
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return res.status(400).json({ ok: false, message: '当前密码不正确。' });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();

  return res.status(200).json({ ok: true, message: '密码已更新。' });
}

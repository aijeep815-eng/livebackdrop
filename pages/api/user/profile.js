// pages/api/user/profile.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { dbConnect } from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const { name } = req.body || {};
  await dbConnect();

  const updated = await User.findOneAndUpdate(
    { email: session.user.email },
    { name },
    { new: true }
  ).lean();

  return res.status(200).json({
    ok: true,
    user: {
      name: updated?.name || '',
      email: updated?.email || session.user.email,
    },
  });
}

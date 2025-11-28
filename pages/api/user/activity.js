// pages/api/user/activity.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { dbConnect } from '../../../lib/mongodb';
import Usage from '../../../models/Usage';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  await dbConnect();

  let ip = 'unknown';
  let ua = 'unknown';

  try {
    const xf = req.headers['x-forwarded-for'];
    const raw = Array.isArray(xf) ? xf[0] : (xf || '').toString();
    const candidate =
      (raw || '')
        .split(',')[0]
        .trim() || req.socket?.remoteAddress || '';

    ip = candidate || 'unknown';
    ua = req.headers['user-agent'] || 'unknown';
  } catch (e) {
    // ignore
  }

  await Usage.create({
    userEmail: session.user.email,
    type: 'activity',
    ip,
    userAgent: ua,
    meta: {
      path: req.url || '',
    },
  });

  return res.status(200).json({ ok: true });
}

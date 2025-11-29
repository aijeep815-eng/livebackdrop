// pages/api/stats.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import dbConnect from '../../lib/dbConnect';
import Upload from '../../models/Upload';
import Generation from '../../models/Generation';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res
      .status(405)
      .json({ error: `Method ${req.method} Not Allowed` });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    await dbConnect();
    const userId = session.user.id;

    const [uploadCount, generationCount] = await Promise.all([
      Upload.countDocuments({ user: userId }),
      Generation.countDocuments({ user: userId }),
    ]);

    const planName =
      session.user.planName ||
      session.user.plan ||
      session.user.subscriptionPlan ||
      'Free';

    let currentRights = '';
    if (planName.toLowerCase().startsWith('free')) {
      currentRights = '免费用户：每天可生成有限数量背景，适合轻量使用。';
    } else {
      currentRights =
        '付费用户：可享受更高的生成次数、更快的队列以及更高优先级支持。';
    }

    return res.status(200).json({
      uploadCount,
      generationCount,
      currentRights,
    });
  } catch (err) {
    console.error('Error loading stats:', err);
    return res.status(500).json({ error: 'Failed to load stats' });
  }
}

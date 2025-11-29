// pages/api/stats.js
// 返回当前登录用户的使用统计：AI 生成次数、上传素材次数

import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import dbConnect from '../../lib/dbConnect';
import Generation from '../../models/Generation';
import Upload from '../../models/Upload';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res
      .status(405)
      .json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();

    const userId = session.user.id;

    const [totalGenerations, totalUploads] = await Promise.all([
      Generation.countDocuments({ user: userId }),
      Upload.countDocuments({ user: userId }),
    ]);

    return res.status(200).json({
      totalGenerations,
      totalUploads,
    });
  } catch (err) {
    console.error('Error in /api/stats:', err);
    return res.status(500).json({
      error: err.message || 'Failed to load stats.',
    });
  }
}

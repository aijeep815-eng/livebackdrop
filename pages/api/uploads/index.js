// pages/api/uploads/index.js
// 负责记录用户上传的素材信息，并根据套餐限制每天上传次数

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import Upload from '../../../models/Upload';

const FREE_DAILY_UPLOADS = 10;

function getPlanKey(user) {
  const raw =
    user?.subscriptionPlan ||
    user?.planName ||
    user?.plan ||
    user?.stripePlan ||
    '';
  if (!raw) return 'free';
  const val = String(raw).toLowerCase();
  if (val.includes('creator') && val.includes('unlimited')) return 'creator-unlimited';
  return 'free';
}

function getLimitsForUser(user) {
  const planKey = getPlanKey(user);
  if (planKey === 'creator-unlimited') {
    return {
      planKey,
      dailyUploads: Infinity,
    };
  }
  return {
    planKey: 'free',
    dailyUploads: FREE_DAILY_UPLOADS,
  };
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ error: '请先登录后再上传素材。' });
  }

  const user = session.user;
  const userId = user.id;
  const limits = getLimitsForUser(user);

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const uploads = await Upload.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(100);
      return res.status(200).json({ uploads });
    } catch (err) {
      console.error('Error loading uploads:', err);
      return res
        .status(500)
        .json({ error: '加载上传记录失败，请稍后再试。' });
    }
  }

  if (req.method === 'POST') {
    const body = req.body || {};

    if (!body.url || !body.publicId) {
      return res
        .status(400)
        .json({ error: 'Missing url or publicId' });
    }

    try {
      // 计算当天 00:00
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      let todayCount = 0;
      if (Number.isFinite(limits.dailyUploads)) {
        todayCount = await Upload.countDocuments({
          user: userId,
          createdAt: { $gte: startOfDay },
        });
        if (todayCount >= limits.dailyUploads) {
          return res.status(403).json({
            error:
              '你今天的免费素材上传次数已经用完了，可以明天再来，或者升级套餐享受不限量上传。',
            code: 'UPLOAD_LIMIT_REACHED',
            limit: limits.dailyUploads,
            used: todayCount,
            planKey: limits.planKey,
          });
        }
      }

      const upload = await Upload.create({
        user: userId,
        url: body.url,
        publicId: body.publicId,
        width: body.width,
        height: body.height,
        bytes: body.bytes,
        format: body.format,
        resourceType: body.resourceType,
      });

      const remaining =
        Number.isFinite(limits.dailyUploads)
          ? Math.max(limits.dailyUploads - (todayCount + 1), 0)
          : null;

      return res.status(201).json({
        upload,
        limit: limits.dailyUploads,
        used: todayCount + 1,
        remaining,
      });
    } catch (err) {
      console.error('Error creating upload:', err);
      return res
        .status(500)
        .json({ error: '保存上传记录失败，请稍后再试。' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res
    .status(405)
    .json({ error: `Method ${req.method} Not Allowed` });
}

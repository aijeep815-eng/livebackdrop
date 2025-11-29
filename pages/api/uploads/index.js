// pages/api/uploads/index.js
// 统一版：记录 Cloudinary 上传，并根据套餐限制每日上传次数（免费 10 次 / 天）

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import Upload from '../../../models/Upload';

// 上传次数限额
const LIMITS = {
  free: {
    dailyUploads: 10,
  },
  pro: {
    dailyUploads: Infinity,
  },
};

function getPlanKey(user = {}) {
  const raw =
    user.subscriptionPlan ||
    user.planName ||
    user.plan ||
    user.stripePlan ||
    '';
  const lower = raw.toString().toLowerCase();

  if (
    lower.includes('creator') ||
    lower.includes('pro') ||
    lower.includes('unlimited')
  ) {
    return 'pro';
  }

  return 'free';
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.id) {
    return res
      .status(401)
      .json({ error: '请先登录后再上传或查看素材。' });
  }

  await dbConnect();

  const userId = session.user.id;
  const planKey = getPlanKey(session.user);
  const planLimits = LIMITS[planKey] || LIMITS.free;

  if (req.method === 'GET') {
    try {
      const uploads = await Upload.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

      return res.status(200).json({ uploads });
    } catch (err) {
      console.error('Error loading uploads:', err);
      return res
        .status(500)
        .json({ error: '加载素材失败，请稍后再试。' });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      if (!body.url || !body.publicId) {
        return res
          .status(400)
          .json({ error: '缺少 url 或 publicId。' });
      }

      // 限制每日上传次数（仅对免费用户生效）
      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      let todayCount = 0;
      if (Number.isFinite(planLimits.dailyUploads)) {
        todayCount = await Upload.countDocuments({
          user: userId,
          createdAt: { $gte: startOfDay },
        });

        if (todayCount >= planLimits.dailyUploads) {
          return res.status(403).json({
            error:
              '你今天的免费素材上传次数（10 张）已经用完了。可以明天再来，或者前往 /pricing 升级到 CreatorUnlimited，解锁不限量上传。',
            code: 'UPLOAD_LIMIT_REACHED',
            limit: planLimits.dailyUploads,
            used: todayCount,
            planKey,
          });
        }
      }

      const upload = await Upload.create({
        user: userId,
        url: body.url,
        publicId: body.publicId,
        width: body.width || null,
        height: body.height || null,
        bytes: body.bytes || null,
        format: body.format || null,
        resourceType: body.resourceType || null,
      });

      const usedAfter = todayCount + 1;

      return res.status(201).json({
        upload,
        planKey,
        limit: planLimits.dailyUploads,
        used: usedAfter,
        remaining: Number.isFinite(planLimits.dailyUploads)
          ? Math.max(planLimits.dailyUploads - usedAfter, 0)
          : null,
      });
    } catch (err) {
      console.error('Error saving upload:', err);
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

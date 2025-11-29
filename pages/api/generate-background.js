// pages/api/generate-background.js
// 统一版：根据用户套餐限制每日 AI 生成次数（免费 3 张 / 天，Pro / CreatorUnlimited 不限）

import OpenAI from 'openai';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import dbConnect from '../../lib/dbConnect';
import Generation from '../../models/Generation';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 套餐限额配置
const LIMITS = {
  free: {
    dailyGenerations: 3,
  },
  pro: {
    dailyGenerations: Infinity,
  },
};

// 从用户对象中推断套餐类型（免费 / Pro / CreatorUnlimited）
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
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res
      .status(405)
      .json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.id) {
      return res
        .status(401)
        .json({ error: '请先登录后再生成虚拟背景。' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: '服务器缺少 OPENAI_API_KEY，请联系站长配置后再试。',
      });
    }

    const { prompt, style, aspectRatio } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res
        .status(400)
        .json({ error: '缺少有效的提示词（prompt）。' });
    }

    await dbConnect();

    const userId = session.user.id;
    const planKey = getPlanKey(session.user);
    const planLimits = LIMITS[planKey] || LIMITS.free;

    // 计算当天使用次数（仅统计主生成接口，忽略图像实验室的 operation 字段）
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    let todayCount = 0;
    if (Number.isFinite(planLimits.dailyGenerations)) {
      todayCount = await Generation.countDocuments({
        user: userId,
        createdAt: { $gte: startOfDay },
        $or: [
          { operation: { $exists: false } },
          { operation: null },
        ],
      });

      if (todayCount >= planLimits.dailyGenerations) {
        return res.status(403).json({
          error:
            '你今天的免费 AI 背景生成次数（3 张）已经用完了。可以明天再来，或者前往 /pricing 升级到 CreatorUnlimited，解锁不限量生成。',
          code: 'GEN_LIMIT_REACHED',
          limit: planLimits.dailyGenerations,
          used: todayCount,
          planKey,
        });
      }
    }

    // 组合最终提示词（可选附加风格信息）
    let finalPrompt = prompt.trim();
    if (style && typeof style === 'string') {
      finalPrompt += `, in ${style} style`;
    }

    // 为了控制成本，这里固定使用 1024×1024
    const result = await openai.images.generate({
      model: 'dall-e-2',
      prompt: finalPrompt,
      size: '1024x1024',
      n: 1,
    });

    const image = result.data && result.data[0];
    if (!image || !image.url) {
      throw new Error('OpenAI 没有返回图片地址。');
    }

    try {
      await Generation.create({
        user: userId,
        imageUrl: image.url,
        thumbUrl: image.url,
        prompt: finalPrompt,
        styleName: style || null,
        aspectRatio: aspectRatio || '1:1',
        // 不设置 operation，方便和图像实验室的记录区分
      });
    } catch (logErr) {
      console.error('Failed to save Generation document:', logErr);
    }

    const usedAfter = todayCount + 1;

    return res.status(200).json({
      imageUrl: image.url,
      model: result.model || 'dall-e-2',
      created: result.created,
      planKey,
      limit: planLimits.dailyGenerations,
      used: usedAfter,
      remaining: Number.isFinite(planLimits.dailyGenerations)
        ? Math.max(planLimits.dailyGenerations - usedAfter, 0)
        : null,
    });
  } catch (err) {
    console.error('Error in /api/generate-background:', err);
    return res.status(500).json({
      error:
        err?.response?.data?.error?.message ||
        err?.response?.data?.error ||
        err?.message ||
        '生成背景失败，请稍后再试。',
    });
  }
}

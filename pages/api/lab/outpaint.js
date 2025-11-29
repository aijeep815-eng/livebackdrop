// pages/api/lab/outpaint.js
// 功能一：扩展为宽屏背景（概念上的扩展，目前基于文字提示）

import OpenAI from 'openai';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import Generation from '../../../models/Generation';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 图像实验室每天使用次数（免费用户总共 1 次 / 天）
const LIMITS = {
  free: {
    dailyLabOps: 1,
  },
  pro: {
    dailyLabOps: Infinity,
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

async function ensureAuth(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user || !session.user.id) {
    res
      .status(401)
      .json({ error: '请先登录后再使用图像实验室功能。' });
    return null;
  }
  return session.user;
}

function normalizeBody(reqBody) {
  const body = reqBody || {};
  const imageUrl = body.imageUrl;
  const extraPrompt = (body.extraPrompt || '').toString().trim();
  return { imageUrl, extraPrompt };
}

async function ensureLabLimit(userId, planKey) {
  const planLimits = LIMITS[planKey] || LIMITS.free;

  if (!Number.isFinite(planLimits.dailyLabOps)) {
    return { limit: planLimits.dailyLabOps, used: 0 };
  }

  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const used = await Generation.countDocuments({
    user: userId,
    createdAt: { $gte: startOfDay },
    operation: { $in: ['outpaint', 'style', 'cleanup', 'replace'] },
  });

  if (used >= planLimits.dailyLabOps) {
    const err = new Error(
      '你今天的免费图像实验室次数（1 次）已经用完了。可以明天再来，或者前往 /pricing 升级到 CreatorUnlimited，解锁不限量使用。'
    );
    err.code = 'LAB_LIMIT_REACHED';
    err.limit = planLimits.dailyLabOps;
    err.used = used;
    throw err;
  }

  return {
    limit: planLimits.dailyLabOps,
    used,
  };
}

async function callImageModel(prompt) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('服务器缺少 OPENAI_API_KEY 环境变量。');
  }

  const result = await openai.images.generate({
    model: 'dall-e-2',
    prompt,
    size: '1024x1024',
    n: 1,
  });

  const image = result.data && result.data[0];
  if (!image || !image.url) {
    throw new Error('OpenAI 返回结果中没有图片地址。');
  }

  return {
    imageUrl: image.url,
    model: result.model || 'dall-e-2',
    created: result.created,
  };
}


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res
      .status(405)
      .json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const user = await ensureAuth(req, res);
    if (!user) return;

    const { imageUrl, extraPrompt } = normalizeBody(req.body);

    if (!imageUrl) {
      return res.status(400).json({ error: '缺少 imageUrl。' });
    }

    await dbConnect();

    const planKey = getPlanKey(user);
    const limitInfo = await ensureLabLimit(user.id, planKey);

    const basePrompt =
      'A wide 16:9 livestream virtual background that extends and re-imagines the scene from a reference image (the model does not see the image, only this description). Clean composition, suitable as a video call or livestream background.';

    const finalPrompt = extraPrompt
      ? `${basePrompt} Additional preferences: ${extraPrompt}.`
      : basePrompt;

    const result = await callImageModel(finalPrompt);

    try {
      await Generation.create({
        user: user.id,
        imageUrl: result.imageUrl,
        thumbUrl: result.imageUrl,
        prompt: finalPrompt,
        operation: 'outpaint',
        sourceImage: imageUrl,
      });
    } catch (logErr) {
      console.error('Failed to log lab outpaint generation:', logErr);
    }

    const usedAfter = limitInfo.used + 1;

    return res.status(200).json({
      imageUrl: result.imageUrl,
      model: result.model,
      created: result.created,
      planKey,
      limit: limitInfo.limit,
      used: usedAfter,
      remaining: Number.isFinite(limitInfo.limit)
        ? Math.max(limitInfo.limit - usedAfter, 0)
        : null,
    });
  } catch (err) {
    console.error('Error in /api/lab/outpaint:', err);

    if (err.code === 'LAB_LIMIT_REACHED') {
      return res.status(403).json({
        error: err.message,
        code: err.code,
        limit: err.limit,
        used: err.used,
      });
    }

    return res.status(500).json({
      error:
        err?.response?.data?.error?.message ||
        err?.response?.data?.error ||
        err?.message ||
        '扩展背景失败，请稍后再试。',
    });
  }
}

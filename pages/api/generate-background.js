// pages/api/generate-background.js
// 带套餐限制的统一生成接口：检查当天次数 -> 调 OpenAI -> 写入 Generation 表 -> 返回 imageUrl

import OpenAI from 'openai';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import dbConnect from '../../lib/dbConnect';
import Generation from '../../models/Generation';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 免费版每日限制
const FREE_DAILY_GENERATIONS = 5;

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
      dailyGenerations: Infinity,
    };
  }
  return {
    planKey: 'free',
    dailyGenerations: FREE_DAILY_GENERATIONS,
  };
}

function buildPrompt(prompt, style) {
  if (!style) return prompt;

  const styleMap = {
    realistic:
      'highly detailed, photorealistic, natural lighting, 4k resolution',
    studio:
      'professional studio lighting, clean background, soft box light, shallow depth of field',
    cartoon:
      'cartoon illustration, vector style, clean lines, bright colors, soft shading',
    minimal:
      'minimalist style, clean composition, few elements, neutral colors, lots of negative space',
  };

  const styleText = styleMap[style] || '';
  if (!styleText) return prompt;
  return `${prompt}, ${styleText}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res
      .status(405)
      .json({ error: `Method ${req.method} Not Allowed` });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error:
        '服务器缺少 OPENAI_API_KEY 环境变量，请到 Vercel 项目设置中配置。',
    });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ error: '请先登录后再生成虚拟背景。' });
  }

  const user = session.user;
  const userId = user.id;
  const limits = getLimitsForUser(user);

  const { prompt, style } = req.body || {};

  if (!prompt || typeof prompt !== 'string') {
    return res
      .status(400)
      .json({ error: '缺少提示词（prompt）。' });
  }

  try {
    await dbConnect();

    // 计算当天 00:00
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 若有次数限制，先算当天已生成多少
    let todayCount = 0;
    if (Number.isFinite(limits.dailyGenerations)) {
      todayCount = await Generation.countDocuments({
        user: userId,
        createdAt: { $gte: startOfDay },
      });
      if (todayCount >= limits.dailyGenerations) {
        return res.status(403).json({
          error:
            '你今天的免费生成次数已经用完了，可以明天再来，或者升级套餐享受不限量生成。',
          code: 'GEN_LIMIT_REACHED',
          limit: limits.dailyGenerations,
          used: todayCount,
          planKey: limits.planKey,
        });
      }
    }

    const finalPrompt = buildPrompt(prompt, style);

    const result = await openai.images.generate({
      model: 'dall-e-2',
      prompt: finalPrompt,
      size: '1024x1024',
      n: 1,
    });

    const image = result.data && result.data[0];

    if (!image || !image.url) {
      console.error('OpenAI image response missing url:', result);
      return res.status(500).json({
        error: 'OpenAI 返回结果中没有图片地址，请稍后再试。',
      });
    }

    const imageUrl = image.url;

    // 写入 Generation 表
    try {
      await Generation.create({
        user: userId,
        imageUrl,
        thumbUrl: imageUrl,
        prompt: prompt.trim(),
        style: style || undefined,
        planAtGeneration:
          user.subscriptionPlan ||
          user.planName ||
          user.plan ||
          'unknown',
        creditsCost: 1,
      });
    } catch (logErr) {
      console.error('Failed to log generation to DB:', logErr);
      // 不影响前端返回
    }

    const remaining =
      Number.isFinite(limits.dailyGenerations)
        ? Math.max(limits.dailyGenerations - (todayCount + 1), 0)
        : null;

    return res.status(200).json({
      imageUrl,
      model: result.model || 'dall-e-2',
      created: result.created,
      planKey: limits.planKey,
      limit: limits.dailyGenerations,
      used: todayCount + 1,
      remaining,
    });
  } catch (err) {
    console.error('Error in /api/generate-background:', err);
    const message =
      err?.response?.data?.error?.message ||
      err?.response?.data?.error ||
      err?.message ||
      '生成失败，请稍后再试。';
    return res.status(500).json({ error: message });
  }
}

import { getSession } from 'next-auth/react';
import OpenAI from 'openai';
import dbConnect from '../../../lib/dbConnect';
import Generation from '../../../models/Generation';
import DailyUsage from '../../../models/DailyUsage';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 估算单张图片成本（美元）
// 你现在用的是 gpt-image-1，低质量 / auto，我们先粗略按 0.011 美元算一张。
// 如果以后要换模型或质量，可以在环境变量里覆盖：COST_PER_IMAGE_USD=0.011
const DEFAULT_COST_PER_IMAGE = 0.011;

function getCostPerImage() {
  const fromEnv = process.env.COST_PER_IMAGE_USD;
  if (!fromEnv) return DEFAULT_COST_PER_IMAGE;
  const n = Number(fromEnv);
  if (Number.isNaN(n) || n <= 0) return DEFAULT_COST_PER_IMAGE;
  return n;
}

function buildFinalPrompt({ basePrompt, extraPrompt, style }) {
  let parts = [];

  if (basePrompt) parts.push(basePrompt);
  if (style) parts.push(style);
  if (extraPrompt) parts.push(extraPrompt);

  const joined = parts.join(', ').trim();

  if (!joined) {
    return 'professional live streaming virtual background, clean, well lit, no people, suitable for talking head video';
  }

  return joined;
}

// 把日期归一化到 UTC 的 00:00:00，方便做「按天」统计
function normalizeDateToUTC(date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

async function recordDailyCost({ userId, images = 1, costUsd }) {
  const date = normalizeDateToUTC(new Date());

  await DailyUsage.findOneAndUpdate(
    { user: userId, date },
    {
      $inc: {
        imageGenerations: images,
        costUsd,
      },
      $setOnInsert: {
        user: userId,
        date,
      },
    },
    { upsert: true, new: true }
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.id;

  const { prompt, extraPrompt, style, size } = req.body || {};

  const finalPrompt = buildFinalPrompt({
    basePrompt: prompt,
    extraPrompt,
    style,
  });

  try {
    await dbConnect();

    const imageSize = size && typeof size === 'string' ? size : 'auto';

    const result = await client.images.generate({
      model: 'gpt-image-1',
      prompt: finalPrompt,
      size: imageSize,
    });

    const first = result?.data?.[0] || null;

    const imageUrl = first?.url || first?.image_url || null;

    if (!imageUrl) {
      return res
        .status(500)
        .json({ error: 'AI 返回结果中没有图片地址。' });
    }

    // 写入 Generation 表：记录本次生成
    const generationDoc = await Generation.create({
      user: userId,
      prompt: finalPrompt,
      imageUrl,
      result: first,
      operation: 'generate',
    });

    // 估算成本并写入 DailyUsage
    const costPerImage = getCostPerImage();
    const estimatedCost = costPerImage;

    try {
      await recordDailyCost({
        userId,
        images: 1,
        costUsd: estimatedCost,
      });
    } catch (e) {
      // 成本记录失败不能影响正常生成，所以只打印日志
      console.error('recordDailyCost failed:', e);
    }

    return res.status(200).json({
      imageUrl,
      id: generationDoc._id.toString(),
      prompt: finalPrompt,
      createdAt: generationDoc.createdAt,
      estimatedCost,
    });
  } catch (err) {
    console.error('Error in /api/ai/generate:', err);
    return res
      .status(500)
      .json({ error: '生成失败，请稍后再试。' });
  }
}

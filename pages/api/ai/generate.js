import { getSession } from 'next-auth/react';
import OpenAI from 'openai';
import dbConnect from '../../../lib/dbConnect';
import Generation from '../../../models/Generation';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // 这里假设你的限额逻辑已经在别的地方实现了（例如中间件或单独的函数），
    // 如果之前有「每天 3 张」检查，可以在这里再接回去调用。
    // 为了避免和你现有逻辑冲突，这里暂时只做最基础的生成 + 写表。

    const imageSize = size && typeof size === 'string' ? size : 'auto';

    const result = await client.images.generate({
      model: 'gpt-image-1',
      prompt: finalPrompt,
      size: imageSize, // 建议前端传 'auto' 或合法值
    });

    const imageUrl =
      result?.data?.[0]?.url ||
      result?.data?.[0]?.image_url ||
      null;

    if (!imageUrl) {
      return res
        .status(500)
        .json({ error: 'AI 返回结果中没有图片地址。' });
    }

    // ✅ 关键：把 imageUrl 写入 Generation 表
    const generationDoc = await Generation.create({
      user: userId,
      prompt: finalPrompt,
      imageUrl,
      operation: null, // 普通生成
    });

    return res.status(200).json({
      imageUrl,
      id: generationDoc._id.toString(),
      prompt: finalPrompt,
      createdAt: generationDoc.createdAt,
    });
  } catch (err) {
    console.error('Error in /api/ai/generate:', err);
    return res
      .status(500)
      .json({ error: '生成失败，请稍后再试。' });
  }
}

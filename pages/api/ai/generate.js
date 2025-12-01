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

    const imageSize = size && typeof size === 'string' ? size : 'auto';

    const result = await client.images.generate({
      model: 'gpt-image-1',
      prompt: finalPrompt,
      size: imageSize,
    });

    const first = result?.data?.[0] || null;

    const imageUrl =
      first?.url ||
      first?.image_url ||
      null;

    if (!imageUrl) {
      return res
        .status(500)
        .json({ error: 'AI 返回结果中没有图片地址。' });
    }

    // ✅ 写入 Generation 表：这次 schema 已经有 imageUrl 字段
    const generationDoc = await Generation.create({
      user: userId,
      prompt: finalPrompt,
      imageUrl,
      result: first,
      operation: 'generate',
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

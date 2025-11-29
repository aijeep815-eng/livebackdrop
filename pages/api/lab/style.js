// pages/api/lab/style.js
// 功能二：生成多张同风格背景（概念上的风格一致，目前基于文字提示）

import OpenAI from 'openai';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import Generation from '../../../models/Generation';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function ensureAuth(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user || !session.user.id) {
    res.status(401).json({ error: '请先登录后再使用图像实验室功能。' });
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

  return { imageUrl: image.url, model: result.model || 'dall-e-2', created: result.created };
}


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const user = await ensureAuth(req, res);
    if (!user) return;

    const { imageUrl, extraPrompt } = normalizeBody(req.body);

    if (!imageUrl) {
      return res.status(400).json({ error: '缺少 imageUrl。' });
    }

    await dbConnect();

    const basePrompt =
      'A livestream virtual background that matches the mood and atmosphere of a reference image (the model does not see the image, only this description). Soft lighting, clear subject area behind the speaker, visually coherent.';

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
        operation: 'style',
        sourceImage: imageUrl,
      });
    } catch (logErr) {
      console.error('Failed to log lab style generation:', logErr);
    }

    return res.status(200).json({
      imageUrl: result.imageUrl,
      model: result.model,
      created: result.created,
    });
  } catch (err) {
    console.error('Error in /api/lab/style:', err);
    return res.status(500).json({
      error:
        err?.response?.data?.error?.message ||
        err?.response?.data?.error ||
        err?.message ||
        '生成同风格背景失败，请稍后再试。',
    });
  }
}

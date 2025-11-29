// Unified AI background generation endpoint (DALL·E 2 version)
// This file is safe to use for BOTH /api/generate and /api/ai/generate.
// Uses model `dall-e-2`, which usually不需要组织验证（相比 gpt-image-1 更宽松）。
// 返回结构：{ imageUrl }

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  const { prompt, style } = req.body || {};

  if (!prompt || typeof prompt !== 'string') {
    return res
      .status(400)
      .json({ error: 'Missing prompt in request body.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error:
        '服务器缺少 OPENAI_API_KEY 环境变量，请到 Vercel 项目设置中配置。',
    });
  }

  const finalPrompt = buildPrompt(prompt, style);

  try {
    const result = await openai.images.generate({
      model: 'dall-e-2',
      prompt: finalPrompt,
      size: '1024x1024', // ✅ DALL·E 2 支持的尺寸
      n: 1,
    });

    const image = result.data && result.data[0];

    if (!image || !image.url) {
      console.error('OpenAI image response missing url:', result);
      return res.status(500).json({
        error: 'OpenAI 返回结果中没有图片地址，请稍后再试。',
      });
    }

    return res.status(200).json({
      imageUrl: image.url,
      model: result.model || 'dall-e-2',
      created: result.created,
    });
  } catch (err) {
    console.error('OpenAI image generation error:', err);

    const message =
      err?.response?.data?.error?.message ||
      err?.response?.data?.error ||
      err?.message ||
      'OpenAI 调用失败，请稍后再试。';

    return res.status(500).json({ error: message });
  }
}

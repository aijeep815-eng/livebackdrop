// pages/api/generate-background.js
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

let client = null;
if (apiKey) {
  client = new OpenAI({ apiKey });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!apiKey || !client) {
    return res.status(500).json({
      error: "OPENAI_API_KEY is missing on the server.",
      status: 500,
    });
  }

  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
    return res.status(400).json({ error: "Prompt is too short." });
  }

  try {
    const finalPrompt = `
Ultra high resolution cinematic virtual background for live streaming or video calls.
No text, no logo, no watermark. Clean composition, good lighting, no people.
Style: professional, realistic, suitable as a Zoom / OBS background.
User description: ${prompt}
    `.trim();

    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt: finalPrompt,
      n: 1,
      size: "1536x1024",
    });

    const imageUrl = response?.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error("No image URL returned from OpenAI");
    }

    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Error generating background:", error);

    const status = error.status || error.statusCode || 500;

    return res.status(status).json({
      error:
        error?.error?.message ||
        error?.message ||
        "Failed to generate background image.",
      type: error?.error?.type || undefined,
      status,
    });
  }
}

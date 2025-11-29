// pages/api/generate-background.js
import OpenAI from "openai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { connectMongoUsage } from "../../lib/mongoConnectUsage";
import UserUsage from "../../models/UserUsage";
import Subscription from "../../models/Subscription";

const apiKey = process.env.OPENAI_API_KEY;
const DAILY_LIMIT = 5;

let client = null;
if (apiKey) {
  client = new OpenAI({ apiKey });
}

function getTodayString() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({
      error: "You must be logged in to generate AI backgrounds.",
      code: "NOT_AUTHENTICATED",
    });
  }

  const user = session.user;
  const userId = user.id || user._id || user.email;
  const email = user.email;

  if (!userId) {
    return res.status(401).json({
      error: "User information is incomplete. Please log in again.",
      code: "MISSING_USER_ID",
    });
  }

  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
    return res.status(400).json({ error: "Prompt is too short." });
  }

  try {
    await connectMongoUsage();
    const today = getTodayString();

    // 判断是否为付费会员
    let isPremium = false;
    if (email) {
      const sub = await Subscription.findOne({
        email,
        status: "active",
      }).lean();
      if (sub) {
        isPremium = true;
      }
    }

    // 免费用户才检查每日次数
    if (!isPremium) {
      let usage = await UserUsage.findOne({ userId, date: today });

      if (usage && usage.count >= DAILY_LIMIT) {
        return res.status(429).json({
          error:
            "Daily AI generation limit reached for your free plan. Please try again tomorrow or upgrade your membership (coming soon).",
          code: "DAILY_LIMIT_REACHED",
          limit: DAILY_LIMIT,
          count: usage.count,
        });
      }
    }

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

    // 只有免费用户才累加使用次数；付费用户不受限制
    if (!isPremium) {
      await UserUsage.findOneAndUpdate(
        { userId, date: today },
        { $inc: { count: 1 } },
        { upsert: true, new: true }
      );
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

// pages/api/generations/index.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import Generation from '../../../models/Generation';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  await dbConnect();
  const userId = session.user.id;

  if (req.method === 'GET') {
    try {
      const generations = await Generation.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      return res.status(200).json({ generations });
    } catch (err) {
      console.error('Error fetching generations:', err);
      return res.status(500).json({ error: 'Failed to fetch generations' });
    }
  }

  if (req.method === 'POST') {
    const {
      imageUrl,
      thumbUrl,
      prompt,
      style,
      width,
      height,
      planAtGeneration,
      creditsCost,
      meta,
    } = req.body || {};

    if (!imageUrl) {
      return res.status(400).json({ error: 'Missing imageUrl' });
    }

    try {
      const generation = await Generation.create({
        user: userId,
        imageUrl,
        thumbUrl,
        prompt,
        style,
        width,
        height,
        planAtGeneration,
        creditsCost,
        meta,
      });

      return res.status(201).json({ generation });
    } catch (err) {
      console.error('Error saving generation:', err);
      return res.status(500).json({ error: 'Failed to save generation' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res
    .status(405)
    .json({ error: `Method ${req.method} Not Allowed` });
}

// pages/api/feedback/index.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import Feedback from '../../../models/Feedback';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  await dbConnect();
  const userId = session.user.id;

  if (req.method === 'GET') {
    try {
      const feedbacks = await Feedback.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      return res.status(200).json({ feedbacks });
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      return res.status(500).json({ error: 'Failed to fetch feedbacks' });
    }
  }

  if (req.method === 'POST') {
    const { category, subject, message } = req.body || {};

    if (!subject || !message) {
      return res
        .status(400)
        .json({ error: 'Subject and message are required' });
    }

    try {
      const feedback = await Feedback.create({
        user: userId,
        email: session.user.email,
        category: category || 'other',
        subject,
        message,
      });

      return res.status(201).json({ feedback });
    } catch (err) {
      console.error('Error saving feedback:', err);
      return res.status(500).json({ error: 'Failed to save feedback' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res
    .status(405)
    .json({ error: `Method ${req.method} Not Allowed` });
}

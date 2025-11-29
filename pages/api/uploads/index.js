// pages/api/uploads/index.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import Upload from '../../../models/Upload';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  await dbConnect();

  const userId = session.user.id;

  if (req.method === 'GET') {
    try {
      const uploads = await Upload.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

      return res.status(200).json({ uploads });
    } catch (err) {
      console.error('Error fetching uploads:', err);
      return res.status(500).json({ error: 'Failed to fetch uploads' });
    }
  }

  if (req.method === 'POST') {
    const body = req.body || {};

    if (!body.url || !body.publicId) {
      return res.status(400).json({ error: 'Missing url or publicId' });
    }

    try {
      const upload = await Upload.create({
        user: userId,
        url: body.url,
        publicId: body.publicId,
        format: body.format,
        width: body.width,
        height: body.height,
        bytes: body.bytes,
        originalFilename: body.originalFilename,
        resourceType: body.resourceType || 'image',
        category: body.category || 'upload',
      });

      return res.status(201).json({ upload });
    } catch (err) {
      console.error('Error saving upload:', err);
      return res.status(500).json({ error: 'Failed to save upload' });
    }
  }

  res.setHeader('Allow', ['GET','POST']);
  return res.status(405).json({ error:`Method ${req.method} Not Allowed`});
}

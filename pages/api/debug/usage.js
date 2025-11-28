// pages/api/debug/usage.js
import { dbConnect } from '../../../lib/mongodb';
import Usage from '../../../models/Usage';

export default async function handler(req, res) {
  await dbConnect();

  const total = await Usage.countDocuments().catch(() => 0);
  const latest = await Usage.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .lean()
    .catch(() => []);

  res.status(200).json({
    ok: true,
    total,
    latest: latest.map((l) => ({
      userEmail: l.userEmail,
      type: l.type,
      ip: l.ip || '',
      createdAt: l.createdAt ? l.createdAt.toISOString() : null,
      meta: l.meta || {},
    })),
  });
}

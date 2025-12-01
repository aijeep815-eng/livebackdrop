import { getSession } from 'next-auth/react';

/**
 * 简单的 Session 刷新接口
 */
export default async function handler(req, res) {
  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(200).json(null);
    }

    return res.status(200).json(session);
  } catch (err) {
    console.error('Error in /api/auth/refresh:', err);
    return res.status(500).json({ error: 'Failed to refresh session' });
  }
}

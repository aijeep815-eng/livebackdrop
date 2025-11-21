export default function handler(req, res) {
  // 不泄露具体值，只告诉你有没有配置上
  const hasGoogleId = !!process.env.GOOGLE_CLIENT_ID;
  const hasGoogleSecret = !!process.env.GOOGLE_CLIENT_SECRET;
  const hasNextAuthUrl = !!process.env.NEXTAUTH_URL;

  res.status(200).json({
    ok: true,
    hasGoogleId,
    hasGoogleSecret,
    hasNextAuthUrl,
  });
}

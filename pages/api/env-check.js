export default function handler(req, res) {
  const keys = [
    'OPENAI_API_KEY',
    'MONGODB_URI',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ];

  const result = {};
  keys.forEach(key => {
    const value = process.env[key];
    result[key] = value ? '✅ Loaded' : '❌ Missing';
  });

  res.status(200).json({
    status: 'Environment Check',
    timestamp: new Date().toISOString(),
    result,
  });
}

export default function handler(req, res) {
  const baseUrl = 'https://livebackdrop.vercel.app';
  const pages = [
    '',
    '/auth/login',
    '/auth/register',
    '/generate',
    '/en',
    '/zh',
    '/es'
  ];

  const urls = pages.map(p => `${baseUrl}${p}`).join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `<url><loc>${baseUrl}${p}</loc></url>`).join('')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(sitemap);
}

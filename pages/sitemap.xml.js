export async function getServerSideProps({ res }) {
  const baseUrl = "https://livebackdrop.vercel.app";

  const paths = [
    "",
    "/pricing",
    "/gallery",
    "/generate",
    "/upload",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/history",
    "/profile"
  ];

  const urls = paths
    .map((path) => {
      const loc = baseUrl + path;
      return `<url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {}
  };
}

export default function SiteMap() {
  return null;
}

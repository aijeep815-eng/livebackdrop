export async function getServerSideProps({ res }) {
  const baseUrl = "https://livebackdrop.vercel.app";

  const content = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.setHeader("Content-Type", "text/plain");
  res.write(content);
  res.end();

  return {
    props: {}
  };
}

export default function Robots() {
  return null;
}

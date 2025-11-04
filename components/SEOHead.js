import Head from 'next/head';

export default function SEOHead({ title, description, keywords, image, url }) {
  const siteName = 'LiveBackdrop';
  const defaultTitle = title ? `${title} | ${siteName}` : `${siteName} - AI Virtual Background Generator`;
  const defaultDescription = description || 'Generate professional virtual backgrounds for live streaming, Zoom, and online content with AI.';
  const defaultKeywords = keywords || 'virtual background generator, AI backdrop, live streaming, zoom background, AI photo background';
  const defaultImage = image || '/logo.png';
  const defaultUrl = url || 'https://livebackdrop.vercel.app';

  return (
    <Head>
      <title>{defaultTitle}</title>
      <meta name="description" content={defaultDescription} />
      <meta name="keywords" content={defaultKeywords} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={defaultTitle} />
      <meta property="og:description" content={defaultDescription} />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:url" content={defaultUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={defaultTitle} />
      <meta name="twitter:description" content={defaultDescription} />
      <meta name="twitter:image" content={defaultImage} />
      <link rel="canonical" href={defaultUrl} />
      <link rel="alternate" hrefLang="en" href="https://livebackdrop.vercel.app/en" />
      <link rel="alternate" hrefLang="zh" href="https://livebackdrop.vercel.app/zh" />
      <link rel="alternate" hrefLang="es" href="https://livebackdrop.vercel.app/es" />
    </Head>
  );
}

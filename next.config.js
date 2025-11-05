/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'zh', 'es'],
    defaultLocale: 'en',
    localeDetection: false, // disable auto redirect to /zh
  },
  reactStrictMode: true,
};

module.exports = nextConfig;

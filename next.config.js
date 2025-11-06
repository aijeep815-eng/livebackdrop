/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'zh', 'es'],
    defaultLocale: 'en',
  },
};
module.exports = nextConfig;

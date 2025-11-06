/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'zh', 'es'],
    defaultLocale: 'en',
    // Turn off browser-language redirects that cause full-page reloads.
    localeDetection: false,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'zh', 'es'], // Supported languages
    defaultLocale: 'en',         // Default to English
    localeDetection: true,       // Automatically detect browser language
  },
  reactStrictMode: true,
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net'], // Allow AI images
  },
};

module.exports = nextConfig;

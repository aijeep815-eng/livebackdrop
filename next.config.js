/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'zh', 'es'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  output: 'standalone', // Ensure same runtime for all locales
  trailingSlash: false, // Avoid /zh/ redirect flashes
  reactStrictMode: true,
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net'],
  },
};

module.exports = nextConfig;

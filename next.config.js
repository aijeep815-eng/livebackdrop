/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // force dynamic website build
  experimental: {
    esmExternals: false
  }
};

module.exports = nextConfig;

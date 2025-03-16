/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  // This ensures assets are correct both in dev and production
  assetPrefix: './'
};

module.exports = nextConfig;
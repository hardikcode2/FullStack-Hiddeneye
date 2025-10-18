/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // <- ignores ESLint errors/warnings during build
  },
};

module.exports = nextConfig;

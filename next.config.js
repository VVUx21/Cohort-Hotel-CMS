/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true, // ✅ Enable Server Actions
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  serverRuntimeConfig: false,
  reactStrictMode: true,
  
  trailingSlash: true,
  env: {
    NEXTAUTH_URL: 'http://localhost:3000'
  },
  images: {
    domains: ['res.cloudinary.com'],
    unoptimized: true,
  },
};

module.exports = nextConfig;

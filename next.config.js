/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  serverRuntimeConfig: false,
  reactStrictMode: true,
  
  trailingSlash: true,
  
  // Add any environment variables if needed
  env: {
    NEXTAUTH_URL: 'http://localhost:3000'
  },
  images: {
    domains: ['res.cloudinary.com'],
    unoptimized: true,
  },
};

module.exports = nextConfig;

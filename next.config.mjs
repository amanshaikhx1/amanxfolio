/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  // ❌ DO NOT ADD: output: 'export'
  // output: 'export' sirf static websites ke liye hota hai

  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;

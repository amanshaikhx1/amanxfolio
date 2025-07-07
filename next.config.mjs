/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Helps catch issues during development

  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors on build
  },

  typescript: {
    ignoreBuildErrors: true, // Ignores TypeScript errors on build
  },

  images: {
    unoptimized: true, // Required when using `output: 'export'`
  },

  output: 'export', // Required for static export

  experimental: {
    typedRoutes: true, // Safe route linking
    // DO NOT add `serverActions` here – it's a boolean in newer versions only when used properly
  },
};

export default nextConfig;

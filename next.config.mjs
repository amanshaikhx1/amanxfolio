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
    formats: ["image/avif", "image/webp"], // Enable next-gen formats
    deviceSizes: [640, 750, 828, 1080, 1200], // Common device widths
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // For thumbnails
    domains: [], // Add external domains if used (e.g., CDN)
  },
  experimental: {
    typedRoutes: true,
    optimizeCss: true, // Minify Tailwind CSS
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate", // Improve back/forward cache
          },
        ],
      },
    ];
  },

  // 👇 Yaha webpack ko object ke andar likho
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;

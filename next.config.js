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
  webpack: (config) => {
    // Ensure consistent module resolution for @tanstack/react-query
    // This helps prevent duplicate instances in Vercel v0
    config.resolve.alias = {
      ...config.resolve.alias,
      "@tanstack/react-query": require.resolve("@tanstack/react-query"),
    }

    return config
  },
  // Explicitly set esmExternals to 'loose' to help with module resolution
  // This has been reported to fix similar issues in Vercel environments
  experimental: {
    esmExternals: "loose",
  },
}

module.exports = nextConfig

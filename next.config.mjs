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
      // Use direct path resolution for ESM compatibility
      "@tanstack/react-query": "./node_modules/@tanstack/react-query/build/lib/index.esm.js",
    }
    
    return config
  }
  // Removed experimental.esmExternals: 'loose' as it's no longer recommended
}

export default nextConfig

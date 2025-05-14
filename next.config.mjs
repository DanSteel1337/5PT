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
    // Using path-based resolution instead of require.resolve for ESM compatibility
    config.resolve.alias = {
      ...config.resolve.alias,
      // Use direct path resolution instead of require.resolve
      "@tanstack/react-query": "./node_modules/@tanstack/react-query/build/lib/index.esm.js",
    }
    
    return config
  },
  // Explicitly set esmExternals to 'loose' to help with module resolution
  // This has been reported to fix similar issues in Vercel environments
  experimental: {
    esmExternals: 'loose',
  }
}

export default nextConfig

// Import webpack directly instead of using require
import webpack from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Replace Node.js modules in client-side builds
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        process: false,
        zlib: false,
        assert: false,
        buffer: false,
        util: false,
        events: false,
      };
      
      // Provide process as a global using webpack's ProvidePlugin
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: {
            browser: {
              env: {
                NODE_ENV: process.env.NODE_ENV,
              }
            }
          }
        })
      );
    }

    // Handle pino-pretty as an external
    config.externals = config.externals || [];
    config.externals.push('pino-pretty');

    return config;
  },
};

export default nextConfig;

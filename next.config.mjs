import { createRequire } from 'module';
const require = createRequire(import.meta.url);

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
  webpack: (config) => {
    // Create a safer fallback resolution mechanism
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // Don't use require.resolve - just specify the module names
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      process: 'process/browser',
      zlib: 'browserify-zlib',
      assert: 'assert',
      buffer: 'buffer',
      util: 'util',
      events: 'events',
    };
    
    // Add plugins for polyfills
    config.plugins.push(
      new (require('webpack')).ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      })
    );

    // Handle pino-pretty as an external - don't try to resolve it
    config.externals = config.externals || [];
    config.externals.push('pino-pretty');

    return config;
  },
};

export default nextConfig;

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
    const fallbacks = {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      process: 'process/browser',
      zlib: 'browserify-zlib',
      assert: 'assert',
      buffer: 'buffer',
      util: 'util',
      events: 'events',
    };
    
    // Apply fallbacks
    config.resolve.fallback = {
      ...config.resolve.fallback,
      ...fallbacks,
    };
    
    // Add plugins for polyfills
    config.plugins.push(
      new (require('webpack')).ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      })
    );

    // Handle pino-pretty as an external if needed
    config.externals = config.externals || [];
    if (!require.resolve('pino-pretty', { paths: [process.cwd()] })) {
      config.externals.push('pino-pretty');
    }

    return config;
  },
};

export default nextConfig;

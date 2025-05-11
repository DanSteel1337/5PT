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
    const fallbacks = {};
    
    // List of potential polyfills
    const polyfills = {
      assert: 'assert',
      buffer: 'buffer',
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      process: 'process/browser',
      events: 'events',
    };
    
    // Only add polyfills that are actually installed
    Object.entries(polyfills).forEach(([key, value]) => {
      try {
        require.resolve(value);
        fallbacks[key] = require.resolve(value);
      } catch (error) {
        console.warn(`Polyfill ${value} not found, skipping fallback for ${key}`);
      }
    });
    
    // Apply the fallbacks that were successfully resolved
    config.resolve.fallback = {
      ...config.resolve.fallback,
      ...fallbacks,
    };
    
    // Only add plugins for available polyfills
    try {
      require.resolve('process/browser');
      require.resolve('buffer');
      
      config.plugins.push(
        new (require('webpack')).ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );
    } catch (error) {
      console.warn('Some polyfills not found, skipping ProvidePlugin setup');
    }

    return config;
  },
};

export default nextConfig;

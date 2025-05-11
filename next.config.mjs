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
      // Replace process in client-side builds
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
      
      // Provide process as a global
      config.plugins.push(
        new config.constructor.ProvidePlugin({
          process: require.resolve('./lib/process-polyfill.js'),
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

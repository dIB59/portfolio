import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained Node server output for Docker.
  output: 'standalone',

  typescript: {
    ignoreBuildErrors: true,
  },

  // Don't try to bundle pg's optional native acceleration module.
  serverExternalPackages: ['pg', 'pg-native'],
};

export default withBundleAnalyzer(nextConfig);

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

  // better-sqlite3 has a native binary that webpack must not try to bundle.
  serverExternalPackages: ['better-sqlite3'],
};

export default withBundleAnalyzer(nextConfig);

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

  images: {
    // Project images live in Supabase Storage. LeetCode reference images
    // can come from anywhere (the user pastes URLs); those are rendered
    // with `unoptimized` so they bypass this allowlist.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);

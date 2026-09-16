/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@braid/domain', '@braid/ui'],
};

export default nextConfig;

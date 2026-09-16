/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Profile photos and portfolio images are submitted as base64 data URLs
    // through Server Actions (see README — no object storage is configured
    // yet), so the default 1MB body limit is too small.
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};
export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ["@repo/ui", "@repo/tailwind-config"],
};

export default nextConfig;

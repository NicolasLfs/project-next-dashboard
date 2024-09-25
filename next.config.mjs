/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    ppr: "incremental",
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost"], // Adicione domínios necessários
  },
};

export default nextConfig;

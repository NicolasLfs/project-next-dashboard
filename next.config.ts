import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
  },
};

module.exports = {
  images: {
    domains: ["www.google.com", "upload.wikimedia.org"],
  },
};

export default nextConfig;

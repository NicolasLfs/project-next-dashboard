import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
  },
};

module.exports = {
  // ... outras configurações ...
  logging: {
    level: "verbose", // Mostra logs mais detalhados
  },
};

export default nextConfig;

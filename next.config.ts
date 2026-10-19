import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/encuesta", destination: "/survey?lang=es", permanent: false },
    ];
  },
};

export default nextConfig;

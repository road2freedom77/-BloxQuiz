import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tr.rbxcdn.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/games/brookhaven",
        destination: "/games/brookhaven-rp",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
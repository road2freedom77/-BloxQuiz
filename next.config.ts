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
      {
        source: "/games/all-games",
        destination: "/browse",
        permanent: true,
      },
      {
        source: "/quiz/which-roblox-game",
        destination: "/what-roblox-game-should-i-play",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
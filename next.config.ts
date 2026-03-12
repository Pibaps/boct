import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wiki.bloodontheclocktower.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

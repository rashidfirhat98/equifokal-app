import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["equifokal-dev.s3.ap-southeast-2.amazonaws.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/photos/**",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: "",
        pathname: "/photos/**",
      },
    ],
  },
  experimental: {
    authInterrupts: true,
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;

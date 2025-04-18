import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
      {
        protocol: "https",
        hostname: "equifokal-dev.s3.ap-southeast-2.amazonaws.com",
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

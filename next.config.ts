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
      {
        protocol: "https",
        hostname: "dal69ajk6u7z2.cloudfront.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "djk2c9flpfam8.cloudfront.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d1tp8haoilab5u.cloudfront.net",
        port: "",
        pathname: "/**",
      },
      // new URL("https://dal69ajk6u7z2.cloudfront.net/**"),
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

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "**.localhost",
    "null",
    "*.com",
    "*.sh",
    "*.dev",
    "*.io",
    "*.app",
    "*.local",
  ],
};

export default nextConfig;

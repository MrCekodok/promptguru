import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
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

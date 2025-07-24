import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'
  }
};

export default nextConfig;

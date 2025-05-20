import type { NextConfig } from "next";

// Default environment variables for build time if not provided
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://mongouser:root%40123@cluster0.q8xi6kc.mongodb.net/register?retryWrites=true&w=majority&appName=Cluster0";
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "some-random-secret";
process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || "https://cst-sportspot.vercel.app";

const nextConfig: NextConfig = {
  // Disable ESLint during production builds
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Optionally, also ignore TypeScript errors
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Environment variables that will be available at build time
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

export default nextConfig;

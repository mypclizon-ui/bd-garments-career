import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.resolve.alias["@"] = __dirname;
    return config;
  },
  async rewrites() {
    // Proxy API calls to the gov FastAPI backend. Use the deployed gov API
    // origin (api.bdgarmentscareer.com) in production, localhost:8100 during dev.
    const apiOrigin = process.env.API_ORIGIN || "http://localhost:8100";
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // @ts-expect-error missing type
  allowedDevOrigins: ["keven-unerosive-lenna.ngrok-free.dev", "localhost:3000"],
};

export default nextConfig;

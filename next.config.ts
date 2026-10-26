import type { NextConfig } from "next";

const staticPreview = process.env.NURTUREPATH_STATIC_PREVIEW === "1";
const nextConfig: NextConfig = {
  ...(staticPreview ? { output: "export" } : {}),
  /* config options here */
  cacheComponents: !staticPreview,
  partialPrefetching: !staticPreview,
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

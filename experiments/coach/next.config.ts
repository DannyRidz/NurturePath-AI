import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  async headers() { return [{ source: "/(.*)", headers: [
    { key: "Cache-Control", value: "private, no-store" },
    { key: "Referrer-Policy", value: "no-referrer" },
    { key: "X-Robots-Tag", value: "noindex, nofollow" },
    { key: "X-Content-Type-Options", value: "nosniff" },
  ] }]; },
};
export default config;

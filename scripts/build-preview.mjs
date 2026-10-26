import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const result = spawnSync(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "build", "--webpack"],
  {
    stdio: "inherit",
    env: { ...process.env, NURTUREPATH_STATIC_PREVIEW: "1" },
  },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

// Hosting headers must also be verified on the actual private deployment.
writeFileSync(
  "out/_headers",
  "/*\n  Cache-Control: private, no-store\n  Referrer-Policy: no-referrer\n  X-Content-Type-Options: nosniff\n  X-Robots-Tag: noindex, nofollow\n",
);

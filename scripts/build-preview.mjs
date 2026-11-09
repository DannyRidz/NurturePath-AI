import { spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  cpSync,
  symlinkSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { extname, join, resolve } from "node:path";
import { gzipSync } from "node:zlib";
import { createPreviewWorker } from "./preview-worker.mjs";

const require = createRequire(import.meta.url);
// Build a source copy without API routes. Never rename the working tree or copy env files.
const exportRoot = resolve(".local/static-export-build");
rmSync(exportRoot, { recursive: true, force: true });
mkdirSync(exportRoot, { recursive: true });
for (const name of ["src", "public", "package.json", "package-lock.json", "next.config.ts", "tsconfig.json", "postcss.config.mjs"]) {
  if (!existsSync(name)) continue;
  cpSync(name, join(exportRoot, name), { recursive: true, filter: path => path !== "src/app/api" && path !== "src/app/tester-rehearsal" });
}
symlinkSync(resolve("node_modules"), join(exportRoot, "node_modules"), "dir");
const result = spawnSync(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "build", "--webpack"],
  {
    cwd: exportRoot,
    stdio: "inherit",
    env: { ...process.env, NURTUREPATH_STATIC_PREVIEW: "1" },
  },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

rmSync("out", { recursive: true, force: true });
cpSync(join(exportRoot, "out"), "out", { recursive: true });

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};
const assets = {};
for (const file of readdirSync("out", { recursive: true }).sort()) {
  const path = join("out", file);
  if (
    !lstatSync(path).isFile() ||
    file
      .split(/[\\/]/)
      .some((part) => part.startsWith(".") || part === "_headers")
  )
    continue;
  const contentType = mime[extname(file)] ?? "application/octet-stream";
  const binary = !/^(?:text\/|application\/json|image\/svg)/.test(contentType);
  const bytes = readFileSync(path);
  assets[`/${file.replaceAll("\\", "/")}`] = {
    contentType,
    binary,
    body: bytes.toString(binary ? "base64" : "utf8"),
  };
}
if (!assets["/index.html"] || !assets["/404.html"])
  throw Error("Preview pages are missing.");
const source = `const assets = ${JSON.stringify(assets)};\nconst createPreviewWorker = ${createPreviewWorker.toString()};\nexport default createPreviewWorker(assets);\n`;
const size = gzipSync(source).byteLength;
if (size > 2 * 1024 * 1024)
  throw Error("Preview Worker exceeds the 2 MiB compressed build budget.");
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/server", { recursive: true });
mkdirSync("dist/.openai", { recursive: true });
writeFileSync("dist/server/index.js", source);
writeFileSync("dist/package.json", '{"type":"module"}\n');
writeFileSync(
  "dist/.openai/hosting.json",
  readFileSync(".openai/hosting.json"),
);
console.log(
  `Preview Worker: ${Object.keys(assets).length} assets, ${size} compressed bytes`,
);

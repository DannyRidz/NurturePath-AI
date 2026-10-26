import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

// Local QA server only. Hosted access is enforced by the Sites platform.
const root = resolve("out");
const port = Number(process.env.PREVIEW_PORT ?? 3001);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};
const headers = {
  "Cache-Control": "private, no-store",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
};
async function isFile(path) {
  return (await stat(path).catch(() => null))?.isFile();
}
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    const candidate = resolve(root, `.${pathname}`);
    let file;
    if (
      ["GET", "HEAD"].includes(request.method) &&
      (candidate === root || candidate.startsWith(`${root}${sep}`)) &&
      !pathname
        .split("/")
        .some((part) => part.startsWith(".") || part === "_headers")
    ) {
      for (const path of [
        candidate,
        `${candidate}.html`,
        resolve(candidate, "index.html"),
      ]) {
        if (await isFile(path)) {
          file = path;
          break;
        }
      }
    }
    const status = file ? 200 : 404;
    file ??= resolve(root, "404.html");
    const body = await readFile(file);
    response.writeHead(status, {
      ...headers,
      "Content-Type": mime[extname(file)] ?? "application/octet-stream",
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(400, headers);
    response.end("Unable to open this preview resource.");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Static preview: http://127.0.0.1:${port}`);
});

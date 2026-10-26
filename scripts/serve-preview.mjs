import { createServer } from "node:http";
import worker from "../dist/server/index.js";

// Local QA uses exactly the generated handler that Sites deploys.
// The Sites platform, not this loopback adapter, owns hosted authentication.
const port = Number(process.env.PREVIEW_PORT ?? 3001);
createServer(async (request, response) => {
  try {
    const result = await worker.fetch(
      new Request(`http://127.0.0.1:${port}${request.url}`, {
        method: request.method,
      }),
    );
    response.writeHead(result.status, Object.fromEntries(result.headers));
    response.end(Buffer.from(await result.arrayBuffer()));
  } catch {
    response.writeHead(400, { "Cache-Control": "private, no-store" });
    response.end("Unable to open this preview resource.");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`Preview: http://127.0.0.1:${port}`),
);

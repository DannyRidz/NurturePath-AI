// Metadata-only hosted tester operations. No provider calls or counter reset.
import { createServer } from "vite";
const phase = process.argv[2] ?? "config";
if (
  !["config", "init", "status", "enable", "disable"].includes(phase) ||
  process.argv.length > 3 ||
  process.env.CI
)
  throw new Error("Operator command only");
const loader = await createServer({
  configFile: false,
  appType: "custom",
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
});
const key = "{nurturepath-rehearsal}:gemini-testers-1:budget";
try {
  const { liveHash } = await loader.ssrLoadModule(
    "/src/lib/rehearsal/gemini.ts",
  );
  const { initializeTesterScript, enableTesterScript } =
    await loader.ssrLoadModule("/src/lib/rehearsal/admission.ts");
  const commands = {
    init: ["EVAL", initializeTesterScript, 1, key, liveHash],
    enable: ["EVAL", enableTesterScript, 1, key, liveHash],
    disable: [
      "EVAL",
      "if redis.call('EXISTS',KEYS[1])==0 then return 0 end redis.call('HSET',KEYS[1],'enabled','0') return 1",
      1,
      key,
    ],
    status: [
      "HMGET",
      key,
      "configuration",
      "billingMode",
      "enabled",
      "attempts",
      "reservedCents",
      "issued",
      "pending",
    ],
  };
  if (phase === "config") {
    console.log(
      JSON.stringify(
        {
          configuration: liveHash,
          namespace: key,
          billingMode: "prepaid",
          providerCalls: 0,
          consoleCommands: Object.fromEntries(
            Object.entries(commands).map(([name, args]) => [
              name,
              args
                .map((v) =>
                  typeof v === "number" ? String(v) : JSON.stringify(v),
                )
                .join(" "),
            ]),
          ),
        },
        null,
        2,
      ),
    );
  } else {
    const raw = await input();
    let credentials;
    try {
      credentials = JSON.parse(raw);
    } catch {
      throw new Error("Hidden JSON input requires url and token");
    }
    const url = new URL(credentials.url);
    if (
      url.protocol !== "https:" ||
      !url.hostname.endsWith(".upstash.io") ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.port ||
      url.pathname !== "/" ||
      typeof credentials.token !== "string" ||
      credentials.token.length < 20
    )
      throw new Error("Invalid store credentials");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${credentials.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands[phase]),
      redirect: "error",
      signal: AbortSignal.timeout(4000),
    });
    credentials.token = "";
    if (!response.ok) throw new Error("Store command unavailable");
    const result = await response.json();
    if (result.error) throw new Error("Store rejected command");
    if (phase === "status") console.log(JSON.stringify(result.result));
    else if (result.result !== 1)
      throw new Error("Existing, pending or mismatched metadata preserved");
    else console.log("Metadata transition completed. Counters retained.");
  }
} catch {
  console.error(
    "Tester operation stopped. Inspect metadata without resetting counters.",
  );
  process.exitCode = 1;
} finally {
  await loader.close();
}
async function input() {
  if (!process.stdin.isTTY) {
    let value = "";
    for await (const chunk of process.stdin) {
      value += chunk.toString();
      if (Buffer.byteLength(value) > 4096) throw new Error("Input too large");
    }
    return value.trim();
  }
  process.stdout.write("Store credentials JSON (hidden): ");
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  return new Promise((resolve, reject) => {
    let value = "";
    function done() {
      process.stdin.off("data", read);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write("\n");
    }
    function read(chunk) {
      for (const char of chunk) {
        if (char === "\u0003") {
          done();
          reject(new Error("Cancelled"));
          return;
        }
        if (char === "\r" || char === "\n") {
          done();
          resolve(value);
          return;
        }
        if (char === "\u007f") value = value.slice(0, -1);
        else if (char >= " ") value += char;
        if (value.length > 4096) {
          done();
          reject(new Error("Input too large"));
          return;
        }
      }
    }
    process.stdin.on("data", read);
  });
}

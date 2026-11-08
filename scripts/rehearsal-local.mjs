import { spawn } from "node:child_process";
const mode = process.argv[2];
if (
  !["dev", "start"].includes(mode) ||
  process.env.VERCEL ||
  process.env.NURTUREPATH_STATIC_PREVIEW
)
  throw new Error("Local rehearsal only");
// No provider or shared store credentials are inherited by the isolated app.
const token = process.env.REHEARSAL_LOCAL_TOKEN;
if (!token || !/^[a-f0-9]{64}$/.test(token))
  throw new Error(
    "Set REHEARSAL_LOCAL_TOKEN to a local 64 character hexadecimal access token. Never use a provider secret.",
  );
const env = Object.fromEntries(
  Object.entries(process.env).filter(
    ([key]) => !/GEMINI|COACH|REHEARSAL|REDIS|UPSTASH/.test(key),
  ),
);
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    mode,
    "experiments/rehearsal",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3002",
  ],
  {
    stdio: "inherit",
    env: {
      ...env,
      REHEARSAL_LOCAL_SIMULATION: "1",
      REHEARSAL_LOCAL_TOKEN: token,
    },
  },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});

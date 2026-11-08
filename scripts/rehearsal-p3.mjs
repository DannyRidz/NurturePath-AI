// Local operator only. Secrets are read from hidden stdin, never files/arguments.
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, open, readFile, access, chmod } from "node:fs/promises";
import { resolve, join } from "node:path";
import { createHmac, createHash } from "node:crypto";
import { createServer } from "vite";
const phase = process.argv[2],
  allowed = [
    "config",
    "init",
    "status",
    "smoke",
    "qualification",
    "evaluation",
    "review-smoke",
    "review-qualification",
    "disable",
    "rebind",
    "reconcile",
  ];
if (
  !allowed.includes(phase) ||
  process.argv.length !== 3 ||
  process.env.CI ||
  process.env.VERCEL ||
  process.env.NURTUREPATH_STATIC_PREVIEW
)
  throw new Error("Local P3 operator command only");
const directory = resolve(".local/rehearsal-p3"),
  storeDirectory = join(directory, "store"),
  socket = join(storeDirectory, "redis.sock");
const execute = promisify(execFile),
  cli = process.env.REDIS_CLI_BIN,
  server = process.env.REDIS_SERVER_BIN;
const loader = await createServer({
  configFile: false,
  appType: "custom",
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
});
let key = "",
  lock;
async function hidden(prompt) {
  if (!process.stdin.isTTY) {
    let value = "";
    for await (const chunk of process.stdin) {
      value += chunk.toString("utf8");
      if (Buffer.byteLength(value) > 2048)
        throw new Error("Hidden input too large");
    }
    return value.trim();
  }
  process.stdout.write(prompt);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  return new Promise((resolve, reject) => {
    let value = "";
    function cleanup() {
      process.stdin.off("data", input);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write("\n");
    }
    function input(chunk) {
      for (const ch of chunk) {
        if (ch === "\u0003") {
          cleanup();
          reject(new Error("Cancelled"));
          return;
        }
        if (ch === "\r" || ch === "\n") {
          cleanup();
          resolve(value);
          return;
        }
        if (ch === "\u007f") value = value.slice(0, -1);
        else if (ch >= " ") value += ch;
      }
    }
    process.stdin.on("data", input);
  });
}
async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
async function command(args) {
  if (!cli) throw new Error("REDIS_CLI_BIN required");
  const { stdout } = await execute(
    cli,
    ["-s", socket, "--json", ...args.map(String)],
    { timeout: 4000, maxBuffer: 65536 },
  );
  return JSON.parse(stdout);
}
async function startStore() {
  if (await exists(socket)) {
    if ((await command(["PING"])) !== "PONG")
      throw new Error("Store reconciliation required");
    return;
  }
  if (!server || !cli) throw new Error("Local Redis binaries required");
  await mkdir(storeDirectory, { recursive: true, mode: 0o700 });
  await execute(
    server,
    [
      "--port",
      "0",
      "--unixsocket",
      socket,
      "--unixsocketperm",
      "700",
      "--save",
      "",
      "--appendonly",
      "yes",
      "--appendfsync",
      "always",
      "--daemonize",
      "yes",
      "--dir",
      storeDirectory,
      "--logfile",
      join(storeDirectory, "server.log"),
    ],
    { timeout: 5000 },
  );
  if ((await command(["PING"])) !== "PONG")
    throw new Error("Store unavailable");
}
try {
  const trial = await loader.ssrLoadModule("/src/lib/rehearsal/trial.ts"),
    gemini = await loader.ssrLoadModule("/src/lib/rehearsal/gemini.ts"),
    admission = await loader.ssrLoadModule("/src/lib/rehearsal/admission.ts");
  const { budgetKey, releaseId, fixtureHash, maxAttempts, maxCents } = trial;
  if (phase === "config") {
    console.log(
      JSON.stringify({
        releaseId,
        configuration: gemini.liveHash,
        fixtures: fixtureHash,
        model: gemini.model,
        maxAttempts,
        maxCents,
        providerCalls: 0,
      }),
    );
  } else {
    await mkdir(directory, { recursive: true, mode: 0o700 });
    await chmod(directory, 0o700);
    if (!["status", "disable"].includes(phase))
      lock = await open(join(directory, "operator.lock"), "wx", 0o600);
    await startStore();
    async function state(expectedConfiguration = gemini.liveHash) {
      const v = await command(["HGETALL", budgetKey]);
      if (
        !v ||
        v.configuration !== expectedConfiguration ||
        v.maxAttempts !== "150" ||
        v.maxCents !== "300" ||
        !/^\d+$/.test(v.attempts ?? "") ||
        Number(v.attempts) > 150 ||
        Number(v.reservedCents) !== Number(v.attempts) * 2
      )
        throw new Error("Store configuration/reconciliation required");
      return {
        enabled: v.enabled === "1",
        pending: v.pending ?? null,
        attempts: Number(v.attempts),
        reservedCents: Number(v.reservedCents),
        issued: Number(v.issued),
      };
    }
    if (phase === "reconcile") {
      // Narrow recovery for the retained Q3 prompt3 failure, never an automatic retry.
      const previous =
        "76bb350fcebd1946ae043d1340416b19109d95d4a5801ca133ac1079775f30ae";
      const pending = "9a43df4f-620c-43c3-ac40-460b6817cb4c";
      const before = await state(previous);
      if (
        before.enabled ||
        before.pending !== pending ||
        before.attempts !== 37 ||
        before.reservedCents !== 74
      )
        throw new Error("Reconciliation evidence does not match store");
      const artifact = await readFile(
        join(directory, "qualification.jsonl"),
        "utf8",
      );
      const summaryText = await readFile(
        join(directory, "qualification-summary.json"),
        "utf8",
      );
      const summary = JSON.parse(summaryText);
      const records = artifact
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line));
      const failed = records[4];
      const observation = failed?.observation;
      if (
        records.length !== 20 ||
        failed.fixtureId !== "Q3" ||
        failed.slot !== 1 ||
        failed.code !== "reconciliation_required" ||
        !failed.dispatched ||
        failed.configuration !== previous ||
        failed.fixtures !== fixtureHash ||
        summary.after.pending !== pending ||
        summary.after.attempts !== 37 ||
        summary.after.reservedCents !== 74 ||
        observation?.httpStatus !== 200 ||
        observation.modelVersion !== gemini.model ||
        JSON.stringify(observation.finishReasons) !== '["STOP"]'
      )
        throw new Error("Incomplete failure evidence");
      const usage = observation.usage;
      const thinking = usage.thoughtsTokenCount ?? 0;
      const settledUsage = gemini.usageSchema.parse({
        inputTokens: usage.promptTokenCount,
        outputTokens: usage.candidatesTokenCount,
        thinkingTokens: thinking,
        totalTokens: usage.totalTokenCount,
        durationMs: observation.durationMs,
        estimatedUsd:
          (usage.promptTokenCount * 0.25 +
            (usage.candidatesTokenCount + thinking) * 1.5) /
          1000000,
      });
      const output = JSON.parse(observation.syntheticOutput);
      if (
        output.decision !== "coach" ||
        !output.notes.some((note) => note.factIds?.includes("Q03"))
      )
        throw new Error("Failure cause mismatch");
      // Persist the reviewed disposition before touching metadata, retaining all failed output.
      const audit = await open(
        join(directory, "reconciliation-prompt3.json"),
        "wx",
        0o600,
      );
      try {
        await audit.writeFile(
          JSON.stringify(
            {
              at: new Date().toISOString(),
              previous,
              configuration: gemini.liveHash,
              pending,
              attempts: 37,
              reservedCents: 74,
              disposition: "rejected-output-reservation-retained",
              usage: settledUsage,
              artifactHash: createHash("sha256").update(artifact).digest("hex"),
              summaryHash: createHash("sha256")
                .update(summaryText)
                .digest("hex"),
            },
            null,
            2,
          ),
        );
        await audit.sync();
      } finally {
        await audit.close();
      }
      if (
        (await command([
          "EVAL",
          admission.reconcileLocalRehearsalScript,
          1,
          budgetKey,
          previous,
          gemini.liveHash,
          "37",
          "74",
          pending,
        ])) !== 1
      )
        throw new Error("Reconciliation transition rejected");
      console.log(JSON.stringify(await state()));
    } else if (phase === "rebind") {
      const packet = JSON.parse(
        await readFile(join(directory, "rebind.json"), "utf8"),
      );
      if (
        !/^[a-f0-9]{64}$/.test(packet.previousConfiguration ?? "") ||
        packet.configuration !== gemini.liveHash ||
        packet.previousConfiguration === packet.configuration ||
        packet.approval !== "user-local-P3-2026-11-08" ||
        typeof packet.reason !== "string" ||
        packet.reason.length < 30
      )
        throw new Error("Reviewed configuration change required");
      const before = await state(packet.previousConfiguration);
      if (
        !before.enabled ||
        before.pending ||
        before.attempts !== packet.expectedAttempts
      )
        throw new Error("Outstanding state requires reconciliation");
      const script = admission.rebindLocalRehearsalScript;
      if (
        (await command([
          "EVAL",
          script,
          1,
          budgetKey,
          packet.previousConfiguration,
          gemini.liveHash,
          String(before.attempts),
          String(before.reservedCents),
        ])) !== 1
      )
        throw new Error("Configuration reconciliation failed");
      const history = await open(
        join(directory, "configuration-history.jsonl"),
        "a",
        0o600,
      );
      try {
        await history.writeFile(
          JSON.stringify({
            ...packet,
            at: new Date().toISOString(),
            attempts: before.attempts,
            reservedCents: before.reservedCents,
          }) + "\n",
        );
        await history.sync();
      } finally {
        await history.close();
      }
      console.log(
        JSON.stringify({ configuration: gemini.liveHash, ...(await state()) }),
      );
    } else if (phase === "init") {
      trial.activationSchema.parse(
        JSON.parse(await readFile(join(directory, "activation.json"), "utf8")),
      );
      // The durable marker and Redis metadata are never recreated or reset on restart.
      const marker = await open(
        join(directory, "allowance-created.json"),
        "wx",
        0o600,
      );
      await marker.writeFile(
        JSON.stringify({
          releaseId,
          maxAttempts,
          maxCents,
          approval: "user-local-P3-2026-11-08",
        }),
      );
      await marker.sync();
      await marker.close();
      const script = admission.initializeLocalRehearsalScript;
      if (
        (await command(["EVAL", script, 1, budgetKey, gemini.liveHash])) !== 1
      )
        throw new Error(
          "Existing allowance preserved; manual reconciliation required",
        );
      console.log(JSON.stringify(await state()));
    } else if (phase === "status") {
      console.log(JSON.stringify(await state()));
    } else if (phase === "disable") {
      await state();
      await command(["HSET", budgetKey, "enabled", "0"]);
      console.log(JSON.stringify(await state()));
    } else if (phase.startsWith("review-")) {
      const reviewedPhase = phase.slice(7),
        artifact = await readFile(
          join(directory, `${reviewedPhase}.jsonl`),
          "utf8",
        );
      const records = artifact.trim().split("\n").map(JSON.parse);
      const summaryText = await readFile(
        join(directory, `${reviewedPhase}-summary.json`),
        "utf8",
      );
      trial.validatePhaseForReview(
        reviewedPhase,
        records,
        JSON.parse(summaryText),
      );
      if (
        records.some(
          (r) =>
            r.outcome !== "expected" ||
            r.configuration !== gemini.liveHash ||
            r.fixtures !== fixtureHash,
        )
      )
        throw new Error("Failed phase cannot be approved by this command");
      const label = await hidden(
        "Engineering reviewer label and brief content-screen note (hidden input): ",
      );
      if (label.length < 15) throw new Error("Explicit review note required");
      const file = await open(
        join(directory, `${reviewedPhase}-review.json`),
        "wx",
        0o600,
      );
      try {
        await file.writeFile(
          JSON.stringify({
            configuration: gemini.liveHash,
            fixtures: fixtureHash,
            artifactHash: createHash("sha256").update(artifact).digest("hex"),
            summaryHash: createHash("sha256").update(summaryText).digest("hex"),
            reviewedAt: new Date().toISOString(),
            engineeringReview: label,
            humanRubricReview: false,
            clinicalApproval: false,
          }),
        );
        await file.sync();
      } finally {
        await file.close();
      }
      console.log(
        "Engineering screen recorded. No human rubric or clinical approval claimed.",
      );
    } else {
      const activation = trial.activationSchema.parse(
        JSON.parse(await readFile(join(directory, "activation.json"), "utf8")),
      );
      void activation;
      if (!(await exists(join(directory, "allowance-created.json"))))
        throw new Error("Approved persistent allowance missing");
      const prerequisite =
        phase === "qualification"
          ? "smoke"
          : phase === "evaluation"
            ? "qualification"
            : null;
      if (prerequisite) {
        const previous = await readFile(
            join(directory, `${prerequisite}.jsonl`),
            "utf8",
          ),
          review = JSON.parse(
            await readFile(
              join(directory, `${prerequisite}-review.json`),
              "utf8",
            ),
          );
        const summaryText = await readFile(
          join(directory, `${prerequisite}-summary.json`),
          "utf8",
        );
        trial.validatePhaseForReview(
          prerequisite,
          previous.trim().split("\n").map(JSON.parse),
          JSON.parse(summaryText),
        );
        if (
          review.summaryHash !==
            createHash("sha256").update(summaryText).digest("hex") ||
          review.configuration !== gemini.liveHash ||
          review.fixtures !== fixtureHash ||
          review.artifactHash !==
            createHash("sha256").update(previous).digest("hex")
        )
          throw new Error("Matching reviewed prerequisite required");
      }
      const before = await state();
      if (!before.enabled || before.pending)
        throw new Error("Reconciliation required, no automatic retry");
      const artifact = await open(
        join(directory, `${phase}.jsonl`),
        "wx",
        0o600,
      );
      try {
        key = await hidden(
          "Existing paid-project Gemini API key (hidden, memory only): ",
        );
        if (!/^[A-Za-z0-9_-]{30,200}$/.test(key))
          throw new Error("Valid key required");
        let dispatched = false,
          observation = null,
          lastDispatch = Date.now();
        const transport = async (url, options) => {
          // API key goes only to the official Gemini endpoint in the adapter.
          dispatched = true;
          lastDispatch = Date.now();
          const start = Date.now();
          try {
            const response = await fetch(url, options);
            const reader = response.body?.getReader(),
              chunks = [];
            let bytes = 0;
            try {
              while (reader) {
                const chunk = await reader.read();
                if (chunk.done) break;
                bytes += chunk.value.byteLength;
                if (bytes > 32768) throw new Error("Oversized provider body");
                chunks.push(chunk.value);
              }
            } finally {
              void reader?.cancel().catch(() => {});
            }
            const buffer = Buffer.concat(chunks);
            let raw;
            try {
              raw = JSON.parse(
                new TextDecoder("utf-8", { fatal: true }).decode(buffer),
              );
            } catch {}
            observation = {
              httpStatus: response.status,
              modelVersion:
                typeof raw?.modelVersion === "string" ? raw.modelVersion : null,
              finishReasons:
                raw?.candidates?.map((c) => c.finishReason) ?? null,
              usage: raw?.usageMetadata ?? null,
              syntheticOutput: response.ok
                ? (raw?.candidates?.[0]?.content?.parts
                    ?.filter((p) => !p.thought && typeof p.text === "string")
                    .map((p) => p.text)
                    .join("") ?? null)
                : null,
              durationMs: Date.now() - start,
            };
            return new Response(buffer, {
              status: response.status,
              headers: response.headers,
            });
          } catch {
            observation = { failed: true, durationMs: Date.now() - start };
            throw new Error("Provider unavailable");
          }
        };
        const store = new admission.RedisAdmission(
            command,
            gemini.liveHash,
            releaseId,
          ),
          secret = createHmac("sha256", key)
            .update("rehearsal-local-ticket-1")
            .digest("hex");
        const client = () =>
          createHmac("sha256", secret)
            .update(`${Math.floor(Date.now() / 86400000)}:local-operator`)
            .digest("hex");
        const service = trial.newTrialService(store, secret, key, transport);
        console.log(
          JSON.stringify({
            phase,
            configuration: gemini.liveHash,
            fixtures: fixtureHash,
            before,
            publicAllowance: "untouched; current public usage not read",
          }),
        );
        const summary = await trial.runPhase(phase, service, client, {
          beforeSlot: async () => {
            trial.activationSchema.parse(activation);
            const wait = 6500 - (Date.now() - lastDispatch);
            if (wait > 0) await new Promise((r) => setTimeout(r, wait));
            lastDispatch = Date.now();
            const s = await state();
            if (!s.enabled || s.pending)
              throw new Error("Reconciliation required");
          },
          resetObservation: () => {
            dispatched = false;
            observation = null;
          },
          wasDispatched: () => dispatched,
          afterSlot: async (record) => {
            if (dispatched)
              record.providerDurationMs = observation?.durationMs ?? null;
            await artifact.writeFile(
              JSON.stringify({
                ...record,
                configuration: gemini.liveHash,
                fixtures: fixtureHash,
                at: new Date().toISOString(),
                observation,
                review: null,
              }) + "\n",
            );
            await artifact.sync();
            console.log(
              JSON.stringify({
                fixture: record.fixtureId,
                slot: record.slot,
                status: record.status,
                outcome: record.outcome,
                dispatched: record.dispatched,
              }),
            );
          },
          stopRequired: async () => {
            const s = await state();
            return !s.enabled || !!s.pending;
          },
        });
        const after = await state(),
          summaryFile = await open(
            join(directory, `${phase}-summary.json`),
            "wx",
            0o600,
          );
        try {
          await summaryFile.writeFile(
            JSON.stringify(
              {
                phase,
                configuration: gemini.liveHash,
                fixtures: fixtureHash,
                before,
                after,
                ...summary,
              },
              null,
              2,
            ),
          );
          await summaryFile.sync();
        } finally {
          await summaryFile.close();
        }
        console.log(JSON.stringify({ phase, after, ...summary }));
        if (summary.unexpected || summary.uncompleted) process.exitCode = 1;
      } finally {
        key = "";
        await artifact.close();
      }
    }
  }
} catch {
  console.error(
    "P3 command stopped. Inspect ignored phase records and metadata; reconcile any pending attempt. No automatic retry, refund or allowance reset.",
  );
  process.exitCode = 1;
} finally {
  key = "";
  if (lock) {
    await lock.close();
    const { unlink } = await import("node:fs/promises");
    await unlink(join(directory, "operator.lock"));
  }
  await loader.close();
}

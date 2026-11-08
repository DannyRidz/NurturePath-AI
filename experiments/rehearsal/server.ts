import { randomBytes, timingSafeEqual } from "node:crypto";
import { MemoryAdmission, AdmissionError } from "@/lib/rehearsal/admission";
import { RehearsalService } from "@/lib/rehearsal/service";
const secret = randomBytes(32).toString("hex");
const service = new RehearsalService(new MemoryAdmission(), secret);
export async function handle(request: Request, kind: "start" | "feedback") {
  const headers = {
    "Cache-Control": "private, no-store",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
  };
  const error = (code: string, status: number) =>
    Response.json({ error: code }, { status, headers });
  const url = new URL(request.url);
  if (
    process.env.VERCEL ||
    process.env.REHEARSAL_LOCAL_SIMULATION !== "1" ||
    !["127.0.0.1", "localhost"].includes(url.hostname) ||
    request.headers.get("origin") !== "http://127.0.0.1:3002" ||
    request.headers.get("host") !== "127.0.0.1:3002"
  )
    return error("local_only", 403);
  const expected = process.env.REHEARSAL_LOCAL_TOKEN ?? "",
    actual = request.headers.get("x-rehearsal-token") ?? "";
  if (
    expected.length < 32 ||
    !/^[a-f0-9]{64}$/.test(actual) ||
    actual.length !== expected.length ||
    !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
  )
    return error("local_access_required", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return error("invalid_request", 400);
  const limit = kind === "start" ? 1024 : 8192;
  let bytes = 0;
  const reader = request.body?.getReader();
  if (!reader) return error("invalid_request", 400);
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) {
        await reader.cancel();
        return error("too_large", 413);
      }
      chunks.push(value);
    }
    const body = JSON.parse(
      new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)),
    );
    const result =
      kind === "start"
        ? await service.start(body, "local-operator")
        : await service.feedback(body, "local-operator");
    return Response.json(result, { headers });
  } catch (e) {
    const code = e instanceof AdmissionError ? e.code : "invalid_request";
    return error(
      code,
      code === "rehearsal_expired"
        ? 410
        : ["busy", "exhausted", "rate_limited", "session_limit"].includes(code)
          ? 429
          : ["rehearsal_closed", "stale_round", "duplicate_request"].includes(
                code,
              )
            ? 409
            : code === "reconciliation_required"
              ? 503
              : 400,
    );
  }
}

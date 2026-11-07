// Local operator verification only. No HTTP route imports this command.
// Credentials arrive on hidden stdin. Artifacts contain synthetic drafts only.
import { readFileSync, existsSync } from 'node:fs';
import { mkdir, open } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { resolve, join } from 'node:path';
import { createServer } from 'vite';
const phase = process.argv[2];
const resume = process.argv.includes('--reconciled-resume');
if (!['qualification', 'evaluation'].includes(phase) || process.env.CI || process.env.VERCEL) throw new Error('Local operator qualification/evaluation only');
const loader = await createServer({ configFile: false, appType: 'custom', server: { middlewareMode: true, hmr: false, ws: false, watch: null } });
let credentials;
async function boundedJson(response) {
  const reader = response.body?.getReader();
  const chunks = []; let bytes = 0;
  try {
    while (reader) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 16384) return null;
      chunks.push(chunk.value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch { return null; }
  finally { void reader?.cancel().catch(() => {}); }
}
try {
  credentials = JSON.parse(readFileSync(0, 'utf8'));
  const target = new URL(credentials.url);
  if (target.protocol !== 'https:' || !target.hostname.endsWith('.upstash.io') || target.username || target.password || target.search || target.hash || target.pathname !== '/' || target.port) throw new Error();
  const { publicConfig, handlePublicCoach, publicOrigin } = await loader.ssrLoadModule('/src/lib/coach/public-service.ts');
  const { configurationHash } = await loader.ssrLoadModule('/src/lib/coach/gemini.ts');
  const { redisCommand } = await loader.ssrLoadModule('/src/lib/coach/admission.ts');
  const { publicNoticeVersion } = await loader.ssrLoadModule('/src/lib/coach/contract.ts');
  const fingerprint = configurationHash(), key = '{nurturepath-coach}:gemini-public-1:budget';
  const config = publicConfig({ AI_COACH_ENABLED: '1', VERCEL: '1', VERCEL_ENV: 'production', GEMINI_API_KEY: credentials.apiKey, COACH_KV_REST_API_URL: credentials.url, COACH_KV_REST_API_TOKEN: credentials.token, COACH_LIMITER_HMAC_SECRET: credentials.hmacSecret, COACH_REVIEWED_CONFIG_HASH: fingerprint, COACH_COST_RISK_ACK: 'estimated-reservations-not-invoice-cap' });
  async function state() {
    const raw = await redisCommand(config.store, ['HMGET', key, 'enabled', 'fingerprint', 'attempts', 'reservedCents', 'maxAttempts', 'maxCents']);
    const s = raw.result;
    if (!Array.isArray(s) || s.length !== 6 || s[1] !== fingerprint || !/^\d+$/.test(s[2]) || s[2] !== s[3] || s[4] !== '60' || s[5] !== '100' || Number(s[2]) > 60) throw new Error();
    return { enabled: s[0], attempts: Number(s[2]), reservedCents: Number(s[3]) };
  }
  const directory = resolve('.local/coach-public-evaluation');
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const artifact = join(directory, `${phase}.jsonl`);
  const previous = resume && existsSync(artifact) ? readFileSync(artifact, 'utf8').trim().split('\n').filter(Boolean).map(line => JSON.parse(line)) : [];
  if (resume && (!previous.length || previous.some((r, i) => r.phase !== phase || r.sequence !== i + 1 || r.configurationHash !== fingerprint) || previous.at(-1).httpStatus === 200)) throw new Error();
  const before = await state();
  if (phase === 'evaluation') {
    const freeze = JSON.parse(readFileSync(join(directory, 'freeze.json'), 'utf8'));
    if (freeze.configurationHash !== fingerprint || freeze.qualificationPassed !== true || (!resume && freeze.sharedAttempts !== before.attempts)) throw new Error();
  }
  const file = await open(artifact, resume ? 'a' : 'ax', 0o600);
  try {
    if (phase === 'qualification' || resume) {
      const script = "local s=redis.call('HMGET',KEYS[1],'enabled','fingerprint','attempts','reservedCents') if s[1]~='0' or s[2]~=ARGV[1] or s[3]~=ARGV[2] or s[4]~=ARGV[2] then return 0 end redis.call('HSET',KEYS[1],'enabled','1') return 1";
      const enabled = await redisCommand(config.store, ['EVAL', script, 1, key, fingerprint, String(before.attempts)]);
      if (enabled.result !== 1) throw new Error();
    } else if (before.enabled !== '1') throw new Error();
    const count = phase === 'qualification' ? 10 : 20;
    for (let sequence = previous.length + 1; sequence <= count; sequence++) {
      const requestId = randomUUID(), startedAt = new Date().toISOString();
      let observation = null, admission = null, dispatched = false;
      const response = await handlePublicCoach(new Request(`${publicOrigin}/api/coach`, {
        method: 'POST', headers: { origin: publicOrigin, 'content-type': 'application/json', 'x-vercel-forwarded-for': '192.0.2.1' },
        body: JSON.stringify({ variantId: 'V01', catalogVersion: 'sim-1', rulesVersion: 'sim-1', contentVersion: 'sim-1', noticeVersion: publicNoticeVersion, consent: true, requestId }),
      }), config, {
        store: async (url, options) => {
          const response = await fetch(url, options);
          const command = JSON.parse(String(options.body));
          if (command[0] === 'EVAL' && String(command[2]) === '2') {
            const raw = await boundedJson(response.clone()), r = raw?.result;
            if (Array.isArray(r) && r.length === 3 && r[0] === 1 && Number.isInteger(r[1]) && r[1] >= 1 && r[1] <= 60 && r[2] === r[1]) admission = { attempts: r[1], reservedCents: r[2] };
          }
          return response;
        },
        provider: async (url, options) => {
          dispatched = true;
          const response = await fetch(url, options), body = await boundedJson(response.clone());
          observation = body ? {
            httpStatus: response.status,
            errorStatus: /^[A-Z_]{1,80}$/.test(body.error?.status ?? '') ? body.error.status : null,
            modelVersion: /^[a-z0-9.-]{1,100}$/.test(body.modelVersion ?? '') ? body.modelVersion : null,
            finishReasons: body.candidates?.map(c => c.finishReason) ?? null,
            usage: body.usageMetadata ?? null,
            output: body.candidates?.[0]?.content?.parts?.filter(p => !p.thought && typeof p.text === 'string').map(p => p.text).join('') ?? null,
          } : { httpStatus: response.status, unreadable: true };
          return response;
        },
      });
      const result = await response.json();
      await file.writeFile(JSON.stringify({ phase, sequence, globalAttempt: admission?.attempts ?? null, reservation: admission, dispatched, startedAt, completedAt: new Date().toISOString(), configurationHash: fingerprint, httpStatus: response.status, result, observation, review: null }) + '\n');
      await file.sync();
      console.log(JSON.stringify({ phase, sequence, admittedAttempt: admission?.attempts ?? null, dispatched, status: response.status, code: result.code ?? 'draft', usage: result.usage ?? null }));
      if (response.status !== 200) { console.log('Trial stopped for reconciliation. No automatic retry or allowance reset.'); process.exitCode = 1; break; }
      if (sequence < count) await new Promise(resolve => setTimeout(resolve, 6500));
    }
    const after = await state();
    console.log(JSON.stringify({ phase, sharedBefore: before.attempts, sharedAfter: after.attempts, reservedCents: after.reservedCents, state: after.enabled }));
  } finally { await file.close(); }
} catch { console.log('Trial did not complete. Inspect phase records and shared state. No credentials or provider bodies logged.'); process.exitCode = 1; }
finally { if (credentials) { credentials.apiKey = ''; credentials.token = ''; credentials.hmacSecret = ''; } await loader.close(); }

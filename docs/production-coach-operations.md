# Public Gemini operations

The approved release is `gemini-public-1`: a lifetime maximum of 60 provider attempts and USD 1 in application reservations. Reservations are one cent each, with no refunds, reset or automatic top up. They are estimates, not a guarantee about Google invoices, taxes or infrastructure charges. No real health intake is enabled.

## Required server configuration

| Variable | Value or purpose |
|---|---|
| `AI_COACH_ENABLED` | `1` only after verification; unset or `0` disables new calls |
| `GEMINI_API_KEY` | Restricted Gemini Developer API key, Vercel production secret only |
| `COACH_KV_REST_API_URL` (or `UPSTASH_REDIS_REST_URL`) | HTTPS primary endpoint, no credentials or query parameters in the URL |
| `COACH_KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_TOKEN`) | Primary write token, production secret only |
| `COACH_LIMITER_HMAC_SECRET` | At least 32 random characters, production secret only |
| `COACH_REVIEWED_CONFIG_HASH` | Output of `npm run coach:public -- config`, matching the reviewed request |
| `COACH_COST_RISK_ACK` | `estimated-reservations-not-invoice-cap` |

The endpoint also requires actual direct Vercel production deployment, exact Origin `https://nurturepath-demo.vercel.app`, valid client metadata, V01 and public consent/version fields. It denies CI, preview, static export, all other examples and arbitrary personal fields. Never set a runtime test bypass. No secret belongs in a `NEXT_PUBLIC` variable, repository file, shell argument, operational log or browser bundle.

## Counter initialization and shutdown

Run operator commands from a local terminal with the locked development dependencies installed. The commands prompt for missing Redis URL/token with hidden input. Environment variables may also be supplied through a secure process environment, never pasted into logged commands.

1. `npm run coach:public -- config` computes the model, request fingerprint and byte count offline. It makes no external call.
2. `npm run coach:public -- init` creates the stable budget only when absent, in disabled state. It never replaces an existing release or changes its counters.
3. `npm run coach:public -- status` reads only status, anonymous totals, limits and fingerprint.
4. `npm run coach:public -- enable` requires explicit operator reconciliation acknowledgement. Review actual account processing, model behavior, prices, outstanding requests and usage first. The command preserves totals and rejects an exhausted or mismatched release.
5. `npm run coach:public -- disable` sets shared status to disabled without refunding counters. It prevents new admissions across deployments; already sent requests may still bill.

Redis states are `1` (enabled), `pending` (one admitted provider attempt in progress) and `0` (disabled). A crash before settlement preserves pending state. Invalid, timed out or otherwise unreconciled provider attempts disable the release. A valid successful attempt can reopen only the matching pending state; it cannot undo an operator shutdown. A lost settlement acknowledgement can withhold the draft even if the state change committed. Check status and usage before manual reenablement. Do not create another release identifier or key to bypass the allowance.

## Deployment and rollback

The Vercel project now needs native Next.js hosting rather than static `out/` serving. Production still tracks `main`, with the existing public URL and separate preview protection. Keep a known healthy deployment for rollback. Never weaken preview protection to test a production endpoint. Verify actual anonymous HTML, assets, deep links, errors and response headers after deployment. Confirm the function runs in the selected Singapore region.

Static preview remains supported by `npm run build:preview`, which builds a temporary source copy with API routes excluded. `node scripts/check-coach-isolation.mjs` checks the resulting artifact for server provider transport, credential markers and local experiment UI. The source working tree and native `.next` build are not renamed or replaced by this export.

Before public activation, `npm run coach:public:trial -- qualification` and then `npm run coach:public:trial -- evaluation` run the approved ten and twenty calls through the public service admission logic locally, using credential JSON on hidden stdin. Only the first qualification phase can enable a pristine disabled allowance. Existing phase files are never overwritten, and failure stops the phase without retry. Synthetic output artifacts live under ignored `.local/coach-public-evaluation`, outside the metadata ledger. Review qualification before evaluation. Run the approved real model qualification/evaluation and inspect every draft for all seven answer states and prohibited advice. Preserve the fixed evaluation set; do not tune on it. Any call through the public release consumes this public allowance. Record observed usage and calculated charge honestly; unavailable invoice data remains unknown. No production readiness or clinical validation is implied by mocked browser output.

## Current limits

There is no patient account, saved draft, personal free text or upload endpoint. The public coach only sends the canonical fictional V01 facts. App session and draft state stay in tab memory; host/provider processing is separate. Personal intake is a proposed design in specification 0008, with unresolved operator, region, content and processing decisions.


The trial tooling reads the authoritative shared counter before each phase, records each Redis admission and dispatch separately, buffers diagnostic response bytes before UTF-8 decoding, and checks the frozen qualification record before evaluation. An explicit `--reconciled-resume` can continue a stopped matching phase only after operator reconciliation; it never resets counters or automatically retries. The measured v2 run consumed 32 of 60 public attempts before hosted verification.

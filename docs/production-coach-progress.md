# Production Gemini implementation progress

## Hosted verification, 7 November 2026

The user authorized both merges and the verified release. PRs #9 and #10 merged; native production deployment `m3oXAKSa2wAe5QzYhgBaSh3G1V7b` serves main commit `b409181b34ab57f7b981ec5a43f3ae76ce63105c`. Production configuration was saved after the user completed Vercel verification.

Anonymous HTML, deep links and JavaScript returned 200; an unknown route returned 404. Actual responses carried no referrer, no sniff, no index and framing restrictions. HTML and the API were private and no store; immutable framework assets retained public caching. The API response identified Singapore for both ingress and execution.

With the shared budget disabled, a valid public request reached shared admission and returned disabled without a reservation. After enabling, one actual browser V01 request returned the exact seven canonical facts and three valid Gemini discussion questions. Hide removed the draft, Resume returned the coach to its initial state, and the complete authored report remained available without generated text. Shared shutdown then blocked another valid request without increasing totals. Lifetime use at this check was 33 attempts and 33 cents reserved, leaving 27 attempts. No invoice amount is inferred from reservations.

The browser check exposed a stale session notice claiming there were no external AI requests. The followup correction explains optional Google processing and separate consent, with a regression assertion. The complete journey passed all five browser projects, lint, type checking, 104 unit tests and the native webpack build. A fresh same model context reviewed the correction and found no verified defect. Admission was paused during this correction; live status is authoritative in Redis, never this document. Earlier pending statements below describe preparation before these checks. Personal intake remains design only.

7 November 2026. Work remains in progress under specification 0007. The user approved public implementation, a lifetime maximum of 60 provider attempts and USD 1 in estimated application reservations, and the free Upstash integration agreement and displayed account sharing. No real health intake is enabled.

## Implemented

The public V01 consent panel and `/api/coach` server endpoint use shared Gemini prompt/transport code, independent structured output validation and Google provenance. Clear, Hide, withdrawal, dismissal, replacement, navigation and document hiding invalidate drafts. Generated text remains outside the report and printing. The authored journey remains available on failure.

The shared Redis primary provides lifetime reservations, a daily IP HMAC pseudonym and ten admissions per minute. An atomic pending state permits one active provider attempt across instances. Failures retain their reservation and stop further admission for reconciliation. A successful pending attempt cannot undo operator shutdown. Missing or uncertain store/configuration state prevents provider dispatch. Operator tooling initializes only an absent release and never resets totals. The exported static artifact is built without API routes from a source copy.

The Vercel configuration now selects native Next.js hosting and Singapore. This configuration is prepared in the PR, not yet verified in production. The free Singapore Upstash store was created and connected to the NurturePath project with sensitive variables scoped to production only. No paid plan, replica region or eviction was enabled. The integration supplied `COACH_KV_REST_API_URL` and `COACH_KV_REST_API_TOKEN`; no secret value is recorded here.

## Verification

* Root unit tests: 102 passed with six real Redis tests skipped when binaries are absent. An explicit isolated Redis 7.4.2 run passed all 108 tests, including concurrency, exhaustion, restart identity, shutdown, corruption and rate expiry.
* Root lint, root and experiment type checks, native webpack build and experiment webpack build passed. Experiment unit tests: 65 passed.
* Native root browser matrix: 324 passed, eleven intentional skips and five failed replacement checks caused by a test selector matching retained inactive pages. After fixing the selector to target visible controls, all five replacement checks passed. Combined current behavior coverage: 329 passing checks across desktop/mobile Chromium and WebKit plus desktop Firefox. Deterministic browser fixtures are not observed Gemini output.
* AI disabled static artifact build and isolation scanner passed. Exported desktop checks: 59 passed and nine public coach checks intentionally skipped.
* Desktop public coach screenshot was inspected. Full authored and draft reading order, separate disclosure/consent and report exclusion were visible. No manual phone or VoiceOver verification is claimed.
* Earlier overlapping test runs shared an artifact directory and one build overlapped a running server. Those runs were discarded. The isolated full run above and targeted replacement run supply the recorded evidence. Native and static test artifact directories are now separate.
* A user requested fresh agent context reviewed design and relevant source with the same model and found no verified fictional release blocking defect. It identified five unresolved personal design decisions. See `docs/reviews/2026-11-07-production-design.md`.

A dedicated CI job now runs the Redis tests against a real isolated Redis process. Latest head CI, deployed behavior and real model evidence must still be inspected before release readiness.

## Remaining activation work

Budget initialization, dedicated Gemini credential setup, revised real model qualification/evaluation and engineering output review are complete. Finish production settings and deployed verification. Inspect latest head CI, reconcile the stacked PRs and verify deployed anonymous access, headers, ingress metadata and shutdown before claiming Gemini is live. The personal intake proposal in specification 0008 remains design only and unbuildable until the recorded business, safety and privacy decisions are resolved. The actual revised qualification and evaluation are now recorded in docs/gemini-live-evaluation.md. Thirty revised calls passed, with both earlier failed attempts retained. Cumulative reservations are 32 attempts / 32 cents before hosted verification. The replacement Gemini credential and limiter secret are installed as sensitive production values; the production activation flag remains disabled pending release checks.

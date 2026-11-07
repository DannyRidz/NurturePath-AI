# Production Gemini implementation progress

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

Finish actual budget initialization, dedicated Gemini credential setup, other production settings, real model qualification/evaluation and semantic output review. Inspect latest head CI, reconcile the stacked PRs and verify deployed anonymous access, headers, ingress metadata and shutdown before claiming Gemini is live. The personal intake proposal in specification 0008 remains design only and unbuildable until the recorded business, safety and privacy decisions are resolved. No model call or credit spending has occurred in this change so far.

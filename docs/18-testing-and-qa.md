# Testing and quality assurance

Test strategy only. No application test, model call, usability session, security scan or clinical validation has been executed. Documentation verification at planning completion is separate from product QA.

## Test layers and acceptance traceability

| Layer | Target behavior | Method / accountable owner | ACs |
|---|---|---|---|
| Unit | Canonical variant/enums/applicability, unknowns, exact predicates and same-priority aggregation | Vitest against finite table, sole builder | 04-06 |
| Content integrity | Reason/card/fragment/source dependencies and versions resolve, engineering/clinical/rights states separate | Registry checks; reviewed selection permits only fully approved bundles, builder records actual status; no independent reviewer assumed | 05/08/09 |
| Component | Choice labels, errors, Back, progress, focus, Hide | User interaction assertions, builder; no snapshot only confidence | 01-03/12 |
| API integration | Validation, consent/provider/origin, rate limit, stale version, timeout, refusal, output checks | Boundary/disabled-handler tests, builder; live provider work deferred | 02/04/08/13/14 |
| End to end | First use through report and clear, urgent interrupt, edit invalidation and AI disabled | Playwright critical path plus available browser/device checks, builder | 01-14 |
| AI evaluation | Complete allowed bundle selection, deterministic rendering and clarity | Deferred X-AI only: separately funded builder execution and an actually agreed external reviewer; no model experiment in solo core | 08/09/15 |
| Security/privacy | XSS, malformed input, secrets, no bodies in logs/storage, session isolation and response races | Synthetic canary traces, headers and bundles, builder | 11/14 |
| Accessibility | Keyboard, focus order, errors, landmarks, readers, contrast and zoom | axe plus manual VoiceOver/Safari and actual phone, builder | 12 |
| Performance | Cold/warm paths, rules time, AI distribution, concurrent requests | Stated device/network, recorded timings, builder | 13/15 |
| Recovery | Print/cancel, refresh, Back/clear; 429, provider off and timeout only for deferred X-AI | Fault injection, static result remains, builder | 10/11/13 |
| User acceptance | Purpose, privacy, next step and limits understood without help | Builder facilitates target five consenting adult fictional tasks, recruitment unconfirmed | 01/07/15 |

Clinical tests check implementation of a reviewed specification, not clinical truth by themselves. Every relevant test references the PRD AC and source/rule version. Do not create tests that merely repeat an implementation predicate as its own expected answer.

## First time journey test

Fresh browser → purpose/fictional notice → locked variant selection → session consent then adult scope → inspect canonical questions → Back/Edit selects an explicitly announced entire allowed variant → review → authored next step/evidence → complete-report disclosure and preview → browser Print/Save as PDF or Cancel → clear → browser Back/reload. Repeat AI consent/races only in eligible REVIEWED_SELECTION. In AUTHORED_SIMULATION verify no AI checkbox/provider request and explicitly absent AI metrics. Urgent V08 bypasses remaining steps with network disabled.

## Device matrix

Automated viewports: 320x568, 390x844, 768x1024 and 1440x900. Verify portrait/landscape, 200% text and 400% zoom, virtual keyboard and long labels. Minimum manual checks on one iOS Safari device, one Android Chrome device and desktop keyboard/Safari or Chrome. Emulation does not establish actual device compatibility; document unavailable hardware and residual risk. Read PDF and equivalent HTML on mobile and desktop, and inspect two page print layout.

## Release gates, proposed

1. Applicable mode-specific ACs have recorded proof; no open critical/high safety/privacy defects. Authored mode cannot mark AI functionality delivered. No clinical or runtime approval is inferred from plan revision approval.
2. Separate outcomes pass: 32/32 valid navigation, 24/24 rejected request and 16/16 core state cases in authored mode (72 executed). Reviewed mode additionally requires 8/8 selection/infrastructure state cases (80 executed). Mark conditional tests not applicable when disabled, not passed. Urgent metric is 16 executions of V08, unique clinical variant count one. No 80/80 clinical accuracy or demographic fairness claim.
3. Every displayed source/text matches registry and exact complete bundle. Reviewed mode has actual clinical/rights records for every reachable bundle; authored simulation carries explicit unvalidated status and never invokes a model.
4. Both modes complete with no AI. Authored mode proves no provider call and 503 for a contract-valid selection request. Reviewed mode additionally injects no key, 429, invalid fragment selection, late response and timeout. No path downgrades urgency.
5. Core clear/whole-variant tests pass; reviewed mode additionally tests provider revoke/response races; no canary leakage in URL, storage, logs or another browser. Solo report offers full preview/print/cancel and no selective-share controls. Redis and transitive Q05 redaction are required only if X-AI/X-REPORT is separately added, never claimed as baseline deployed evidence. Actual hosting headers verified.
6. No unresolved serious/critical automated accessibility issue and no manual critical task failure. Contrast is measured, not assumed from token names.
7. At least 4 of 5 formative participants understand next step, limits and privacy; if fewer participants are available report actual denominator and outstanding gate, never invent passes.
8. Known deploy commit, no client/artifact secrets, kill switch/rollback and fresh judge links work. Before public AI: trusted ingress, token/price bounds, Redis atomic 10/IP/minute and 100 attempts/UTC-day reservations, correct expiry and fail-closed tests from ADR 0004 pass. Otherwise authored deployment only.
9. Final claims and limitations match evidence and actual reviewer status. Official template, character/file limits and video duration verified.

If a gate fails, fix, constrain or disable the affected behavior and rerun relevant checks. Do not repeatedly rerun unrelated tests for confidence. A competition deadline cannot convert failed safety checks into success. A smaller authored simulation may be the fallback; record any requirement it no longer meets.

## CI and review approach

After implementation authorization: lockfile install → formatting/lint/typecheck → unit and API tests → production build → critical browser journeys. Use synthetic fixtures in CI. Candidate model tests are separately budgeted and versioned; do not make every PR depend on a nondeterministic provider call. Human clinical review and actual UI verification remain distinct from code review. The JS Mastery `check` and `test` skills informed this separation; they were inspected, not run against nonexistent code.

The sole builder performs and labels self-review. Independent code/model review may supplement it if actually arranged, but Jeremiah is not assigned and model review cannot supply human or clinical approval. No second-person signoff is assumed. Record findings and fixes with their source commit. Incident or regression fixes add a meaningful case covering the failure.

# 0004. Shared admission and model spend controls

**Date:** 2026-10-23
**Status:** Proposed, selected planning revision authorized; no service creation or deployment authorized.

Solo revision 3: this decision is retained for a future separately funded X-AI slice. It is not implemented or part of the 82h authored core, and the solo builder is not expected to provision Redis/model services for the baseline.

## Summary

Use one shared metadata counter store before a public model call. Admit only bounded requests within a per-IP rate and a project-wide daily reservation. If the store or required approvals are unavailable, retain authored mode.

## Context and options

Process memory cannot enforce a global limit across serverless instances. Browser revisions can be reset. Vercel firewall rules alone do not define the application's daily token-cost reservation. A managed shared counter adds a dependency, but avoids falsely claiming a durable cap without shared state. The alternative is no public provider endpoint, which remains the default until this decision is implemented and verified.

## Decision and data boundary

Selected planning mechanism: Vercel Node function region `sin1` (Singapore) and Upstash Redis with one AWS Singapore `ap-southeast-1` primary and no read regions. All admission reads/writes execute as one Redis EVAL script against the primary. No health records, scenario IDs, medical outputs or consent histories enter Redis. Only expiring pseudonymous IP counters and anonymous project daily reservation totals are stored. No PostgreSQL or user accounts are added.

Official docs checked 23 October: [Vercel regions](https://vercel.com/docs/regions), [function region configuration](https://vercel.com/docs/functions/configuring-functions/region), [trusted request headers](https://vercel.com/docs/headers/request-headers), [Upstash regions](https://upstash.com/docs/redis/features/globaldatabase), [EVAL](https://upstash.com/docs/redis/sdks/ts/commands/scripts/eval) and [expiry](https://upstash.com/docs/redis/sdks/ts/commands/generic/expire). They establish available primitives, not a tested account configuration or contract. Actual account access/plan/retention and costs are enablement gates.

## Standard definition

| Dimension | Exact planning choice |
|---|---|
| Trusted client metadata | On direct Vercel deployment only, normalized single IP from `x-vercel-forwarded-for`; no additional reverse proxy. Missing/malformed/multiple addresses fail closed for AI. Do not trust arbitrary headers on an independently reachable origin |
| Key pseudonym | HMAC-SHA256 of normalized IP plus server UTC date under server-only LIMITER_HMAC_SECRET. Never store raw IP in Redis or application logs |
| Per-IP counter | One key for production project, UTC minute and daily pseudonym; at most 10 admitted calls in that fixed minute; logical expiry at minute end plus 60 seconds |
| Global daily reservation | One production-project key per UTC date, shared across deployments/instances/providers. At most 100 admitted provider attempts, each reserving integer USD cents=1; logical expiry at next UTC midnight plus 1 hour |
| Atomic admission | One EVAL checks both keys and increments both only if limits permit, sets absolute expiries, then returns allow/deny. Keep a common Redis hash tag for both keys. No separate read-then-write and no replica reads |
| Duplicate/failed requests | Every admission consumes one reservation even on timeout/refusal/duplicate click. No refund/retry/refund race logic. SDK automatic retries disabled; one provider attempt per successful admission |
| Request bounds | Request body 2KB. Provider input is a fixed compact instruction/schema plus authored alternatives. Conservative UTF-8 byte total of all submitted text/schema plus 512 protocol-overhead allowance must be ≤3,000; otherwise use authored fallback. Verify actual provider usage remains within 3,000 input tokens during qualification, disable on any breach |
| Output/tool bounds | max_output_tokens=256 total billed output including reasoning, reasoning disabled where supported, no tools/images/uploads; candidate ineligible if hard output bound unsupported |
| Price qualification | Enable only if current selected processing rates ≤USD 1/M input and ≤USD 4/M output, no extra paid tools. Upper token scenario: 3,000×1/M + 256×4/M = USD 0.004024 before exceptional fees, below USD 0.01 reservation. Recheck on model/provider/processing change |
| Daily ceiling meaning | USD 1/day of conservative application reservations, not a guarantee of final invoice/hosting/Redis/tax charges. Calendar reset is server UTC, not Brunei date or client clock |
| Exhaustion/failure | 429 for exhausted limits; 503 for store/config uncertainty; no model call, authored text remains. Lost response after reservation does not trigger a retry |
| UI convenience limits | One active call and five attempts per viewRevision only improve UX. They are resettable and never described as security/spend controls |
| Enablement | Default AI_ENABLED=false. Actual clinical/rights records, account/secret configuration, region/log review, deployed concurrent admission test and observed usage qualification must all pass |

An IP is not a person. NAT may unfairly group users and IP rotation can evade local limits; the shared global key still bounds admitted attempts. Do not promise denial-of-service protection or a total infrastructure spend ceiling. Keep a separate provider project key, restrict its permissions, set vendor billing notifications, review daily usage and retain an immediate AI disable switch. Provider-side invoice reconciliation remains necessary.

Logical key expiry does not prove physical deletion from vendor backups/security logs. Review actual service retention and disclose metadata processing before public use. The health-data-free design still processes visitor IP metadata; no regulatory exemption is claimed. Do not create resources or accept vendor terms as part of this planning revision.

## Critical verification and consequences

T15/T19 must prove: 20 simultaneous same-IP valid requests admit at most 10 within one minute; distributed calls near the daily boundary admit at most the remaining project reservations; a deployment change preserves the same daily key; stale/spoofed client revisions do not bypass global limits; limiter failure prevents provider use; raw IP/variant/body absent from Redis keys/values and logs; TTL matches UTC boundaries; recorded provider token usage respects the conservative reservation assumptions. Invalid request validation precedes provider admission. Test trusted-header behavior on the actual deployed ingress, not localhost headers.

This adds a small metadata service and provider review work. If access, plan, retention, budget or primitives cannot meet the contract, do not replace it with process memory or unverified firewall claims. Keep AUTHORED_SIMULATION and record AI delivery as absent. The task budget explicitly includes configuration/testing; no external account has been provisioned.

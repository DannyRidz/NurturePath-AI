# Review, feat/local-coach-experiment, 2026-11-06

**Reviewed by**: Codex review subagent; author model identity not independently established, so cross-model independence is not claimed.
**Scope**: Uncommitted local simulation experiment, launcher, contracts, tests, configuration, isolation scanner and CI; final follow-up on current working files.
**Verdict**: Approve

## Summary

The separate Next application implements a truthful authored simulation with no provider adapter or network dispatch. Local Host/Origin/token admission, strict input/output validation, exclusive request locking and atomic counter replacement are appropriate for this scope. No verified blocker, major or remaining actionable minor defect was found. This is an engineering source review, not clinical approval or proof of completed latest-head CI.

## Resolved findings

- Initial missing CI coverage: the current workflow separately typechecks, unit-tests, builds and browser-tests the experiment, and checks public-export isolation after the root preview build.
- Delayed lifecycle coverage: the expanded browser suite now holds real fixture responses through clear, consent withdrawal, Hide, navigation and example replacement, then checks that stale drafts remain absent. Malformed success and browser deadline handling are also covered.
- Stream/process boundary coverage: unit tests now cover a stalled body deadline without reservation, refused second launcher, stale request lock and initialization that cannot reset an existing ledger.

## Strengths

- Canonical report data supplies all seven answer states, including purpose through `report.purpose`; strict simulated provenance prevents fixture output being presented as generated AI.
- The result page's pathname condition and revision key unmount the coach across navigation and session/example changes; request IDs and revision checks reject stale work.
- Exclusive request.lock spans counter reservation and generation; counters are written and synced before atomic rename, and absent/corrupt ledgers fail closed.
- No provider integration exists and the root app has no experiment imports. The export scanner inspects the root route manifest and generated public artifacts.
- Browser runs use a fresh uniquely named ledger and one worker. Their current fixed attempt count stays below the 60-attempt allowance; repeated test invocations do not reuse old counters.

## Test coverage and limits

Independently executed the final `npm run test:coach`: 31 tests passed. Reviewed the expanded 50-case, five-project browser suite and CI configuration without independently rerunning browsers or builds in this review. The primary agent reported an earlier 50/50 browser pass and a final rerun in progress; those statements are not substituted for independently observed results here. Latest-head CI and the primary agent's final browser run still require observation before readiness is reported.

Crash recovery is deliberately conservative: abrupt runner failure leaves a runner lock, and interruption during a request can leave a request lock; operator reconciliation is required. Tests simulate these retained locks rather than kill a live runner mid-write. This review found no reason to expand the authorized simulation into provider integration or public hosting.

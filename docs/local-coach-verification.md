# Local coach simulation verification

6 November 2026. Governing specification: [0007](specs/0007-ai-appointment-coach.md). This checklist covers the authorized simulated local slice, not provider qualification or the complete AI proposal.

## Completed checks

* [x] Strict V01/version/consent request contract, bounded bytes, exact local access and no cache responses.
* [x] Unsupported variants, V07/V08, missing/wrong token or Origin, disabled and hosted configurations deny before admission.
* [x] Server derives canonical facts; fixture clearly states simulated provenance and exactly three questions.
* [x] 31 endpoint/schema/launcher tests pass, including stalled body deadline, atomic concurrent admission, corrupt/missing ledger, stable exhaustion, second runner refusal and refusal to reset an existing ledger.
* [x] 50 coach browser cases pass across desktop/mobile Chromium and WebKit and desktop Firefox. Consent is unchecked, report excludes coach, and clear/withdrawal/Hide/navigation/replacement discard delayed responses. Invalid response and browser timeout preserve authored guidance with no automatic retry.
* [x] Axe reports no violations in the successful coach surface across the five projects. Desktop/mobile screenshots inspected for layout and truthful labels.
* [x] Root lint and separate typechecks pass. Root 45 unit tests and optimized webpack builds pass.
* [x] Authored desktop browser regression: 58 passed, one expected preview handler skip.
* [x] Vercel style static export build passes; export scanner proves no coach endpoint or simulation UI is included.

Final authored browser regression, export isolation and latest head CI evidence are recorded in the implementation PR. CI runs the complete authored browser matrix and the separate coach matrix. CI uses only authored fixture responses and temporary test tokens.

## Observed fixes

The first browser pass found that Next normalizes the internal request URL, so local ingress checks use the actual Host and Origin headers plus the token. Exact loopback binding remains in the launcher. Browser checks also caught an accessibility landmark missing from the local status banner; it now has an aside landmark. Two test selectors needed more precise roles. These are corrected, not waived.

A separate source review is in [the review record](reviews/2026-11-06-local-coach-review.md). Its initial CI concern was addressed by adding a separate experiment job and an export isolation assertion. Suggested failure/race coverage was added. Model independence is not independently proven.

## Limits and later work

No model was called, no money spent and no provider account/key configured. Simulated output is not evidence of model usefulness, latency, clinical safety or patient benefit. Public AI, hosted admission, qualified clinical/source review and actual provider evaluation remain unimplemented. The full specification stays In Progress.

Actual phone hardware, VoiceOver and manual text scaling remain manual checks. The local shell intentionally discards the coach when hidden; it does not change the public shell. Filesystem crash recovery is deliberately manual and fails closed; do not claim fault tolerant accounting or serverless enforcement. No public deployment was performed for this slice.

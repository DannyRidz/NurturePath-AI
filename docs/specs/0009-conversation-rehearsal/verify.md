# Verification: interactive conversation rehearsal

This checklist derives from proposed criteria CR-01 through CR-16. It is a future verification protocol, not a record of passing results.

## Before implementation or real calls

* [ ] Confirm the actual build authorization and eligible phase, CR-16.
* [ ] Freeze the goal/rubric/case registries and synthetic fixture manifest, CR-02, CR-05, CR-14.
* [ ] Confirm the original allowance was not reset or reused as authorization for this task, CR-12.
* [ ] Record the separate paid-call approval before any provider dispatch, CR-12, CR-16.
* [ ] Keep public typed text disabled until actual B3 and release records exist, CR-01, CR-11, CR-16.

## One complete user journey

* [ ] Enter from eligible V01 after the written result; no provider call occurs on open or goal selection, CR-01, CR-02.
* [ ] Verify V07/V08 and every unregistered case have no rehearsal action or provider request, CR-02.
* [ ] Write a synthetic question, inspect the exact transmission preview, decline Google and use the local worksheet, CR-01, CR-04, CR-08.
* [ ] Accept the specific notice and deliberately send round one; validate identity, provenance, usage and plain output, CR-03, CR-06.
* [ ] Display original wording, specific notes and a rewrite without modifying the written guidance, CR-03, CR-05.
* [ ] Edit locally; no request occurs until the second explicit send. Verify the original receipt and current revision, CR-03, CR-04.
* [ ] Select and order up to three questions; all include controls began unchecked, CR-10.
* [ ] Preview a labelled sheet and cancel without saving, uploading or changing the complete report, CR-10.
* [ ] Print explicitly; inspect actual output and source/model labels. No hidden/unselected question or invisible original is printed, CR-10.
* [ ] Clear and use Back/reload/direct URLs; no practice text, selection, feedback or token returns, CR-09.

## Service, data and race tests

* [ ] Reject missing/wrong Origin, preview/CI/export environment, invalid signature, expiry, wrong case/goal/version and unsupported country before dispatch, CR-02, CR-04, CR-16.
* [ ] Reject extra JSON fields, oversized bodies, malformed Unicode/control/markup/link input and detected identifiers before admission, CR-04, CR-11.
* [ ] Verify the exact normalized text shown in the preview is what reaches the injected provider transport, CR-04.
* [ ] Exercise duplicate request IDs, stale rounds, simultaneous requests, expired sessions, forged receipts and attempted third requests; no unintended provider dispatch, CR-07.
* [ ] Verify a known refusal or local policy boundary closes the AI rehearsal, issues no receipt and blocks a later send before admission. Ordinary editable field errors do not consume an attempt, CR-07, CR-08.
* [ ] Verify Redis atomically increments both session and global counts before provider dispatch, with no refund/reset, CR-07, CR-12.
* [ ] Inject corrupt/missing/slow Redis and lost acknowledgements; dispatch stops on uncertainty, CR-07, CR-08.
* [ ] Deliver timeout, refusal, invalid JSON, extra properties, fake quotes/IDs, wrong provenance, missing usage, oversized output and unsafe prose; no visible successful feedback is fabricated, CR-05, CR-06, CR-08.
* [ ] Shut down while pending; a late success cannot undo operator shutdown, CR-07, CR-12.
* [ ] Delay responses, then Clear/Hide/withdraw/dismiss/change case/change goal/navigate/hide the document. Release the response and verify no revival or cross-session attachment, CR-09.
* [ ] Delay a completed mock response and explicitly drain its handler before testing a deliberate retry; do not accidentally race an orphaned fixture request, CR-07, CR-09.
* [ ] Inspect application logs, Redis, browser storage, URLs, static output and bundles for prohibited content/credentials, CR-11.
* [ ] Check all value-sourcing rows against actual input/configuration sources, especially first-round receipt, canonical facts and selected print content, CR-04, CR-10, CR-12.

## Browser and print verification

* [ ] Desktop/mobile Chromium and WebKit plus desktop Firefox: entry, both agreement steps, feedback, revision, selection, reorder, fallback and clear, CR-01, CR-03, CR-08, CR-09, CR-13.
* [ ] Keyboard-only complete journey, proper focus restoration, live status announcements and automated accessibility checks, CR-13.
* [ ] Inspect desktop and mobile screenshots and 320px layout; long questions and Unicode cannot overflow, CR-13.
* [ ] Verify actual print/Cancel/Hide behavior, with Chromium PDF assertions and recorded manual native-dialog checks where automation does not prove them, CR-09, CR-10, CR-13.
* [ ] Existing twelve-case written report, urgent interruption and original coach regression suites remain green, CR-02, CR-08, CR-10.

## Model and usefulness evidence

* [ ] Complete qualification before freezing a separate thirty-session evaluation set, CR-14.
* [ ] Review every expected output and boundary case; record failures rather than dropping them, CR-05, CR-14.
* [ ] Report valid-turn numerator/denominator, unsafe/invented facts, rubric scores, failures, p50/p95, actual usage and reservation totals, CR-12, CR-14.
* [ ] Report communication-quality denominators separately from deliberate refusals, CR-14.
* [ ] Freeze sixty interaction slots with expected states, receipt availability and dispatch decisions. Include terminal denials and dependent uncompleted slots; report actual provider attempts and at least 24 coached outputs separately, CR-14.
* [ ] Confirm a named qualified reviewer, real participants, study notice and artifact retention before the human comparison, CR-15, CR-16.
* [ ] Counterbalance tasks/order and blind human scoring; report disagreement, missing data and sample-size limits, CR-15.
* [ ] Compare against both written information and the fixed worksheet; do not claim superiority merely because Gemini generated text, CR-15.

## Public release and handoff

* [ ] Review the exact diff, run applicable lint/type/build/unit/service/browser checks and inspect actual latest-head CI, CR-06, CR-13, CR-16.
* [ ] Verify anonymous production access, deployed headers, exact Origin/client ingress, actual secret scoping and static export isolation, CR-11, CR-16.
* [ ] Read the actual approved shared counters before activation and after hosted verification; do not rely on the historical 33-attempt record, CR-12.
* [ ] Verify shutdown and rollback without resetting either release allowance, CR-07, CR-12.
* [ ] Verify no patient intake or new country eligibility is inferred from this proposal, CR-16.
* [ ] Obtain and record the explicit public release approval after the evidence is concrete, CR-16.
* [ ] Record limitations, unperformed manual checks and the first incomplete phase for the next chat.

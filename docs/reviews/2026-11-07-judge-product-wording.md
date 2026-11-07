# Review, fix/judge-product-wording, 2026-11-07

**Reviewed by**: Codex / GPT-6 (same model as the author by user preference; separate reviewer context with earlier review context retained; exact runtime identifier not independently verified)
**Scope**: 17 implementation/test files, branch vs main including uncommitted changes
**Verdict**: Approve

## Summary

The wording describes the working fictional example journey and gives a clearer path to optional Gemini questions. It retains separate Google consent, fictional-only use, medical-care limitations, provider retention disclosures and report exclusions. Five additional caution/source strings preserve medical instructions, limits and rule behavior, and a follow-up test-only change makes delayed response delivery deterministic before a deliberate retry. Four malformed replacement words identified during review were corrected; no verified findings or stale selectors remain in the current diff.

## Strengths

- The homepage explains the specific General learning action, the Google notice and the choice to request three AI questions, rather than implying every example uses AI.
- Result and report status remain explicit about fictional content and the absence of clinical validation or clinician review.
- The diff retains safety advice, third-party retention limits and separate provider consent; corresponding browser selectors and report assertions are updated.
- The five `src/lib/scenario.ts` string changes preserve urgent-help instructions, insufficient-information handling, the prohibition on stop/start/taper instructions, care-service/timing limits and source nonvalidation. No answer facts, rule IDs, branching, question inputs or provider implementation change appears in that addition.
- The follow-up at `experiments/coach/e2e/coach.spec.ts:33` fetches and asserts a successful synthetic response before holding its delivery, then drains the handler after dismissal before making the next real local request. This preserves the late-completion test while avoiding an uncontrolled delayed dispatch; it changes no service, ledger or provider behavior.

## Test coverage

Reviewed the diff and searched public and experiment browser tests for removed onboarding labels and review-status strings. No remaining stale selectors were found. Confirmed the four malformed replacement words were removed and the revised sentence, “Agreeing here does not send anything to Gemini,” matches both browser assertions. Also reviewed the five final catalog string changes against main. The parent reports initial lint, type checking and webpack build passed, all 104 unit tests passed after the catalog addition, and the frozen public request remains exactly hash `6ff661f0dffc0b1f22c5a76fc102ffcbfa25d1f71c27e94620eaaef4c02d697d`, 3,156 bytes. Final rebuild and browser/report verification must cover that last addition. This reviewer did not rerun those checks or inspect deployed rendering. Source review does not establish clinical approval or independent model corroboration.

CI run `42365397772` subsequently failed the isolated simulation CO-07 dismissal/revoke/Hide test while 54 other simulation checks passed. The parent reports the original desktop test passed ten local repetitions, so the suspected overlap between a late first dispatch and the next request's exclusive ledger lock is not a proven explanation of that CI failure. Independently reviewed the test correction: the successful upstream fetch finishes before dismissal, only response delivery is delayed, expected canceled fulfillment is caught, and an explicit handler completion promise precedes removal and retry. No source defect was found in this correction. Fifteen revised checks (three repetitions on each of five browser projects) are in progress; their outcome and latest-head CI still need inspection before merge.

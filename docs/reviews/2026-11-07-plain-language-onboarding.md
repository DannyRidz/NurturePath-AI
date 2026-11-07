# Review, fix/plain-language-onboarding, 2026-11-07

**Reviewed by**: Codex / GPT-6 (same model as the author; separate reviewer context, with earlier review context retained; exact runtime model identifier not independently verified)
**Scope**: 10 implementation/test files, branch vs main including uncommitted changes
**Verdict**: Approve

## Summary

The change makes the homepage, example selection, session agreement and shared frame easier to understand and explains how to find optional Gemini questions. It preserves the distinction between the session agreement and the separate Google consent, without changing clinical facts, safety decisions, requests or counters. An initially identified stale decline-path selector was corrected during review; the current diff has no outstanding verified defects or misleading claims.

## Strengths

- The copy explicitly says that agreeing to the demo does not send anything to Gemini and retains a separate provider agreement.
- Existing browser helpers were updated across public and isolated experiment suites; new assertions cover the Gemini entry point and the ability to skip it.
- The implementation diff changes presentation strings only and preserves the canonical catalog, safety flow and spending controls.

## Test coverage

Reviewed the changed browser helpers and assertions, and searched both browser suites for old onboarding labels. The AC-02 selector at `e2e/journey.spec.ts:109` now matches `Leave and view sources` in the consent form. The added AppFrame changes affect only visible header/footer strings. The parent reports successful lint, 104 unit tests, type checking and a webpack build, with final browser verification and rebuild in progress; those checks were not rerun by this reviewer. The corrected decline path still needs its browser run before merge. This is a source review using the same model as the author, not independent model corroboration, deployed verification or clinical approval.

# Review, test/release-validation, 2026-10-26

**Reviewed by**: gpt-6-astra (author model unavailable; cross-model independence is not established)
**Scope**: 13 files, branch vs main including uncommitted and untracked changes; merge base `6ffd1cfc10232844a707ab7afacfc6f583268403`
**Initial verdict**: Changes requested

## Summary

The change makes urgent and unknown-safety interruption local to the current React view, adds five browser projects and release checks, and corrects stale capability statements. The interruption is derived from the existing canonical case and preserves the no-provider, memory-only boundary. A direct Chromium check found that starting a fresh session after an inline urgent result retains the preceding session's checked consent and adult-scope controls. Engineering review does not provide clinical approval or establish overall release readiness.

## Major

### 🟠 Fresh session retains checked consent and adult controls, `src/components/journey.tsx:146`

**Problem**: `Consent` keeps `accepted` and `adult` in component state without tying them to a session. Next.js retains this component across navigation. Reproduced against the production build: select Sudden severe pain, accept the notice and adult scope, reach the inline result at `/consent`, click Finish and clear, Start again, select General learning, and Continue. The session-notice checkbox is already checked and its Accept button enabled; after accepting, the adult checkbox is also already checked. Direct Playwright readback returned `true` for all three checks.

**Why it matters**: The new session is presented with prior-session acknowledgements, contrary to the unchecked notice requirement in S03 (`docs/07-screen-specifications.md`) and fresh-session intent of AC-02/AC-11. The `resultConsent` token correctly prevents stale result rendering, but it does not reset the form acknowledgements. The retained form-state defect predates this change; it is a verified release-validation defect within the authorized fix scope.

**Suggested fix**: Reset or key the consent form state on a new session/clear boundary, while preserving already-consented same-session navigation. Add a real-browser regression covering urgent inline result → clear → restart → fresh unchecked notice → fresh unchecked adult confirmation → ordinary assessment. Include a new selection from the catalog without clear if that also retains the component.

## Strengths

- Urgent and unknown-safety replacement uses a reducer update and existing local results component, removing the route-fetch dependency without introducing a second rule implementation.
- Offline checks cover initial safety selection and replacement from assessment, review and results, with focused headings and no continuing questionnaire controls.
- New browser projects preserve report behavior while explicitly skipping the Chromium-only PDF API; docs distinguish engineering checks from planned evaluation and clinical approval.

## Test coverage

Reviewed the complete new release suite and existing journey/report checks. Existing tests cover all twelve authored outcomes, ordinary clear/Back/refresh, whole-case replacement, and report preview; the new suite covers offline safety entry, keyboard navigation, viewport checks, cross-tab isolation and simulated background masking. The retained consent lifetime edge was not covered in the initial diff and was independently reproduced during this review; the author is adding a regression.

At this review point the author reported an earlier full run with 277 passes, six skips and two failures: a WebKit keyboard convention mismatch subsequently corrected, and a trace-file collision from a concurrent targeted run. The collision artifact was inspected and contains an ENOENT during browser-context teardown. This report does not convert either failed run into a clean pass. A clean final run, applicable lint/type/unit/build checks and latest-head CI remain author verification gates; they have not been independently certified here. No actual-device, assistive-technology, native-print or clinical approval is claimed.

## Author resolution and final verification

The reviewer reproduced the issue and inspected the proposed consent key fix, but ended before a final independent recheck. The resolution below is author verification, not an independent approval.

The form now renders through `ConsentFlow`, keyed by the consent timestamp or the preconsent selected example. New consent and clear reset local acknowledgements and the inline result marker, while same-session adult confirmation, replacement and Back keep the accepted consent identity. The new regression first failed on checked notice state, then passed after the fix. A native Safari check also confirmed both new boxes were unchecked and their buttons disabled.

The native check revealed a related retained catalog choice. Expanding the regression to require no checked radio reproduced that issue in desktop/mobile WebKit and Firefox. `StartExampleFlow` is now keyed across the cleared/open boundary. Native Safari confirmed all twelve choices unselected and Continue disabled after urgent → clear → Start again.

The final uninterrupted full browser run passed 284 checks with six explicit non-Chromium PDF API skips and no failures. All five projects passed the clear/catalog/consent regression, offline safety and keyboard journey. All 45 unit tests, ESLint, TypeScript and the webpack production build passed. Diff inspection found no further engineering blocker in the final small key/reset changes. Latest head CI remains a required premerge check, recorded by the pull request. The initial Major is resolved by these implementation and browser results; its historical finding above is preserved.

The remaining physical-device, VoiceOver, text-only scaling, human usability and clinical gates are in [release verification](../release-verification.md). No clinical approval or completed independent final review is inferred.

# Review, live tester disclosure, 2026-11-09

**Reviewed by**: Fresh Codex review agent (runtime model identifier unavailable)
**Scope**: 5 disclosure and icon files, plus the pending `e2e/journey.spec.ts` network allowlist fix on `fix/live-tester-disclosure`
**Verdict**: Approve

## Summary

The home, consent and privacy copy now distinguishes the established fixed V01 Gemini coach from the live wording rehearsal. The privacy page accurately describes the reduced provider request, optional original wording in round two, memory discard, retained usage metadata, separate prepaid metering and absent clinical review. The new icon uses the existing cobalt slash mark, and the added link rule makes inline privacy and notice links visually identifiable. The follow-up browser allowlist accepts the Next icon URL that Firefox requested. I found no source defect or material overclaim in these changes.

## Strengths

- The new disclosure says free writing may contain personal information despite warnings and filters, avoiding a false promise that the tester cannot submit it.
- It distinguishes clearing local rehearsal state from recalling a request already sent to Google, and preserves the fixed coach's separate 60 attempt and USD 1 reservation explanation.
- The home and consent additions point to the separate rehearsal agreement without implying that journey consent sends data to Google.
- The underline rule is limited to links inside prose and notice paragraphs. It retains the existing cobalt color, hover color and visible keyboard focus outline, and does not alter button links or the report print rules.
- The browser allowlist accepts only same-origin GET requests for `/icon.svg`, with an `_rsc` parameter already allowed elsewhere, a narrowly shaped `icon.<alphanumeric>.svg` parameter name, or a 16 character hexadecimal parameter name used by the local webpack build. Other paths, methods, origins and query names remain subject to the original rejection rule.

## Test coverage

This is a copy, icon, focused style and browser test change. I reviewed the current tester request builder, browser discard events, hosted admission policy and fixed coach limits against the wording, plus the surrounding link, print and request allowlist rules. The parent is running the targeted Firefox test; this review does not claim it or latest head CI has passed. No funded service, account, credential or provider was accessed.

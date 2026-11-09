# Review, hosted tester implementation, 2026-11-09

**Reviewed by**: gpt-6-astra; author model unavailable
**Scope**: Uncommitted hosted tester routes, HTTP service, provider wrapper, browser journey, shared validators/state, export isolation and regression tests under specification 0011
**Verdict**: Approve after source fixes; browser/build/CI and deployed verification remain separate gates

## Summary

Reviewed the hosted tester implementation as an authorized prototype usability release, with qualified clinical review explicitly absent and prepaid funding separately authorized. The new service gates the tester namespace behind production configuration, reviewed hash, exact Origin/Host, access code and supported-location/client metadata, while retaining the shared admission and provider-validation path. Found three concrete defects in the initial UI/validation implementation; the author fixed each during review. No provider, credential, funded-store or production operation was performed by this reviewer.

## Findings and resolution

### Major, production Hide did not discard rehearsal content

**Original location**: `src/components/tester-practice.tsx:84`.

The cloned component listened only for the local experiment's `rehearsal-clear` event, while the production `AppFrame` dispatches `nurturepath:hide` and conceals mounted children. Consequently Hide would retain practice wording/access code and would not invalidate a pending request; Resume could restore that content. The author added the existing production Hide event listener and its cleanup. The new browser regression delays a request, hides/resumes, and checks cleared practice and credentials. Source fix accepted; browser execution evidence is recorded separately below.

### Major, live preparation sheets claimed no model was called

**Original location**: `src/components/tester-practice.tsx:734`.

The live sheet retained `Model: none. authored-fixture-1.` and `Simulation configuration` after Gemini feedback. Other branches still described a written fixture or simulation failure. These strings contradicted actual processing and persisted into the printable artifact. The author replaced them with live Gemini provenance and truthful unavailable/no-strength wording while preserving `Model: none` for the written-only worksheet. The browser regression asserts the live model label and absence of the fixture label. Source fix accepted.

### Major, browser validation omitted live content and usage checks

**Original location**: `src/lib/rehearsal/contract.ts:187`.

The new browser envelope schema initially accepted arbitrary nonnegative usage totals and called only the generic feedback validator. It therefore omitted the unsupported-topic/fact-reference guard added after actual qualification failures and the live usage bounds/consistency checks. This did not meet independent server/browser validation. The author moved the pure usage/content rules into browser-safe `live-validation.ts` and wired both the provider/profile and browser envelope validator to them. Inspected the shared implementation and confirmed an independently constructed malformed live envelope is rejected; regression assertions cover unsupported content and invalid usage. Source fix accepted.

## Additional verification improvements

- The initial service tests exercised only session creation, while browser tests mocked both HTTP endpoints. Requested and reviewed a synthetic two-round `handleTester` integration test with injected store/provider transport, receipt binding, two consumed reservations, settled pending state and third-attempt denial.
- Flagged that checking the tester feature flag in the statically rendered results page could freeze the entry link at build time. The author moved it into `TesterAvailability`, a Suspense-wrapped runtime component using `connection()`. The actual build/browser check must verify flag behavior.
- Requested tester-route print-media checks for incidental concealment, live provenance, Hide and the unchanged complete report. Existing local-experiment print tests alone do not verify this new production-shell composition.

## Strengths

- Local frozen-fixture dispatch retains its whitelist and environment restrictions; hosted dispatch is a separately gated wrapper rather than an HTTP bypass for the operator command.
- Request bodies are bounded and parsed strictly before admission. Redis receives identifiers and HMAC client metadata, not practice text, provider credentials or raw client IP. The tester namespace does not modify the historical public/local budgets.
- The Google preview uses the reduced wording context and identifies host/provider processing, cancellation limits and absence of clinical review. The browser retains explicit selection, memory-only state and separate sheet/report behavior.

## Verification and remaining evidence

Independently ran the tester-service, Gemini and shared-service regression files after the fixes: **31/31 tests passed**. These used synthetic transports and did not make real calls. Reviewed the new hosted browser cases and shared pure validator regression. At report creation, final native/export build and browser verification were still being completed by the parent; no latest-head CI or deployed activation evidence is claimed by this review.

No open source-level major/blocker remains from this pass. The code-review verdict does not declare the hosted release ready. Finish the applicable browser/print/build/export checks, inspect actual CI for the latest head, and verify real protected hosting, trusted ingress metadata, provider configuration, both coaching rounds, actual response headers and shared shutdown before release. Qualification and prototype usability evidence must not be described as clinical validation or proven learning benefit.

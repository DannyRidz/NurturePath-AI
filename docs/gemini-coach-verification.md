# Local Gemini adapter verification

6 November 2026. Contract: [0007](specs/0007-ai-appointment-coach.md). This verifies the disabled local integration, not live model behavior or clinical suitability.

## Implementation

* The server derives all seven V01 answers from the canonical report mapping. The fixed prompt, provider schema, model, notice and request configuration are hashed together.
* The launcher defaults to simulation. Explicit Gemini launch uses separate local counters, masked key entry and an expiring operator activation record. No activation record or provider key was created by this work.
* The handler checks loopback access, token, input, versions, consent and activation before reservation. Unsupported and urgent cases cannot reach the provider. CI, hosted and exported configurations deny real dispatch.
* Each admission reserves one attempt and one cent before a single direct REST call. Requests have byte, response and time limits, no redirects and no retries. Failures retain reservations. The provider key is not in URLs, payloads, browser configuration, counters or reports.
* Success requires expected model/provenance, a complete single text response, valid usage and independent output validation. Obvious pattern exclusions supplement the schema; neither establishes semantic safety. Every actual successful draft still requires review.
* Gemini mode has provider consent, paid processing disclosure, reviewed account disclosure when evidence exists, labelled AI drafts and honest unavailable states. Clear, withdrawal, navigation, Hide and replacement invalidate pending results. Existing authored reports exclude drafts.

## Observed local checks

* Root lint and root/experiment type checks passed.
* Root unit suite: 45 passed. Experiment suite: 65 passed, including deterministic provider success/refusal/truncation/invalid schema/markup/advice, token violations, large/stalled responses, ignored abort, provider errors, changed/expired activation, account flags, concurrency, exhausted allowance and disabling through evidence removal.
* Optimized local experiment and root preview builds passed with webpack. Root export scanner passed with Gemini markers included.
* Authored exported preview desktop regression: 59 passed, including safety interruptions, full reports and Chromium PDF assertions.
* Simulation lifecycle browser matrix: 50 passed across desktop/mobile Chromium and WebKit plus desktop Firefox. The additional local privacy check and final current head browser/CI results are recorded in the implementation PR.
* Gemini browser matrix uses deterministic browser fixtures and a disabled real endpoint. It exercises explicit consent, provider/provenance rejection, unavailable behavior, keyboard action, accessibility, report exclusion and late completion across withdrawal, Hide, clear, navigation and urgent replacement. The current head result is recorded in the PR.
* Desktop/mobile screenshots were visually inspected. Automated accessibility checks found no violations in the tested successful surfaces. This is not manual screen reader or actual phone verification.

An initial Gemini browser run exposed an ambiguous urgent heading selector, corrected by selecting heading level 1. Source review found that reusing public privacy copy would falsely claim no provider requests in Gemini mode. The local privacy page now describes the selected runtime mode. Runtime disclosure is read only from validated activation evidence; no evidence shows an honest incomplete review state. Author review was performed, but independent reviewer/model independence is not claimed.

## Account and trial boundary

Read only authenticated AI Studio inspection confirmed paid tier, prepaid availability and auto reload off. No billing setting, project, key or permission was changed. Account IDs, balances and credentials are excluded from repository records.

The user approved a conditional local trial of at most 60 attempts and USD 1 in reservations. Exact model/API billable token bounds remain unqualified, as recorded in [qualification](gemini-coach-qualification.md). No real model or token counting call occurred, and no credits were spent by this work. No synthetic test output is represented as observed model output. Actual quality, latency, token charges and usefulness remain unknown.

Public AI, deployment, shared hosted admission, qualified content review and report inclusion remain outside this change. No clinical approval is supplied by engineering tests.

# 0008. International adult personal intake

**Date:** 2026-11-07
**Status:** Proposed, design only

## Summary

Design a public service for adults internationally that helps organize their own concerns for a conversation with a health professional. Personal answers require a distinct journey, consent notice and provider review. The fictional Gemini release in specification 0007 does not collect or transmit personal health information.

## Context and confirmed direction

The user requested real personal health intake to be designed and selected a public international adult audience. This authorizes design, not collection, storage or provider transmission of real health data. No clinician, privacy reviewer or service operator identity has been supplied. The sole builder does not provide assumed clinical review capacity.

Google's Gemini Developer API terms prohibit clinical practice and medical advice and restrict use involving people under 18. An educational label alone does not settle whether a proposed real intake use complies. Review the exact intended use before choosing this API for real health information. The approved fictional release budget does not fund a new personal intake service.

## Recommended product boundary

Use a separate entry called “Prepare my concerns” alongside the fictional examples. Its purpose is to organize user supplied facts and learning goals, with optional discussion questions. It must not diagnose, predict fertility, interpret tests, recommend treatment, assess urgency with a model, select care services or recommend appointment timing. Clearly identify what the service can do before any health answer is entered.

Prefer an initial journey without accounts or saved health records. Keep answers in tab memory. Show every fact that would be transmitted and obtain separate consent before optional AI drafting. If a user declines AI, provide a local factual summary without a provider request. Make clearing, hiding, Back, refresh, cancellation and late completion behavior explicit. Do not retain a draft simply because it once passed validation.

The current fictional scenario rules are unvalidated demonstrations. Do not apply their medical decisions to real answers. A real user safety interruption needs a separately reviewed content contract, including what the service does for incomplete safety information, local urgent help information and loss of network access. A model must never decide whether someone can continue.

## Candidate intake model for review

These are proposed fields, not a confirmed data model or production form.

| Value | Proposed source and handling |
|---|---|
| Adult eligibility | Explicit age eligibility confirmation, no birth date or ID upload. Determine the necessary assurance mechanism during provider and regional review |
| Service country | User selected country, used for supported region checks, notice and verified local help. Do not infer eligibility from IP or timezone |
| Purpose | User selects learning or conversation preparation. Requests for diagnosis or treatment remain outside the service |
| Answers | Structured choices with separate unknown, declined and not applicable states. Review the actual question set before implementation; do not convert a fictional case into patient intake |
| Learning goal | Initially structured topic choices. Free text is a separate decision because people can disclose identifiers or urgent concerns |
| Consent | Versioned local session notice followed by optional provider specific consent after a transmission preview. Reconfirm when facts or provider change |
| Summary | Derived locally from the current confirmed answers; optional AI can rephrase only facts the user reviewed |
| AI draft | Temporary response tied to the request UUID and session revision, explicitly review required |
| Report | User initiated preview and print only. Personal report inclusion needs its own verified design; do not reuse fictional labels or timestamps |

No proposed name, email, address, account, upload, photo, test result, clinician messaging or saved history field is included. A future reason to add one requires its purpose, retention, recipient and deletion design to be recorded first.

## Hosting and processing design

Reuse the server architecture and shared admission pattern from 0007 only after a separate personal service allowance is approved. Keep provider credentials on the server. Validate the final personal request schema, body bound, allowed fields and consent version before admission. Establish the actual provider endpoint, processing region, contractual protections, retention, abuse monitoring access, subprocessors and deletion limitations for the intended personal use. Do not assume the paid fictional account review covers a public health service.

Store only minimal anonymous cost totals and expiring rate pseudonyms in the admission store. Health facts, outputs and consent histories do not enter that store. Do not log request or provider bodies, raw IP addresses, prompts, drafts or exception text containing them. Review actual Vercel and provider logging settings and retention before making privacy claims. A memory only app is not a promise that third parties retain nothing.

Recommend a reviewed country allowlist for initial operation even though the intended audience is international. Start with the countries whose operator obligations, language, provider access and urgent help content are actually reviewed. Unsupported or uncertain countries receive the educational fictional journey, without collecting health answers. Worldwide anonymous reach is not evidence of worldwide legal or clinical readiness.

## Proposed acceptance criteria

1. **PI-1:** No health question appears before eligibility, supported country and the personal session notice are resolved.
2. **PI-2:** Every personal value has a named source, purpose, recipient and retention decision. Unknown and declined values never become negative findings.
3. **PI-3:** The user can review and correct exactly what would leave the browser and decline AI without losing the local factual summary.
4. **PI-4:** Invalid input, unavailable provider, region mismatch or exhausted allowance causes no provider dispatch and preserves local summary access.
5. **PI-5:** Clear, Hide, replacement, withdrawal, navigation and refresh discard personal draft state. A late response cannot recreate or mix sessions.
6. **PI-6:** Approved safety content works without a model or network dependency. Unreviewed fictional rules cannot make real care decisions.
7. **PI-7:** Patient facts are absent from operational stores and logs; actual host and provider behavior matches the notice.
8. **PI-8:** Qualified reviewers assess fact fidelity, prohibited advice, comprehension and the intended use. Schema validation is not clinical approval.

## Decisions still owed before a buildable specification

The operator legal identity and contact, initial supported countries and languages, actual clinical/content and privacy review owners, intended use compatibility with the selected provider, exact questions and eligibility mechanism, whether free text is necessary, local summary/report content, processing contracts and retention, hosting controls and the separate personal service budget remain open. This draft intentionally does not invent those business or legal inputs.

Next design pass: settle the operator and initial country set, walk the proposed fields with the user, confirm the data model, then specify each screen, API, failure state, measurable evaluation and release procedure. Keep this draft Proposed until those inputs are resolved. No personal intake code, paid resource or data collection is authorized by this file.

## Source

[Gemini API Additional Terms of Service](https://ai.google.dev/gemini-api/terms), checked through official indexed material on 7 November 2026. Full current terms and the exact intended use must be reviewed before provider selection for personal intake. This is a product design proposal, not legal clearance.


## Fresh design review

The user requested a fresh review with the same model. [The review record](../reviews/2026-11-07-production-design.md) identifies five specific decisions that remain before this draft is buildable, including country meaning, safety transitions, measurable evaluation, lifecycle of answers and exact transmission preview. These are open decisions, not automatic implementation choices.

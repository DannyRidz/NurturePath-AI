# 0002. Navigation and explanation boundary

**Date:** 2026-10-23
**Status:** Proposed

## Summary

You can keep the next step in versioned rules and let optional AI select whole approved authored explanation bundles. A failed model call leaves the authored guidance usable. No model can change urgent guidance or diagnose fertility.

## Context

Medical explanations can influence decisions even when the interface says education. The team needs controlled behavior and a usable experience when generation fails.

## Options considered

An open chatbot can introduce unsupported advice, while a predictive model lacks adequate clinical data. Authored education alone is the simplest baseline and must remain available. Exact selection of authored bundles can be validated mechanically. Arbitrary paraphrasing is deferred because schemas and sampling cannot enforce each response’s medical meaning.

## Decision

Revision 2 selects a finite locked scenario catalog with variant-only requests, deterministic navigation and optional complete fragment-ID selection. AUTHORED_SIMULATION is default and makes no model call. REVIEWED_SELECTION requires actual clinical/rights approval of enabled variant bundles. GPT-6 Luna is primary; one alternative is conditional and a third deferred. A fallback is authored text, not automatic forwarding to another vendor. Implementation skills: JS Mastery architect, security-best-practices and OpenAI Docs; locations and references in the [registry](../03-research-and-sources.md).

Solo revision 3 defers the public AI slice for capacity. The committed app uses authored simulation; no model or Redis integration is required. Fragment-only controls remain mandatory if separately funding X-AI; clinical approval and an actual independent reviewer cannot be inferred from solo self-review.

## Requirements

The canonical [PRD](../04-product-requirements.md) owns AC-02 and AC-04 through AC-15. [Clinical safety](../11-clinical-safety.md) owns draft rule triggers and approval status; [AI architecture](../10-ai-architecture.md) owns provider/guard/failure behavior; [API design](../09-database-and-api-design.md) owns schemas and value sourcing. Do not redefine clinical thresholds in code without a versioned approved change.

## Rationale

Urgent result is local and immediate. Unknown critical answers never become no. Server derives trusted values from its catalog ID. Model output consists only of exact complete allowed fragment bundles, never medical prose, urgency or next-step fields. All source IDs come from cards, not generated links. Clear/edit/revoke invalidates arriving responses. Schema validity is not factual validity.

## Build plan

1. Author limited rules/cards and reviewed or explicitly proposed fixture expectations, AC-04/05/09.
2. Prove local authored journey and urgent interruption, AC-06/07/13.
3. Add clinically gated variant-only server selection and complete-bundle validation, AC-02/08/14.
4. Verify fallback, clear/revision races and report parity, AC-10/11/13.
5. Run held out synthetic/human evaluation and report limitations, AC-12/15.

## Consequences

No open chat or patient test interpretation. The narrow design has less generative flexibility and cannot claim a complete clinical screen. Clinical review and content permissions remain dependencies. Free prose is not in the public scope. Missing clinical/rights approval, invalid selection or failed shared controls keeps authored mode. Review source-section/card mappings and shared admission under ADR 0004 before enabling selection. No unmeasured medical quality claim is justified by provider documentation.

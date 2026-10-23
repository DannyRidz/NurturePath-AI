# People and journeys

These are design archetypes, not researched demographic segments or invented interview findings. Validate them through adult testing with fictional scenarios. Do not ask participants to disclose reproductive histories.

| Archetype | Situation and need | Product response | Validation question |
|---|---|---|---|
| Private explorer | Curious or worried, may share a device, unsure if fertility is relevant | Purpose first, no account, no assumptions about children or marriage, clear finish | Can they explain what is retained? |
| Appointment preparer | Wants to discuss a concern but does not know what to say | Small related questions, why asked, reviewable report | Does report reduce perceived preparation effort? |
| Concerned symptom reader | May have an urgent concern and needs immediate direction | Prominent static urgent information, no completion requirement | Can they reach appropriate guidance without waiting? |
| Clinician receiving a report | Needs source facts, omissions and limits quickly | One concise page, versioned rule summary, no diagnostic score | Can a reviewer separate answers from machine education? |

## Complete consumer journey

1. Arrival: “Understand a reproductive health concern. Prepare for a conversation with a health professional.” Show “Research demonstration. Fictional scenarios only.” Start / What happens to information.
2. Choose fictional scenario. Clarify no real medical history is needed. Urgent help information remains visible before consent.
3. Read short notice. Consent to use fictional answers in this session. Only in REVIEWED_SELECTION for an eligible variant, show a separate optional checkbox naming the external selection provider and retention link. In authored mode show no provider checkbox and disclose AI is unavailable. Continue without AI remains fully functional.
4. Confirm adult scope. An under 18 selection exits assessment to general source information and recommends talking to a qualified professional; do not gather age or a parent's identity.
5. Guided safety question first, followed by purpose, relevant history and optional lifestyle context. Display “Section 2 of 5,” derived from actual fixed sections. Conditional question count appears only once known.
6. Review answers. Edit returns to the originating step, preserving all other valid state. An enabled choice selects a complete authored alternate variant, replaces all case values, announces the replacement and invalidates old results/report/selection state. Other combinations are disabled; no personal answer editing.
7. Results: one prioritized next step, short reason, relevant authored education and limits. “Use simpler words” selects an authored style. Only an eligible reviewed variant offers separately consented AI-assisted fragment selection; the model supplies IDs, never prose. No chat box.
8. Solo report: review the complete authored example summary and the explicit notice that all displayed facts/reasons will be shared. Choose browser Print/Save as PDF or Cancel. No selective omission or PDF library in the baseline. A later omission feature must remove all dependent disclosures under document 09; it is not partially implemented.
9. Finish and clear: return to neutral landing state with confirmation. Do not claim to delete downloaded files or provider logs.

## Alternative and failure journeys

| Trigger | Expected route |
|---|---|
| Decline session consent | Return to general information without assessment |
| Inspect unknown/declined example | Preserve canonical missingness state; no inferred negative answer |
| Unsure about urgent question | Ask a simple clarification; disclose limits and encourage care for concerning symptoms |
| Supported urgent signal | Show urgent information immediately, then allow optional clear; no celebratory completion or AI wait |
| Unsupported combination | Unavailable in the locked UI; altered answer payload rejected by API, no silent repair |
| Refresh / closed tab | Memory state lost; explain before use, offer start again; no hidden persistence |
| Background then return | Hide sensitive content after inactivity, offer Resume or Clear; do not auto delete on a short timer |
| AI fails | Authored result unchanged, optional explanation unavailable message |
| PDF fails | Accessible report preview and browser Print / Save as PDF remain available |

## Cultural, accessibility and language decisions

Use plain body terms where medically necessary and a short definition. Avoid euphemisms that obscure urgent meaning. Do not assume partner gender, marriage, intercourse, fertility intention, beliefs or religion. Ask about attempts to conceive only after the relevant optional purpose choice. A clinician reviewer should check relevance and phrasing before extending the question set.

No shame, masculinity score, family blame or automatic partner sharing. Do not use images suggesting a preferred family type. A discreet page title can say “NurturePath” while the visible page explains purpose honestly. A Hide screen control should mask content and offer clearing; it cannot erase browser history, task switcher snapshots or files.

English only for this deadline. Plan future Malay review with a qualified bilingual clinician and local lay reader; Arabic additionally needs RTL and localization testing. Translation automation is a drafting aid, not clinical signoff. Do not add a language simply to improve a pitch screenshot.

## Discovery method

Recruit five adult volunteers, preferably with varied digital familiarity and language backgrounds, without claiming representativeness. Use fixed fictional cases and a short facilitator script. Ask participants to explain purpose, privacy, reason for guidance and next step in their own words; record task outcomes, observed confusion and timing only with research consent. No names or personal health answers in notes. Seek one clinician and one local cultural/language reviewer; record actual availability rather than claiming access.

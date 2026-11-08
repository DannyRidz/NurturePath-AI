# Conversation rehearsal: reasoning and evidence

## Context

The current app is a functioning fictional learning journey, with twelve cases, written guidance and a complete printable report. V01 can send fixed server-derived facts to Gemini for three discussion questions. The factual summary is fixed because early live qualification showed paraphrasing errors.

The recorded frozen twenty-call evaluation produced the same question set under temperature zero. It supported bounded engineering/content claims for that configuration, not an advantage over written information. The user wants a larger, credible AI contribution and a stronger judge experience.

The current service accepts identifiers, not free writing. A rehearsal text area therefore changes the data risk, even if its purpose is fictional practice. The existing personal intake proposal remains design only. The user is the sole builder, and clinical or privacy review capacity has not been supplied.

Premise note: “wow the judges” is not an acceptance test. The actionable goal is a visible, useful improvement in question preparation that people can understand and reviewers can assess. No architecture can guarantee judge reaction or health benefit.

## Options considered

| Approach | Advantages | Costs and limitations |
|---|---|---|
| Improve the existing three-question prompt | Small change, keeps fixed inputs, easiest operating boundary | Still passive; a fixed question list could work as well; does not exercise a user's own communication |
| Add a curated question worksheet | Useful takeaway, inexpensive and simple to review | A strong baseline, but limited evidence that generative AI adds value |
| Add a bounded two-round rehearsal alongside the current coach | Responds to a practice attempt, exposes a before/after change and gives the user control | Free-text risk, more evaluation/review work, unknown usefulness until compared |
| Build a general medical chat or personal risk assistant | Broad interaction and apparent flexibility | Outside current approvals, larger clinical/privacy obligations and provider intended-use restrictions; not the recommended scope |

Recommend the rehearsal alongside the existing service. Keep the fixed worksheet as a serious comparator and an offline fallback. Do not directly replace a working public endpoint with an unqualified task.

## Rationale

Gemini can work on the wording of a question, notice competing communication goals and suggest a more focused formulation. The interaction then depends on the user's actual practice attempt. That is a plausible reason to use a language model, not proof that it outperforms a worksheet.

The existing written rules remain authoritative for the case. The model is not a clinician and does not decide urgency or a care pathway. Two rounds make the experience observable and bounded; unlimited chat would make evaluation, spending and scope harder to control.

An illustrative rehearsal, not a model result:

* Goal: ask a clearer question about the fictional example.
* Original: “What should I do?”
* Possible communication note: “Your question does not yet say what you want to understand.”
* Possible rewrite: “What does this example tell us, and what information is still missing?”
* User action: keep, edit or reject the rewrite, then select their own priorities.

Do not present this illustrative text as a real Gemini response or as validated clinical content.

## Design choices and their tradeoffs

**One case first.** V01 is already canonical and nonurgent. This makes a complete first slice feasible without pretending the old evaluation covers other cases. V02/V05 or other cases would need their own registry, content review, fixtures and fresh evaluation. Do not quietly enable the rest of the catalog.

**No agent framework.** The job is two bounded structured requests, not tool orchestration. Keep native fetch, Zod and pure state transitions. No retrieval, external browsing or unreviewed source synthesis is needed.

**Memory only for content.** The user controls practice text and print actions. Redis holds only expiring admission metadata. This reduces application retention but cannot erase host/provider processing or exported copies.

**Typed public release is a gate.** Filters can miss real health or identity details. The plan therefore assumes incidental sensitive input is possible and requires an actual operating review. It does not relabel personal information as fictional merely because a checkbox was selected.

**No AI readiness score.** A displayed number could imply a medical or psychological assessment. Human study scores belong in an evaluation record, not in the user's clinical experience.

**Explicit selection for printing.** A suggested question is not automatically useful or approved. The user sees and selects it. A separate sheet preserves the existing all-facts report and its provenance.

**New metering requires new approval.** The old lifetime allowance cannot be reset or rebranded. The proposed additional allowance is a transparent funding decision, with all failed and qualification attempts included.

**Human comparison before benefit claims.** A fixed worksheet is a strong alternative. Counterbalanced tasks, blind rating and actual denominators reduce some bias, but a twelve-person study remains formative. No causal health outcome or broad fairness claim follows from it.

## Current evidence and missing evidence

| Established from the repository | Not established |
|---|---|
| Public fictional journey and Gemini questions work under bounded controls | Rehearsal code or UI exists |
| Real qualification/evaluation and source review are recorded for the current request | The new feedback prompt is qualified |
| Actual hosting, consent lifecycle, shared shutdown and report behavior were verified | Public typed text privacy and intended-use clearance |
| Existing model/transport/stack can be reused as candidates | Feedback correctness, comprehension benefit or judge preference |
| One builder owns engineering | A clinician, privacy reviewer, study participants or pilot partner are available |

The old twenty outputs were identical, so diversity cannot be inferred. A new task/configuration must be evaluated independently. Google returning valid JSON does not prove that a communication judgment or medical implication is correct.

## Provider reference check

Checked 7 November 2026 through official indexed material. Direct page reads returned an unsupported Markdown content type; indexed extracts were used. These references inform the proposal, not account-specific legal clearance. Recheck full current terms and exact intended use before any typed public release.

* [Gemini API terms](https://ai.google.dev/gemini-api/terms?authuser=00): age and available-region restrictions, paid processing conditions and restrictions on clinical practice/medical advice make the intended-use review material. Paid processing is not a promise of zero retention.
* [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing.md): standard text input for the existing model is listed at USD 0.25 per million tokens and output including thinking at USD 1.50. The plan's costs are estimates, not observed rehearsal invoices.
* [Structured output guidance](https://ai.google.dev/gemini-api/docs/structured-output?lang=rest): JSON schema constrains response structure but application checks must address values and semantic errors. Do not transplant examples from a different API into the existing GenerateContent transport.

Project sources: root AGENTS.md; specifications 0004, 0007 and 0008; docs/gemini-live-evaluation.md; docs/production-coach-progress.md; docs/reviews/2026-11-07-judge-product-wording.md; src/lib/coach contracts, admission, prompt and transport; src/components/coach.tsx; src/components/report.tsx.

## Judge presentation

Show one genuine original question, the actual feedback, the user's revision and the explicit final choices. Identify any recorded or simulated segment. Present the same-task comparison and reviewer status with actual sample sizes. If the new release is not qualified, show it as a local development slice and keep the existing public product description truthful.

The official challenge asks for a working solution and supporting assumptions/limitations. A rehearsal can support the conversation-preparation part of that story. It does not by itself deliver personal risk identification, access to assessment, completed referral or health outcomes. Those remain separate pilot questions.

## Design completeness review, 8 November 2026

A fresh same-model read-only reviewer identified two material clarifications. The plan now makes a valid refusal terminal for that rehearsal, with explicit receipt/UI behavior. It also distinguishes sixty frozen end-to-end interaction slots from actual provider attempts and coached outputs, so pre-admission blocks or missing dependent turns cannot inflate or disappear from the denominator.

The author applied these recommended corrections. Operator, country, provider intended-use, qualified-reviewer and additional-budget inputs remain explicit external gates. This review does not approve implementation, personal data processing, spending or clinical use.

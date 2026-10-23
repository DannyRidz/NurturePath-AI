# Independent master plan review

Date: 23 October 2026, Asia/Brunei.
Reviewer: GPT-6 Astra, separate model context, not the author of the plan.
Scope: all 28 planning documents, including MASTER-PLAN, numbered documents 00 through 22, scope and three architecture decision records.
Status: **Independent review completed; user authorized all eight planning revisions, which have now been applied. Implementation remains unauthorized.**

The reviewer read the actual files and returned findings without writing files or fetching external sources. The main author checked the cited passages and recorded the report here. The first review was read only. After the report, the user explicitly authorized all recommended planning revisions; the main author then updated affected planning files and added ADR 0004. Architectural decisions remain Proposed for full spec review. The findings below retain historical revision-1 line references; linked current documents have since changed. This report distinguishes the original findings from their revision-2 dispositions.

## Verdict

The narrow product scope and broad architecture are sound for a fictional demonstration, but the plan is not yet sufficiently complete to hand directly to builders. Several controls are expressed as outcomes without a defined enforcement mechanism. The no-clinician simulation fallback also conflicts with the planned AI journey.

There are two blockers, five high priority gaps and one medium priority resource gap. A blocker applies to the affected feature, not to every independent planning activity. This is an engineering planning review, not clinical or legal approval and not fresh verification of the cited research.

## Findings and recommended resolutions

### IR-01. Blocker: fictional presets are not an enforceable input contract

Evidence: [clinical fallback](../11-clinical-safety.md), line 58 requires fictional preset scenarios when clinical review is unavailable. [Journey specification](../05-user-personas-and-journeys.md), line 19 permits individual answer editing. [API contract](../09-database-and-api-design.md), lines 29 and 34 accepts a scenario ID plus an answers object without requiring equality to a known fixture.

An enum limits possible values, but does not establish that those values describe a fictional person. A valid scenario ID could accompany a person's own structured health answers. Builders would have to decide whether examples are locked, editable templates or a general intake form.

Recommended resolution: define competition mode as a finite catalog of authored scenario variants. UI edits select an allowed variant. The server derives canonical answers from a versioned variant ID and does not trust submitted health answers. Specify review/edit behavior within that catalog. This preserves an interactive demonstration while making the boundary testable.

Decision timing: before implementing the scenario, intake and explanation request contract.

### IR-02. High: no-clinician fallback conflicts with the AI journey

Evidence: [AI workflow](../10-ai-architecture.md), line 23 requires approved cards. [QA content checks](../18-testing-and-qa.md), line 10 allow only approved cards. [Clinical safety](../11-clinical-safety.md), lines 29 and 58 distinguishes qualified approval from an unvalidated simulation. [PRD](../04-product-requirements.md), line 24 nevertheless makes AI explanation essential, and [demo script](../19-hackathon-demo-and-pitch.md), line 21 expects it.

Without a clinician, the documented workflow has no eligible cards for generation. A developer could mistakenly treat engineering approval as clinical approval, or the team could discover late that its mandatory AI segment is unavailable.

Recommended resolution: define explicit release modes. Without the required clinical content approval, use authored simulation only and adapt feature acceptance, evaluation and pitch. Enable actual generation only for content with the specified approval. Track engineering review separately from clinical approval. This may weaken the AI demonstration, and that tradeoff must be visible rather than hidden.

Decision timing: before committing to AI functionality or the recorded demo narrative.

### IR-03. Blocker for free prose: semantic acceptance has no defined mechanism

Evidence: [AC-08](../04-product-requirements.md), line 61 prohibits diagnosis, new urgency, medication advice, thresholds and tests. [AI workflow](../10-ai-architecture.md), line 26 requires rejecting changed context and unsafe reassurance, while line 29 acknowledges that lexical checks cannot reliably determine medical meaning. [T11](../17-task-backlog.md), line 17 budgets eight hours for guards and adversarial fixtures.

JSON validation and citation allowlists cannot determine whether otherwise valid prose contradicts the guidance or supplies unsupported medical advice. Human review of sampled responses cannot establish safety for every future generated response. The current absolute acceptance criterion therefore lacks an executable acceptance rule.

Recommended resolution: make selection of authored explanation fragments the initial public AI contract. Accept only allowed IDs and render text deterministically. Treat unrestricted paraphrasing as a separate later experiment with explicit residual risk and appropriately scoped acceptance criteria. Describe this honestly as assisted content selection, not unrestricted personalized medical generation.

Decision timing: before implementing public AI output or claiming enforceable semantic guarantees.

### IR-04. High: question and rule behavior still leaves decisions to builders

Evidence: [question specification](../07-screen-specifications.md), lines 25 through 32 defines draft choices. [answer model](../09-database-and-api-design.md), line 12 adds a status without defining valid value/status combinations. [clinical rules](../11-clinical-safety.md), lines 18 and 19 leave continuation after unknown safety information and care type/urgency to review. Line 25 allows coexisting rules, while [result model](../09-database-and-api-design.md), line 13 requires one nextStepId.

Required questions, valid missing states, contradictions, clarification steps, same-priority rule combinations and the final single action are not fully specified. Those choices affect behavior and cannot be derived from the precedence list alone.

Recommended resolution: approve one finite engineering decision table before the affected slice. Include normalized states, applicability, contradictions, exact predicates, same-priority resolution, source sections and authored next-step/content IDs. If no clinician has approved it, label the outcomes as simulation expectations. Do not have developers invent clinical thresholds to fill the table.

Decision timing: before implementing questionnaire branching and navigation rules.

### IR-05. High: omitted report answers can leak through derived content

Evidence: [report journey](../05-user-personas-and-journeys.md), line 21 offers control over included answer groups. [report specification](../07-screen-specifications.md), line 61 still requires deterministic reasons, clinician questions and sources. [testosterone/steroid rule](../11-clinical-safety.md), line 21 illustrates an explanation that could reveal an omitted answer.

Removing a fact from the answers section may leave it apparent in the reason, preparation prompt or associated card/source. Matching the preview to the PDF does not detect this privacy failure.

Recommended resolution: omission removes the answer and every report element that explicitly discloses it. Define dependencies from questions to reasons, prompts and cards; replace affected content with a clear notice that omitted information limits the summary. Keep the original navigation result unchanged in the app. Test that omission does not silently downgrade or misrepresent a safety recommendation.

Decision timing: before implementing report inclusion controls.

### IR-06. High: evaluation denominators mix unlike outcomes

Evidence: [evaluation corpus](../13-datasets-and-evaluation.md), lines 18 and 26 through 29 includes valid navigation, rejected inputs, stale versions, injection, outages and races in 80 base cases. Line 40 measures category/reason agreement across all 80, although some cases should produce rejection or state behavior instead. Line 63 recognizes the distinction for AI calls. Matched pairs at line 34 vary labels that are absent from the accepted runtime fields in [data contract](../09-database-and-api-design.md), line 20.

API rejection and race handling could be counted as navigation successes. A fairness test over labels the model never receives could become trivial or introduce an undocumented input path.

Recommended resolution: use a typed test manifest with separate expected outcomes and denominators for valid navigation, rejected requests, state/failure behavior and eligible AI attempts. Restrict matched pairs to supported presentation inputs and state whether they test rule invariance or human rated language behavior. Do not claim clinical or population fairness from these checks.

Decision timing: before writing evaluation fixtures and reporting metrics.

### IR-07. High before public AI: shared limits and spend control lack a chosen mechanism

Evidence: [hosting proposal](../08-software-architecture.md), line 40 proposes Vercel. [API contract](../09-database-and-api-design.md), line 36 requires distributed rate limits, a daily budget, a client key and five generations per assessment revision. Lines 24 through 29 provide no durable session identity and accept client supplied revisions. The actual daily ceiling and shared counter/key implementation are unspecified.

A browser can reset its revision/state. Separate server instances cannot enforce shared counters through process memory. The team may encounter an unplanned service, cost or operational dependency near release.

Recommended resolution: settle a small deployment decision before endpoint work. Name the supported shared limiter/budget mechanism, key derivation and retention, actual daily ceiling and exhaustion behavior. Classify browser/revision limits as convenience controls unless they are enforceable on the server. Leave public generation disabled until the deployed enforcement test passes. A specific service and ceiling remain to be chosen in the revised proposal; this review does not assert that a provider already supplies the required feature.

Decision timing: before enabling a public model endpoint.

### IR-08. Medium: evaluation review work lacks a reconciled staffing budget

Evidence: [AI experiment](../13-datasets-and-evaluation.md), line 61 proposes 60 outputs per candidate, or 180 for three candidates, plus blinded scoring, disagreement handling and held-out replay. [AI observability/evaluation](../10-ai-architecture.md), line 53 requires human assessment of faithfulness, uncertainty, clarity and support. [T17](../17-task-backlog.md), line 23 allocates six hours entirely to B, who also owns implementation and execution.

The 156 hour total and 74/82 allocation are arithmetically correct. The issue is unassigned independent reviewing time, which could turn into author self-review or silently consume reserve.

Recommended resolution: staff and budget preparation, execution, blind review and adjudication explicitly before promising three model comparisons. Make additional candidate comparisons conditional on review capacity. Preserve the depth of safety review before increasing the number of candidate models.

Decision timing: before committing to the evaluation sample size and delivery allocation.

## What the review supports

The plan sensibly excludes predictive fertility scoring and persistent health records. Its authored path can remain useful during AI failure. It distinguishes engineering agreement from clinical evidence, recognizes source rights, documents submission requirements and retains substantial reserve. Those choices make a focused two person demonstration plausible after the identified contracts are settled.

The organizer deadline discrepancy, IP interpretation, finalist logistics, actual clinician availability and future patient-pilot approvals are already visible dependencies. They are not counted again as new findings. Existing research facts, prices, vendor claims and legal interpretations were not independently refreshed in this review.

## Revision 2 disposition, authorized by user

The user selected “Apply all recommended planning revisions” on 23 October 2026. That authorized document changes, not application implementation, clinical approval or resource provisioning. All eight findings have an explicit revised contract:

| Finding | Resolution in the current plan | Verification status |
|---|---|---|
| IR-01 | Twelve locked whole variants, variant-only server request and canonical server facts, no health-answer payload | Independently checked at planning level |
| IR-02 | Default authored/no-provider mode; reviewed fragment selection gated by actual clinical/rights approval; mode-specific UI, tests, task dependencies and video | Mode matrix, applicability counts, gates and dependencies independently checked; final cited demo-row wording corrected by author |
| IR-03 | Exact complete allowed fragment-ID bundles, deterministic registry text; public free prose deferred | Independently checked at planning level |
| IR-04 | Exact enums/applicability/catalog/choice destinations, predicates, same-rank aggregation and next-step IDs in document 11 | Independently checked at planning level; clinical approval/source locator enablement gates remain |
| IR-05 | Transitive report omission covers text, prompts, sources, scenario labels and hidden metadata; app guidance unchanged | Independently checked at planning level |
| IR-06 | Distinct navigation/request/state/AI denominators; 72 applicable authored cases, 80 reviewed, no demographic fairness claim | Core typed split independently checked; authored applicability refined after feedback |
| IR-07 | ADR 0004 names Vercel/Upstash Singapore, atomic counters, key/expiry/bounds and USD 1/day conservative reservations | Independently checked at planning level; actual service/retention/account tests pending |
| IR-08 | One primary candidate, A5/B7 funded review in T17; total 172h A82/B90 with 28h reserve | Independently checked at planning level; actual effort unmeasured |

The reviewer rechecked the revised mechanisms and found seven findings resolved, with only mode propagation remaining partial. A focused followup confirmed corrected test counts, consent, gates and task dependencies, and identified one remaining demo row. The main author corrected that exact row to conditional invalid-fragment/provider failure for reviewed mode and an authored reset/unavailable-AI alternative. All eight recommendations are now addressed in the planning documents. No clinical/legal validation, fresh clinical research audit, or runtime test has occurred. The review does not approve a patient service.

The JS Mastery architect guidance says “Do NOT silently resolve or auto edit a decision completeness gap.” The author therefore obtained the user's explicit selection before revising the plan. Source: `/Users/asmasalleh/.codex/skills/architect/internal/after-subagent.md`. No further implementation permission is inferred from the revision request.

## Revision 3 staffing correction, author note

The user subsequently clarified that they are the sole builder; Jeremiah has no assigned work. The independent review above assessed revision 2, including its historical two-builder allocation. It is not a fresh independent feasibility review of revision 3. The current roadmap/backlog supersede that allocation with an 82h authored core, about 14h reserve before internal submission at the earlier 25h/week assumption. Runtime AI and its experiment are deferred; no independent human scorer is assumed. The transitive omission contract remains mandatory if the separately funded selective-report extension is added; the solo core offers complete preview/print/cancel only. Historical findings and resolution records above are preserved rather than rewritten as new review evidence.

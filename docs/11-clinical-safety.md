# Clinical safety plan

Status: **unvalidated proposed research pathways, fictional cases only. No clinician has approved this plan.** Education and navigation can still influence care and cause harm. Calling an app educational does not remove the need to review its actual behavior and claims.

## Clinical evidence and permitted use

The [WHO 2025 guideline](https://www.who.int/publications/i/item/9789240115774) supports accessible fertility information and appropriate psychosocial support. It does not validate a consumer risk questionnaire. The [AUA/ASRM 2024 amended guideline](https://www.auanet.org/documents/Guidelines/PDF/2024%20Guidelines/Male%20Infertility%20Unabridged%20Final.pdf) concerns clinical infertility evaluation and treatment, with history, physical assessment and context. The [WHO semen manual](https://www.who.int/publications/i/item/9789240030787) standardizes laboratory procedures; it cannot justify interpreting an individual as fertile or infertile. Do not derive a score from any of these sources.

The WHO 12 month definition is not a universal waiting instruction. Concerning symptoms, prior conditions, treatment history, and individual/couple context require professional judgment. No partner age timing algorithm, medication change, semen threshold, genetic testing rule or supplement recommendation belongs in this MVP.

## Proposed navigation categories

These categories organize a demonstration. They are not validated clinical classes, probabilities or a comprehensive triage service.

| Proposed rule | Trigger in fictional input | Output and evidence basis | Review requirement |
|---|---|---|---|
| R-URG-01 | Yes to sudden severe testicular pain | Authored urgent medical help signpost, no fertility discussion first; NHS C6 supports urgency | Clinician approves exact wording and local service path. No numerical emergency contact assumed |
| R-UNC-01 | Unknown/absent critical safety answer | Insufficient information, clarify, preserve broad urgent symptom guidance | Reviewer decides what can safely continue; never interpret unknown as no |
| R-DISC-01 | Current concern or known relevant clinician diagnosed condition/treatment | Prepare to discuss with a qualified professional; no diagnosis or exact appointment deadline invented | Reviewer defines care type and urgency; until then labelled simulated example |
| R-DISC-02 | Difficulty conceiving, including duration information | Explain assessment may involve both partners where relevant, encourage professional discussion, do not diagnose | Approve duration wording and ensure it never delays care for other concerns |
| R-EDU-01 | Optional testosterone/steroid topic selected | Authored education to discuss use with prescriber/clinician; no stop/start/taper advice | Specialist checks accuracy, no assumption that prescribed therapy equals infertility |
| R-EDU-02 | Requests lifestyle education | General sourced education, no individual risk percentages, blame or guaranteed improvement | Review relevance, uncertainty and nonprescriptive wording |
| R-LIMIT-01 | No supported trigger | General information plus “These answers cannot confirm reproductive health or rule out a problem.” | Reviewer verifies absence of false reassurance |

Rules may coexist. Priority: urgent, then critical information uncertainty, then assessment discussion, then education. Preserve other concerns in the report, but no lower category can downgrade urgency. Unsupported emergency scenarios are not safely ruled out by a negative R-URG-01 answer; always provide general urgent help information. A narrowly demonstrated rule is not evidence of broad triage coverage.

## Source to rule approval record

Each rule needs: immutable ID/version, intended population, precise input states, exclusions, proposed action, source edition and section, evidence strength/limitations, local pathway, reviewer identity/qualification, date, status and case expectations. Default status draft. Engineering review, clinical approval and source rights are separate fields. The clinician should sign the complete rule and wording, not only a product disclaimer. Track approvals as real records after received; do not prefill names or dates. The exact simulation contract below resolves engineering behavior without claiming clinical approval.

Neither solo self-review nor agreement between developers approves clinical truth. Engineering checks compare implementation with the written proposal only. A synthetic case label must clearly identify whether its expected outcome is engineer proposed or clinician reviewed.

## Review checklist for a qualified professional

* Is the adult intended audience and fictional demonstration scope appropriate?
* Are each question's necessity, body terminology, unknown/declined handling and cultural framing acceptable?
* Does sudden severe pain wording communicate urgency without implying torsion can be excluded by this tool?
* Are additional safety questions necessary, and can the narrow screening scope be communicated honestly?
* Is guidance for a current lump/change, pain, infection concern, known condition or treatment history safe, with locally appropriate urgency and care type?
* Could duration wording imply waiting when earlier assessment is appropriate? Is partner context handled without compulsory disclosure?
* Are testosterone/steroid and lifestyle explanations accurate and free of medication instructions, shame or unsupported benefits?
* Are routine education outputs free of a healthy/normal verdict?
* Does the report separate patient statements, omitted facts, rule outputs and unreviewed AI prose?
* Are source differences and evidence certainty visible and resolved for the intended local setting?
* Is every expected safety case independently reviewed, including multiple triggers, missingness and contradictory inputs?
* Are pilot intended use, clinical responsibility, incident handling and escalation capacity clearly assigned?

## Hazard controls and escalation

False reassurance and delayed care are highest priority hazards. Minimize them through narrow scope, explicit unknowns, immediate authored urgent wording, no fertility scoring, clinician review and release blocking scenario tests. Overreferral is also harm: anxiety, unnecessary expense and service burden. Do not send every lifestyle answer to a specialist to inflate referral metrics.

No clinician is on call in the demo, no alert is sent, and the app cannot verify that care was obtained. Say this plainly. Use local care categories only after confirmation; do not invent clinics or import UK emergency numbers into Brunei/UAE. General “seek urgent medical help now” wording remains useful while local contact details are pending review.

If a severe failure is found: disable generation or affected pathway, retain only synthetic repro data, notify team lead, seek qualified reviewer input, correct versioned content/rules and replay relevant suites. For a future clinical pilot, establish incident reporting, accountable medical lead, response times and jurisdiction specific reporting before enrollment.

## No clinical review fallback

If no reviewer is available by the proposed content gate, keep fictional preset scenarios and explicit unvalidated labels throughout, including PDF/video/deck. Do not open the app for personal health intake, describe rules as clinically reviewed, or present engineering agreement as clinical accuracy. A research simulation may be submitted if official requirements permit, but its lack of clinical review weakens competitiveness and should be disclosed rather than hidden.

The canonical [release-mode matrix](10-ai-architecture.md) makes this fallback AUTHORED_SIMULATION: no external AI call or generated text. REVIEWED_SELECTION is permitted only for variants with the required clinical/rights records; public AI selects authored fragment IDs rather than writing prose. AI functionality is conditional, not falsely marked complete when absent.

## Finite engineering decision table, revision 2

This section addresses IR-01/IR-04. Values below are exact proposed **simulation expectations**, not clinical advice or newly validated thresholds. Any clinical approval remains a separate gate. Rule/content/catalog versions start at `sim-1`; an approval record must name the exact version. Q00 is removed from case facts: operator adult scope is confirmed after consent, and no/declined exits assessment without collecting case answers.

| Field | Exact valid enums | Applicability and missingness |
|---|---|---|
| Q01 immediate concern | yes/no/unknown | Always first, never declined or absent. yes/unknown terminates example intake, all Q02-Q07 become notReached |
| Q02 purpose | learning/preparing/difficulty/unsure/notReached | Required for Q01=no; notReached only if Q01=yes/unknown |
| Q03 current concern | yes/no/unknown/declined/notReached | Required catalog value for Q01=no, unknown/declined explicit |
| Q04 clinician diagnosed history/treatment | yes/no/unknown/declined/notReached | Same as Q03 |
| Q05 testosterone/steroid topic | yes/no/unknown/declined/notReached | Same as Q03; no medication change instructions |
| Q06 lifestyle information wanted | yes/no/notReached | Required catalog choice for Q01=no; no inference of lifestyle risk |
| Q07 duration | under12/atLeast12/unknown/declined/notApplicable/notReached | Required if Q02=difficulty; notApplicable for other purposes; notReached after Q01 yes/unknown. Duration never changes urgency or the discussion action |

One enum per question, no parallel status/value fields. Absent keys, unknown enum, contradictory applicability (such as Q02=learning with Q07=under12), continued answers after Q01=yes/unknown, or changed catalog values fail internal catalog validation. The public endpoint cannot submit answer maps at all. Do not invent contradictions between otherwise compatible facts, such as lack of current symptoms and a prior condition.

### Authored catalog

All rows are fictional team-authored examples. Table cells Q02-Q07 are in fixed field order. N means notReached; NA means notApplicable. Unknown and declined are literal enum states, not no. These are document specifications, not created fixture/source files.

| Variant | Q01 | Q02 | Q03 | Q04 | Q05 | Q06 | Q07 | Exact expected primary next step |
|---|---|---|---|---|---|---|---|---|
| V01 | no | learning | no | no | no | no | NA | STEP-EDUCATION |
| V02 | no | learning | no | no | no | yes | NA | STEP-EDUCATION |
| V03 | no | learning | no | no | yes | no | NA | STEP-EDUCATION |
| V04 | no | preparing | yes | no | no | no | NA | STEP-DISCUSS |
| V05 | no | preparing | no | yes | no | no | NA | STEP-DISCUSS |
| V06 | no | difficulty | no | no | no | no | atLeast12 | STEP-DISCUSS |
| V07 | unknown | N | N | N | N | N | N | STEP-CLARIFY |
| V08 | yes | N | N | N | N | N | N | STEP-URGENT |
| V09 | no | preparing | yes | yes | no | no | NA | STEP-DISCUSS |
| V10 | no | unsure | unknown | declined | unknown | no | NA | STEP-EDUCATION |
| V11 | no | difficulty | no | no | no | no | under12 | STEP-DISCUSS |
| V12 | no | difficulty | no | no | no | no | unknown | STEP-DISCUSS |

Question-choice destinations are fixed: Q01 yes→V08, unknown→V07, no→V01; Q02 learning→V01, preparing→V04, difficulty→V06, unsure→V10; Q03 yes→V04, no→V01, unknown→V10; Q04 yes→V05, no→V01, declined→V10; Q05 yes→V03, no→V01, unknown→V10; Q06 yes→V02, no→V01; Q07 under12→V11, atLeast12→V06, unknown→V12. Choices not listed are disabled in this demonstration. Each change replaces the entire case and announces that fact. V09 is selected explicitly from the catalog to demonstrate coexisting reasons. No implied preservation of other answers. Back/review navigation preserves the current complete variant unless a supported switch is chosen.

### Predicates, ordering and authored text

Evaluate R-URG-01 if Q01=yes: status urgent, reason URG-PAIN, next step STEP-URGENT, content CARD-URGENT. Evaluate R-UNC-01 if Q01=unknown: insufficientInformation, reason UNC-SAFETY, STEP-CLARIFY, CARD-LIMITS. Both stop all lower evaluation and leave remaining questions notReached. STEP-CLARIFY says “This example does not contain enough information. Choose another fictional variation if you want to explore a different answer. This demonstration cannot assess a real symptom.” It does not ask the user to supply personal symptoms.

When Q01=no, R-DISC-01 emits DISC-CURRENT for Q03=yes and DISC-HISTORY for Q04=yes, in that order; R-DISC-02 emits DISC-DIFFICULTY for Q02=difficulty regardless of Q07 duration. If any discussion reason exists, primary status assessmentDiscussion and STEP-DISCUSS. R-EDU-01 adds EDU-MEDICATION for Q05=yes; R-EDU-02 adds EDU-LIFESTYLE for Q06=yes. If no discussion reason exists, status education and STEP-EDUCATION. R-LIMIT-01 adds LIMIT-NO-SUPPORTED-TRIGGER only when no discussion or education reason exists. Every result includes CARD-LIMITS and unknownIds for literal unknown/declined applicable fields. Unknown optional history is never converted to no or a healthy verdict.

Order reasons: URG-PAIN, UNC-SAFETY, DISC-CURRENT, DISC-HISTORY, DISC-DIFFICULTY, EDU-MEDICATION, EDU-LIFESTYLE, LIMIT-NO-SUPPORTED-TRIGGER. Same-priority discussion reasons aggregate, never overwrite each other; nextStepId stays STEP-DISCUSS. In V09 both current/history reasons appear. No lifestyle score or diagnostic inference is calculated.

| Next-step ID | Exact authored simulation wording |
|---|---|
| STEP-URGENT | “Seek urgent medical help now. Sudden severe testicular pain needs urgent assessment. This demonstration cannot contact emergency services or assess your condition.” |
| STEP-DISCUSS | “In this fictional example, prepare to discuss the concern with a qualified health professional. This unvalidated demonstration cannot decide the right care service or appointment timing for a real person.” |
| STEP-EDUCATION | “Read the relevant information and consider what you would like to ask a qualified health professional. These example answers cannot confirm reproductive health or rule out a problem.” |
| STEP-CLARIFY | Exact wording above; broad urgent-help information always remains available |

| Card / reason relationship | Authored content boundary and source locator | Required approval before reviewed mode |
|---|---|---|
| CARD-URGENT / URG-PAIN | C6, NHS testicle lumps/swellings page, urgent action section concerning sudden severe pain; linked in registry | Clinician approves wording and locality. No UK telephone number imported |
| CARD-LIMITS / all cases | Product intended-use/uncertainty statement from PRD and this table, not a guideline recommendation | Clinician reviews absence of reassurance and contextual use |
| CARD-DISCUSSION / DISC-CURRENT, DISC-HISTORY, DISC-DIFFICULTY | C3 AUA/ASRM guideline, Initial Evaluation sections on reproductive history and evaluation; use no diagnostic/timing thresholds. Separate reason/prompt per dependent field | Exact section/page locator verified in signoff record before enabling; no assumed approval from a broad link |
| CARD-MEDICATION / EDU-MEDICATION | C5 WHO infertility fact sheet, “What causes infertility?”, male reproductive system/lifestyle discussion; source supports education, not stopping treatment | Review distinction between prescribed use and other use; no medication instruction |
| CARD-LIFESTYLE / EDU-LIFESTYLE | C5 WHO fact sheet, “What causes infertility?”, lifestyle paragraph; C1 guideline evidence/strength recorded during card review | No promised fertility improvement, blame or individual probability |

All source locators in final approved records must be exact edition/heading/page or stable section URL. CARD-DISCUSSION is explicitly ineligible for reviewed selection until its exact page/section locator is checked and approval recorded; builder uses the authored simulation wording above rather than inferring clinical urgency from C3. This is a finite release prerequisite with a named owner, not permission to invent clinical logic. Actual fragment texts/bundles are authored and reviewed in T07; absence leaves the variant in AUTHORED_SIMULATION.

For each eligible nonurgent variant/style, T07 defines two complete one-to-three-fragment bundles from the applicable cards, preserving the limitations statement and every represented factor. Only exact bundle membership can pass AI selection. Fragment dependencies inherit question/reason dependencies from the [report contract](09-database-and-api-design.md). No selector can introduce a new card, source or action.

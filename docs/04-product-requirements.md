# Product requirements

Status: Proposed. Primary job: help an adult understand why a concern may deserve discussion and prepare for appropriate care. Competition mode is a simulation with fictional structured cases. Hypothesis: a clear preparation pathway improves next step comprehension versus an equivalent static information sheet. Health outcome improvement remains unproven.

## Intended use and non goals

Initial audience: English reading adults exploring male reproductive health, regardless of marriage, sexual activity or intention to have children. The demonstration uses twelve locked authored variants, not personal histories. The API accepts variant ID/version only and derives canonical answers server side. Adult scope is checked after session consent; no/declined exits to sources. This is a scope choice, not a conclusion about legal consent age.

No fertility probability, infertility diagnosis, treatment, prescribing, semen/genetic result interpretation, clinician impersonation, automated appointment, real referral completion tracking, or “all clear” output. No persistent accounts or employer access. The product cannot dispatch emergency help or monitor users.

## Solo deadline baseline, revision 3

The user alone builds the app. The earlier two-developer scope/resource allocation is superseded. Commit to 82h of authored simulation: twelve locked examples, one plain explanation style, inline evidence, complete HTML report with browser Print/Save as PDF or Cancel, and consent/clear/safety/accessibility/tests. No public provider service or selective report omission is promised. The feature table remains a broader evaluation inventory; current backlog defines actual funded work.

## Feature evaluation

Hours below are rough incremental estimates, often overlapping shared tasks. They must not be summed as an independent delivery budget; document 17 is the single resource budget. Difficulty L/M/H; clinical risk is potential harm if wrongly implemented, not approved status. M means required MVP, C conditional enhancement, D defer.

| ID / feature | Problem and value; challenge connection | Dependencies | Difficulty / risk / effort | Priority and acceptance |
|---|---|---|---|---|
| F01 Landing | Unclear purpose blocks starting; private access | Approved wording | L / M / 3h | M: purpose, limits and start visible at 320px |
| F02 Privacy/limitations | Users need meaningful expectations; trust | Data map | M / H / 3h | M: no promise of anonymity or zero provider retention |
| F03 Explicit consent | Control collection and optional AI sharing | F02, versioned notice | M / H / 4h | M: separate unchecked choices, decline works |
| F04 Guided fictional intake | Demonstrate a clearer private preparation path | Canonical finite catalog/table, actual clinical status | M / H / 10h | M: Back/review and supported whole-variant switches, no personal answer editing |
| F05 Structured validation | Prevent altered cases and missingness misuse | Exact enums and variant-only API | M / H / 4h | M: reject submitted answer maps/unsupported variants; unknown never equals no |
| F06 Versioned rules | Explain consistent navigation | Approved rule pack or simulation label | H / H / 10h | M: exact rule/reason/source trace and precedence |
| F07 Urgent handling | Delay could harm; safe escalation | Authored safety copy | H / H / 6h | M: immediate guidance without AI or network |
| F08 Deferred AI fragment selection | Test useful authored wording selection, not medical judgment | Actual clinical/rights approval of enabled variant bundles, consent/access and shared limiter | M / H / 10h | D for solo deadline: separately fund 24h builder work and real reviewer/clinical gates before REVIEWED_SELECTION; never claim delivery in authored mode |
| F09 Summary | User needs one next step | F06/F07 | M / H / 6h | M: reasons, uncertainty, next step, source |
| F10 Complete printable report | Controlled preparation/handoff | F09, semantic preview/print | M / H / 3h | M: share-all-facts notice, complete preview, Print/Save as PDF or Cancel. Selective omission deferred; requires full dependency-redaction design if later added |
| F11 Session management | Preserve consented progress without persistent records | Memory state | M / H / 4h | M: route changes keep state, refresh warns/reset |
| F12 Delete session | Shared device exposure; control | F11 and in flight request cancellation | M / H / 4h | M: answers/results cleared and late responses ignored |
| F13 Responsive UI | Phone first access | Design tokens | M / M / 6h | M: phone, tablet, desktop, zoom without loss |
| F14 Failure recovery | Provider outage must not block care information | Authored output | M / H / 4h | M: bounded wait, explicit fallback, retry preserves state |
| F15 Automated checks | Prevent regression; demonstrable value | Contracts, fixtures | H / H / 12h | M: safety, privacy, API and end to end gates |
| F16 Clinician view | Concise preparation for consultation | Report | L / M / 2h | C: same report layout, no separate login portal |
| F17 Evidence viewer | Check explanation provenance; trust | Source registry/cards | M / H / 3h | M: exact card source and date, no invented citations |
| F18 Feedback survey | Identify confusion | Explicit research consent | L / M / 2h | C: moderated anonymous usability worksheet first, no health text |
| F19 Saved assessments | Resume across devices | Auth, DB, retention policy | H / H / 18h+ | D: not needed for synthetic single session |
| F20 Multilingual | Improve reach | Qualified clinical translator, RTL QA | H / H / 20h+ per language | D: English first; Malay next only after reviewed translation, Arabic adds RTL |
| F21 Accessibility extras | Broaden use beyond AA basics | Tested core | M / M / 6h+ | C: extra preferences later; keyboard/readers/zoom are MVP |
| F22 Reviewed education | Avoid misleading content | Clinician, rights | H / H / 6h plus availability | M: recorded approval or explicit simulated/unvalidated label |
| F23 FHIR export | Future integration | Profile agreement, terminology and validation | H / H / 12h+ | D: JSON structure is not a FHIR compatibility claim |
| F24 Evaluation dashboard | Judges need evidence | Actual evaluation artifact | M / M / 6h | D: static evidence sheet/CI artifact solves same problem |
| F25 Explainability | Understand why guidance appears | F06 and sources | M / H / 3h | M: concern to reason to next step, no model reasoning transcript |
| F26 Appointment integration | Reduce booking friction | Contracted clinic and availability API | H / H / 24h+ | D: no fake booking or referral completion claim |
| F27 Teleconsultation | Reach professional | Licensed provider, operations | H / H / 40h+ | D: no clinician on call promised |
| F28 Provider/EHR integration | Reduce reentry | Partner, auth, standards | H / H / 40h+ | D: patient downloads report instead |
| F29 Home testing | Access diagnostics | Validated device/lab partner | H / H / partner dependent | D: no test kit or interpretation feature |
| F30 Longitudinal monitoring | Track changes | Valid measurement, longitudinal study | H / H / 30h+ | D: history not necessary for first proof |
| F31 Predictive model | Potential personalized prediction | Representative prospective validation | H / H / months | D: UCI insufficient, no risk score |
| F32 Wearables | Potential context | Meaningful signal/validation | H / H / 30h+ | D: no demonstrated MVP need |
| F33 Enterprise admin | Manage customers | Real tenancy and roles | H / H / 24h+ | D: no patient admin console |
| F34 Billing/subscription | Collect revenue | Buyer evidence, procurement | M / M / 16h+ | D: competition needs no payment flow |

## Acceptance criteria, canonical contract

* **AC-01 Purpose:** a first time user sees purpose, simulation status, limits, data handling link and start control without needing a tutorial. No unmeasured completion time is promised.
* **AC-02 Consent:** session consent precedes adult-scope collection; AI consent appears only for eligible REVIEWED_SELECTION variants and is separate/optional. Authored mode makes no provider call or checkbox promise. Provider changes need new disclosure/consent.
* **AC-03 Questions:** accessible question groups, fixed section progress, Back/review and whole-variant switching follow the exact catalog table. Edits replace/announce the whole authored example; unsupported combinations are unavailable. Unknown/declined remain case facts, not negative answers.
* **AC-04 Integrity:** server accepts only the finite variant ID and matching versions, never health answer payloads. Canonical enum/applicability validation catches catalog contradictions. Q01 unknown selects the specified insufficient-information example without asking personal symptoms; absent/stale/invalid requests reject.
* **AC-05 Rules:** same normalized input and rule version produce the same navigation object; all triggered rule IDs and approved evidence IDs are traceable. No weighted fertility score is displayed.
* **AC-06 Urgency:** a supported urgent scenario interrupts immediately using static wording; AI, report generation and questionnaire completion never delay its guidance. Negative answers do not rule out all emergencies.
* **AC-07 Results:** the screen states what was flagged, what is unknown, why it matters and an actionable next step. It never declares a user fertile, infertile or healthy.
* **AC-08 AI, mode-specific:** AUTHORED_SIMULATION never invokes the provider and records AI as not delivered. REVIEWED_SELECTION requires actual clinical/rights records, accepts only exact complete allowed fragment-ID bundles, renders authored text/sources and rejects all provider prose or mixed/unknown IDs. Neither mode can change the deterministic next step. Free prose is deferred; invalid/refused/timed out selection falls back.
* **AC-09 Evidence:** each education card links its registered source and version/date; guidelines are distinguished from local approved clinical pathways.
* **AC-10 Report, solo core:** full semantic HTML preview states that every displayed example fact/reason will be included. User chooses Print/Save as PDF or Cancel, no per-field omission controls. Print agrees with preview, includes actual review status/limits and no hidden personal values. If X-REPORT is later funded, the complete transitive omission contract in document 09 becomes mandatory; do not offer partial omission before it works.
* **AC-11 Clear:** Finish and clear removes session answers, results and generated text, cancels active calls and prevents late responses repopulating state. The notice explains downloads and third party logs cannot be recalled by this action.
* **AC-12 Access:** keyboard, screen reader, focus, contrast, reduced motion, touch and 200% text/400% zoom checks pass the critical journey; no color only severity. WCAG conformance is not claimed solely from automation.
* **AC-13 Resilience:** authored results and urgent guidance are usable when AI is disabled, returns 429, fails validation or times out. Network failure never changes navigation recommendation.
* **AC-14 Privacy:** no health input in URLs, persistent browser storage, analytics, logs, error traces, PDF metadata or cross session caches. Provider payload is allowlisted and auditable using synthetic traces.
* **AC-15 Evidence honesty:** reported results name suite version, run date, model, denominators, failures and limitations. No target appears as an achieved metric.

## Scope control and success

Keep F01 to F07, F09 to F15 plus F17, F22 and F25. F08 is deferred outside the solo deadline scope; adding it requires funded capacity and REVIEWED_SELECTION gates; its absence must be disclosed, not marked complete. Fold F16 into the report; F18 only if core gates pass. All other enhancements need a scope change/displaced work. A static evidence appendix replaces a dashboard. See the canonical release-mode matrix in document 10. The authored fallback delivers the narrower demonstration and lacks runtime AI, a material competitive limitation.

Primary proposed UX target: at least 4 of 5 adult usability participants can identify the next step and say the app cannot diagnose them, without facilitator help. Small convenience sample results are formative, not proof of population benefit. Safety gates and denominators are defined in documents 13 and 18. No results have been collected.

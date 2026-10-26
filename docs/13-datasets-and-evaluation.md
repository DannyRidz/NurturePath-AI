# Datasets and evaluation plan

**The evaluation numbers below remain proposed targets or sample sizes.** Application tests are recorded separately in the [release checklist](release-verification.md); they do not establish execution of this planned evaluation corpus. Synthetic correctness is not clinical validation, and simulated navigation is not completed real care.

## Dataset assessment

| Resource | Verified provenance and license | Representation, missingness and relevance | Decision |
|---|---|---|---|
| [UCI Fertility](https://archive.ics.uci.edu/dataset/244/fertility) | Donated 2013; 100 instances, nine features; CC BY 4.0; [2012 original study](https://www.sciencedirect.com/science/article/pii/S0957417412007269) | Young healthy University of Alicante volunteers, ages 18 to 36; released table lists no missing values. Semen concentration labels are not fertility outcomes. Tiny, narrow cohort and selection bias | Do not train, validate or demo individual predictions from it. Discuss limitations in pitch if asked |
| [Synthea](https://github.com/synthetichealth/synthea) | Apache 2.0 generator, fictional histories and healthcare exports | Useful general synthetic infrastructure, not a validated male fertility cohort or pathway reference | Optional future interoperability fixture source, unnecessary to install for MVP |
| Team authored fictional scenarios | Original structured case definitions with no real patient derivation | Deliberately cover hazards and missingness; not an epidemiological sample | Primary evaluation suite, each expected output has an explicit engineering or clinical review status; solo authored expectations are same-author unless another reviewer actually participates |
| Clinical guideline summaries | Sources C1-C6 with version and rights record | Evidence for content, not labelled training data or navigation ground truth | Curated cards only; clinical expectations need reviewer approval |

Do not infer class balance, ethnicity, generalizability or biological validity from the UCI table's absence of missing entries. Do not infer that synthetic cases anonymize a real case unless provenance proves no patient data was used. No organizer dataset is promised.

## Typed corpus, solo revision 3

Every test has caseId, suiteVersion, kind navigation/request/state/ai, input reference, typedExpectedOutcome and review status. Corpus retains 80 system cases, but only valid navigation cases enter rule agreement. No single “80/80 clinical accuracy” metric is allowed.

| Kind | Cases | Exact expected outcome |
|---|---:|---|
| navigation | 32 | Canonical variant, ordered reason IDs, status and nextStepId match decision table. 16 urgent-path executions use V08 with different entry/previous-view conditions; they are not 16 distinct clinical patients |
| request | 24 | Exact rejection/status/no-provider-call: unknown variant, altered answers, extra/injected fields, stale versions, malformed/oversized payload, consent/provider/origin mismatch, unsupported AI variant/style |
| state | 24 | 16 core cases: clear, whole-variant change, refresh, complete-report preview/print/cancel, privacy and mode-gate/no-provider behavior. Eight conditional cases: real selection response races, provider failure, shared admission concurrency/expiry/ingress/token bounds; run only for REVIEWED_SELECTION |
| total planned system | 80 | AUTHORED_SIMULATION executes 72 (32+24+16) and marks eight conditional cases not applicable. REVIEWED_SELECTION executes all 80. Never clinical-classification denominator |

Freeze 40 development cases and 40 held-out engineering cases: 16 navigation (eight urgent), 12 request and 12 state in each, with four conditional state cases per partition. Authored mode therefore executes 36 per partition and marks four not applicable; reviewed mode executes 40. Both partitions draw from the same finite fictional catalog. Holdout measures implementation robustness against untuned event/request sequences, not performance on new patients or clinical generalization. Corrections to expected outcomes require a written reason/version, never tuning them to a failing result. Clinical approval status remains separate from engineering expectation agreement.

No demographic attributes enter the runtime contract. Remove the earlier demographic matched-pair fairness claim. The solo core implements one plain style, so presentation-pair comparison is not applicable. If a second style is separately funded, use 12 presentation pairs (24 executions) over supported variants with standard versus plain style. Measure category/nextStep invariance and human-rated readability/retained caveats. This is presentation consistency, not demographic or population fairness. UI accessibility testing covers relevant reading/interaction barriers; wider population/language fairness awaits an approved future protocol.

## Metrics and denominators

| Metric | Denominator and method | Proposed gate |
|---|---|---|
| Valid navigation agreement | 32 navigation cases only; report dev/held-out and clinical approval status | 32/32 expected engineering outcomes |
| Urgent path behavior | 16 urgent executions, unique clinical variant count=1 disclosed | 16/16 immediate authored guidance, zero provider calls; no real sensitivity claim |
| Request rejection | 24 invalid/out-of-scope requests | 24/24 specified status/no provider execution |
| State/failure behavior | Authored: 16 core cases; reviewed: all 24 | 16/16 core plus, only if enabled, 8/8 conditional. Unexecuted cases explicitly not applicable, never counted passed |
| Presentation consistency, deferred | Only if a second style is funded: 12 pairs | Not applicable to one-style solo core; never report unrun pairs as passed |
| AI allowed-bundle acceptance | Valid complete allowed bundle / all attempted provider responses, not system cases | Target 99%; all invalid/refused/incomplete/timeouts safely fall back |
| Render fidelity | Rendered text and source IDs exactly match selected authored bundle / eligible render cases | 100%; arbitrary provider prose never displayed |
| AI coverage | Clinically/rights eligible enabled variants / 12 catalog variants, actual mode stated | No invented approval or claim that disabled mode delivers AI |
| Provider attempts and fallback | Report admitted attempts, invalid/refusal/timeout counts and successful selection count separately | Every denominator includes failures; bypasses are not AI successes |
| Content support/limits | Distinct authored fragments/bundles reviewed and approved / every reachable fragment/bundle | Qualified approval required for REVIEWED_SELECTION; engineering review alone insufficient |
| Completion/comprehension | Adults who independently complete and explain next step/limits/privacy / consenting participants | At least 4/5, formative convenience sample only |
| Accessibility | Automated serious/critical issues plus manual critical-path failures | None unresolved; no conformance claim from automation alone |
| Latency | Local timings, successful provider p50/p95 and timeout rate separately, n stated | Local target 100ms; provider deadline eight seconds. Never exclude timeouts to imply all requests met latency target |
| Cost/admission | Actual billed tokens and charges / all provider attempts; reserved admissions/cap also reported | Respect request bounds/shared cap; actual invoice not equated with reservation |
| Privacy | Canary in URL/storage/logs/full-report disclosure / enumerated baseline tests; counter/redaction checks conditional on extensions | Zero exposures |

Zero failures in these narrow fictional tests is not clinical validation. Do not call 16 repeats of one urgent signal comprehensive emergency coverage. Citation validity checks exact registry IDs; support for authored claims is a different review. AUTHORED_SIMULATION reports AI metrics as “not run, disabled pending approval,” never 100% because no calls occurred.

## Solo ownership and deferred model experiment

The builder authors the fixture expectations, implements the app, runs the 72 applicable system cases and reviews its output within T17's four hours. Record that as **same-author engineering verification**, never independent human review or blind adjudication. Existing expected outcomes come from the written decision table; clinical truth remains unvalidated. Automated regression checks and a later Codex review can help find mistakes but do not constitute independent human/clinical validation. No Jeremiah availability is assumed.

The core evidence sheet reports separate 32 navigation, 24 contract/request rejection and 16 state cases, unique variant count and actual review status. If request tests exercise only a pure validator or disabled local handler, label them that way; do not imply a live provider endpoint was penetration tested. All model, limiter, second-style and partial-redaction checks stay explicitly not applicable until their features are funded. Complete-report checks instead prove that all previewed facts are disclosed before print, cancel works, and no partial-share control exists.

The model experiment is outside the committed deadline scope. A later reviewed-selection package needs at least 24 additional builder hours overall (including four execution/evidence hours) plus four external independent scoring hours if an independent score is claimed. That reviewer must be identified and agree; Jeremiah is not assigned. Actual clinician/rights approval is a separate prerequisite, not supplied by either reviewer.

If the package is funded, use one primary candidate versus authored baseline, up to 20 approved nonurgent variant/style contexts and three attempts each. Report actual unique variants and actual n, not invented cases to reach a target. Builder freezes manifest, executes and collects usage/bundle checks; external scorer independently rates rendered outputs and limitations; builder records disagreements and returns medical questions to the qualified clinician. No second/third candidate comparison is budgeted. If no independent scorer is available, describe any experiment as developer self-evaluation and do not claim the independent-review gate was met.

## Usability and reporting

Five consenting adults use only locked fictional examples. Test the one-style authored solo flow by default and report runtime AI absence. Compare AI selection only after the additional package and reviewer requirements are satisfied. Counterbalance where possible. Record assists, misconceptions, abandonment/device/time without names or personal health history. This small study does not establish clinical effectiveness or statistically significant superiority.

Evidence sheet includes commit/catalog/rule/card/bundle/model versions, release mode, actual approval status, fixture provenance, per-kind n/N, unique variant count, failures/bypasses, latency/timeouts, token usage/reservations/actual costs and limitations. Until real runs exist, show “Evaluation planned, no results yet.” No fabricated scores, signoff, surveys or endorsements.

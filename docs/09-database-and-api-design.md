# Data model and API contract, revision 2

Planning revisions address IR-01, IR-04, IR-05 and IR-07. This is a specification, not source or a migration. Application implementation remains unauthorized. The [clinical decision table](11-clinical-safety.md) owns the finite fictional catalog and navigation behavior; [ADR 0004](specs/0004-public-ai-spend-controls.md) owns shared rate and spend enforcement.

## Runtime entities

| Object | Fields and authoritative source | Lifetime and constraints |
|---|---|---|
| ScenarioVariant | variantId, catalogVersion, label, canonicalAnswers, expectedResult, provenance=teamAuthoredFiction | Versioned catalog; no arbitrary browser answers accepted |
| SessionConsent | noticeVersion, accepted=true, adultScope=true, aiAccepted boolean, disclosedProvider or null, acceptedAt ISO UTC | Browser memory; operator adult scope asked after consent, separate from case. No birth date or identity proof |
| AssessmentView | variantId, catalogVersion, viewRevision integer 1..2147483647, selectedSection | Browser memory. Answers copied from catalog; revision invalidates late calls, not an authorization credential |
| Answer | Exactly one question-specific enum, including unknown/declined/notApplicable/notReached only where allowed | No redundant value/status pair; all Q01-Q07 keys present; applicability table owns validity |
| NavigationResult | viewRevision, ruleVersion, status urgent/assessmentDiscussion/education/insufficientInformation, ordered reasonIds[], contentIds[], unknownIds[], nextStepId | Pure derivation from canonical variant; expectedResult must match before release |
| EvidenceCard | id, originalText, sourceIds[], sourceSectionLocator, contentVersion, engineeringReview, clinicalApproval, rightsStatus | Independent engineering, clinical and rights states. Clinical reviewer identity/role/date actual or null |
| ExplanationFragment | fragmentId, contentVersion, text, supportedReasonIds[], dependencies[], sourceIds[], clinicalApproval, rightsStatus | Whole authored prose unit; no model interpolation |
| Rule | id, version, exact predicate, rank, nextStepId, contentIds[], dependencies[], approvalStatus | Clinical table owns values; unreviewed means simulation only |
| EducationSelection | viewRevision, variantId, contentVersion, styleId, fragmentIds[], modelId or null, delivery authored/aiSelected/fallback | IDs must match a complete allowed bundle; words always from registry |
| ReportSelection | includedQuestionIds[], reportVersion, generatedAt UTC | Local derivation removes all transitive dependent content |
| EvaluationCase | caseId, suiteVersion, type navigation/request/state/ai, inputReference, typedExpectedOutcome, clinicalReviewStatus | Distinct outcome types and denominators |

IDs are case sensitive allowlists, 1 to 64 ASCII characters. Dates ISO UTC; project evidence rendered in Asia/Brunei. No identifiers, birth dates, uploads, arbitrary prose, health answers or demographic labels are accepted by the public explanation endpoint. Interest in an example can still reveal sensitive concerns; never claim that visits reveal nothing personal.

## Locked catalog and edit behavior

A variant loads its entire authored answer set. An enabled question choice maps to a complete alternate variant from the catalog. Selecting it replaces the whole case, increments viewRevision, clears old education/report choices and shows the new example title. No combining answers across variants. Unavailable choices say “This variation is not included in this demonstration.” Review/Edit returns to the section to inspect or choose a supported example, not enter personal history.

Server loads its own canonical variant by ID/version. Submitted answers, questionId, health values or other unknown fields are rejected. Unknown variant returns 422; stale catalog/rule/content version returns 409 and asks restart with current catalog, without posting old answers. Client route guards improve flow, not security.

## HTTP contracts

JSON only, maximum body 2KB, same origin, no cross origin CORS or cookies/browser credentials, Cache-Control: no-store. No stored patient resource exists, but validation and shared cost controls remain mandatory.

| Endpoint | Exact inputs | Output |
|---|---|---|
| GET /api/config | None | mode AUTHORED_SIMULATION/REVIEWED_SELECTION, demoOnly=true, versions, supported variant/style IDs, provider disclosure or null, per-variant AI availability; no secrets |
| POST /api/explanation | variantId, catalogVersion, ruleVersion, contentVersion, viewRevision integer 1..2147483647, styleId standard/plain, aiConsent=true, noticeVersion, disclosedProvider matching config | 200: same identifiers/revision, validated fragmentIds, trusted modelId and delivery=aiSelected/fallback. Sources resolved from registry, never provider URLs |
| GET /api/health | None | Basic availability, no account/environment details |

Errors: 400 malformed/extra fields/types; 403 origin/consent/provider mismatch; 409 stale versions; 413 body too large; 422 unknown variant/style or urgent/insufficient variant sent to AI; 429 shared rate/daily allowance exhausted; 503 mode/key/limiter/provider unavailable. Client retains authored content. After a failed provider attempt, 200 with fallback IDs is permitted; invalid model bytes are never returned.

Server order: check origin/type/size/schema; load config and validate supplied notice/provider/versions; load canonical variant; recompute rules; reject urgent/insufficient variants; only then require REVIEWED_SELECTION, else 503 with no external access. Verify clinical/rights approvals for every reachable bundle; apply shared admission; attempt provider once; validate exact selection bundle; return trusted IDs or authored fallback with original revision. Client approval flags cannot substitute for records.

No server assessment/report/deletion endpoint. Clear resets browser memory and increments session generation counter plus viewRevision (new session before revision overflow) to discard late responses. Aborting cannot promise to stop provider billing or erase delivered requests.

## Shared enforcement versus convenience controls

Only after separately funding/enabling X-AI, public AI uses Vercel Node functions in Singapore and one Upstash Redis primary in Singapore, with no read replicas for admission decisions. Redis stores only expiring keyed counters/global reservations, never variant IDs, answers, reports or model text. This is infrastructure metadata persistence, not a health-record database.

Server limits: 10 admitted AI requests per trusted client IP per fixed UTC minute; 100 provider attempt reservations per production project per UTC day. Budget USD 0.01 conservatively per reservation, USD 1/day application reservation ceiling, no refund after failures. One atomic script admits and increments both counters. Limiter read/write uncertainty fails closed. Exact keys, expiry, bounds and deployed proof are in [ADR 0004](specs/0004-public-ai-spend-controls.md).

Browser only: one in flight call and five attempts per viewRevision. These can reset and are convenience controls, not spend protection. IP rotation can evade the per-IP limit; global reservations remain the final application admission cap. Hosting/Redis traffic charges and provider billing anomalies are not covered by a claim of guaranteed USD 1 total cost.

## Solo report scope and deferred omission contract

The solo core offers a complete semantic HTML preview and Print/Save as PDF or Cancel. There are no per-question/group inclusion controls and no partial redaction. Say before printing: “This report includes every displayed example answer and reason. Review the full preview before saving or sharing.” Cancelling creates no file; clearing does not recall previous copies. No PDF-generation library or model text is included. The contract below remains mandatory **only if selective omission is later added as separately funded X-REPORT**. It must not be partly implemented.

## Deferred report omission and dependency closure

Start with the full canonical result. Never recompute a lower category from partially shared facts. Every report element declares dependencies. Omitting any dependency removes that element and all linked text/IDs: reasons, education, prompts, source titles/links and question-specific metadata. No hidden source/variant IDs in PDF metadata or HTML data attributes.

Mandatory notice: “Some information was omitted. This report may not show every reason or recommended action. Review the full example in the app before relying on this summary.” Replace an identifying scenario title with “Fictional example”; exclude variantId and AI metadata. If omission hides evidence for the next step, replace that report action with the limited-summary notice, never a lower-priority recommendation. App navigation remains unchanged. Generic urgent-help information remains in every report independent of case facts.

Dependency map: R-URG-01, urgent next step and symptom prompt depend on Q01; R-UNC-01 on Q01. R-DISC-01 emits distinct reasons/prompts for Q03 and Q04, each dependent on that question. R-DISC-02 depends on Q02/Q07. Discussion next-step text depends on all triggering discussion questions in that variant. R-EDU-01 on Q05; R-EDU-02 on Q06; R-LIMIT-01/absence-of-concern wording on all applicable answers. Cards inherit dependencies transitively. Keep a source only if attached to a retained element; otherwise remove. Generic limits, fictional label, review status and rule/content versions remain.

Test: omit Q05 from the steroid-topic example. Remove its answer, reason, medication prompt, education, identifying source title and scenario label in preview/PDF/print/metadata. The application still shows its full original guidance. Omission cannot erase an existing download.

## Value sourcing

Progress: fixed sections. Answers: canonical variant. Next step: exact clinical table. Explanation words: authored fragment registry. Allowed bundles: variant/reason/style mapping. Review status: actual records. Timestamps: clocks. Rate key: trusted ingress metadata. Budget day: server UTC. Report: canonical objects after dependency removal. No output is sourced from arbitrary medical model prose or user health facts.

## Future PostgreSQL, outside competition scope

Saved histories require a new approved intended-use/data design covering users, organizations, consent, records, sharing, audit, auth, ownership, tenancy and retention. Prisma/Drizzle/parameterized SQL remain future alternatives. Admission counters do not authorize clinical record storage. No FHIR claim follows from these object names.

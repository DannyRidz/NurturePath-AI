# Scope: NurturePath AI

Status: Proposed, solo revision 3. The user owns all building; Jeremiah has no assigned engineering/review hours. Core 82h, about 100h gross capacity, with lower usable reserve before the 19 November internal target. The first foundation and V01 journey milestone is merged in PR #2; scenario breadth is merged in PR #3. The complete report was authorized, built and verified on 25 October. This scope is the coarse view; [the backlog](../17-task-backlog.md) owns atomic tasks and hours. The user authorized the first milestone on 24 October 2026; no deployment is included.

**Build approach:** Tracer Bullet, prove a thin complete fictional journey before adding breadth. No health-record/auth layer is required. Public selection/metadata counters are deferred outside the solo core; their safe contract remains in ADR 0004 for separately funded work.
**Workflow:** Beta proposed, behavior verification and tests; additional independent human review for safety/privacy. These workflow names do not establish clinical or regulatory maturity. The user can review the proposal before selecting a depth.

## At a glance

| # | Feature | Phase | Status |
|---|---|---|---|
| 1 | Stack and architecture | Foundation | in-progress |
| 2 | Coding conventions and tooling | Foundation | in-progress |
| 3 | Runtime data model and interfaces | Foundation | in-progress |
| 4 | Design system | Foundation | in-progress |
| 5 | Thin authored fictional journey | Slice 1 | done |
| 6 | Safe navigation and evidence breadth | Slice 2 | done |
| 7 | Controlled AI selection | Deferred outside solo core | dropped |
| 8 | Report and session control | Slice 4 | done |
| 9 | Evidence and submission | Release | in-progress |

## Foundations

### 1. Stack and architecture, in-progress

One maintainable application that supports the narrow demonstration. Done when the foundation decision is ratified and an authorized skeleton runs and builds.

* [x] Review proposed [ADR 0001](../specs/0001-prototype-foundation.md). First milestone authorized 24 October.
* [x] After explicit authorization, build the foundation. Code in `src/app`, with a passing production build.

### 2. Coding conventions and tooling, in-progress

Capture actual conventions after a scaffold exists. Done when documented conventions and reproducible CI checks match the repository.

* [ ] Capture context and tooling from the future real project with the audit workflow.

### 3. Runtime data model and interfaces, in-progress

Agree on locked catalog IDs, normalized enums, rule aggregation, complete-report disclosure and consent. Selective report omission remains deferred and would require the retained dependency contract. Done when [data/API contracts](../09-database-and-api-design.md) are approved and implemented with boundary validation.

* [ ] Review runtime model and no persistence decision before implementation.

### 4. Design system, in-progress

Keep consumer interaction consistent. Done when approved direction and core controls support keyboard, focus and mobile reading.

* [ ] Review proposed [ADR 0003](../specs/0003-consumer-design-direction.md).

## Slices

### 5. Thin authored fictional journey, done

One scenario from purpose through consent to guidance and clear. Done when the complete path works with AI disabled and one browser test proves it.

* [x] After approval, build and verify the first whole journey. V01 code in `src/components/journey.tsx`; browser coverage in `e2e/journey.spec.ts`. Merged in PR #2 after browser verification, passing CI and latest head CodeRabbit review.

### 6. Safe navigation and evidence breadth, done

Add only supported question branches and source cards. Done when urgent precedence, unknowns and reviewed or clearly simulated expectations pass.

* [x] Review [ADR 0002](../specs/0002-navigation-and-ai-boundary.md) and clinical approval status. Implemented authored simulation only; ADR remains Proposed and clinical approval remains outstanding.

Implementation in `src/lib/scenario.ts`, `src/lib/session.ts` and `src/components/journey.tsx`. The twelve locked examples, whole example switches and urgent/unknown interruption are built. Verification is recorded in [the checklist](../scenario-navigation-verification.md); clinical/source approval remains outstanding. PR #3 records the verified implementation and user authorization to merge under the revised review policy.

### 7. Controlled AI selection, dropped from solo commitment

Retained as a future design, not a deadline commitment. Requires actual clinical/rights approval, 24 additional builder hours, safe shared controls and unconfirmed external review capacity. Authored mode explicitly records AI absent.

The user requested a separate [AI appointment preparation coach proposal](../specs/0007-ai-appointment-coach.md) on 26 October. It records generated summaries/questions as a candidate next slice, with implementation still unauthorized and decisions outstanding. It does not reactivate this older fragment-selection commitment or inherit its 24h estimate. Reconcile and enroll the chosen build scope only after the new design and revised solo estimate are approved.

* [ ] Review the one-candidate staffed experiment and [shared admission decision](../specs/0004-public-ai-spend-controls.md) before enabling any provider call.

### 8. Report and session control, done

Prepare a complete semantic HTML report with Print/Save as PDF and reliable clear. Done when preview discloses all included facts, no field omission is offered, cancel works and no old session is restored. No PDF-generation library or selective-redaction feature.

* [x] Build and verify the approved report/clear contract after the core path. Authorized 25 October; implementation in `src/components/report.tsx`, `src/lib/report.ts` and `src/app/report/page.tsx`. Evidence in [report verification](../report-verification.md).

### 9. Evidence and submission, in-progress

Release validation was authorized on 26 October. Actual browser evidence and remaining gates are recorded in [release verification](../release-verification.md). The user authorized an owner private preview on 26 October, governed by [ADR 0005](../specs/0005-private-preview.md). The user subsequently requested a public judge link on a different host with a memorable name, governed by [ADR 0006](../specs/0006-public-demo-hosting.md). Deployment verification and submission remain separate. Produce actual measured evidence and a compliant demonstration package. Done when release gates pass and the team reviews the actual final entry.

* [ ] Run the planned checks and prepare official deliverables after a working build exists.

## Deferred

Public AI service/metadata counters, selective report omission, a second explanation style, additional model comparisons, accounts and saved histories, persistent health-record database, real booking, teleconsultation, EHR/FHIR, test results, wearables, prediction, extra languages, enterprise admin, payments and analytics dashboards. Reconsider only through an explicit scope revision. Planning files are not evidence these capabilities exist.

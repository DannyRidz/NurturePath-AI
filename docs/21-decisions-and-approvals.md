# Decisions and approvals

Prepared 23 October 2026. **The first implementation milestone was authorized on 24 October 2026.** No approval is inferred from this document or from elapsed time. The user originally confirmed 25h/week personal capacity and later clarified that they alone build the app; Jeremiah is not allocated engineering/review hours. The JS Mastery origin was identified. The user subsequently authorized an independent model review and all eight recommended planning revisions. This authorizes document revisions only; it does not approve clinical content, resource activation, the entire product scope or application implementation. The earlier planning restriction was superseded only for the first milestone by the user’s “please proceed” on 24 October. Clinical approval, paid services, deployment and final submission are not authorized by that message. Other recommendations remain Proposed unless explicitly stated.

| Decision | Recommendation and why | Alternative / consequence | Status / decision maker |
|---|---|---|---|
| D01 Challenge | Retain Male Reproductive Health, best bounded full journey | Screening-to-Care if genuine partner workflow becomes available | Proposed, team |
| D02 Intended use | Fictional research demonstration, education/preparation | Personal health intake requires clinical/legal/privacy approval and more work | Proposed, team; external gates for live use |
| D03 Scope | Essential consent/intake/rules/urgent/result/evidence/report/clear | Wider feature scope reduces time for proof | Proposed, team |
| D04 Architecture | Next.js/TS/Tailwind/Zod monolith, locked variant-only API, memory-only case view, expiring shared limiter metadata | DB/auth only for a later approved saved-history pilot | Proposed, team; ADR 0001 |
| D05 AI | GPT-6 Luna primary candidate for complete authored fragment-ID selection, only after approval | Authored mode default; second model conditional, free prose/third model deferred | Proposed, team; ADR 0002 |
| D06 Design | Swiss appointment sheet | Organic requires distinct palette/type and additional contrast work | Proposed, team; ADR 0003 |
| D07 Language | English only | Malay/Arabic after qualified translation and QA | Proposed, team |
| D08 Build approach | Thin vertical slices; core authored flow before generation | UI-only facade can mask integration risk | Proposed, team |
| D09 Quality depth | Automated behavior tests and real UI verification; additional review for safety/privacy | Process names do not replace measurable gates | Proposed, team |
| D10 Capacity | Carry forward 25h/week for the sole builder, about 100 gross hours to 20 Nov | Availability assumption should be updated if the user changes it | Prior hours carried forward; sole-builder correction **confirmed**, 23 Oct |
| D11 Schedule | Freeze 10 Nov; internal submission 19 Nov 16:00 Brunei | Relying on disputed official clock creates avoidable risk | Proposed, team |
| D12 Clinical rules | Draft pathways only until qualified signoff | Without reviewer, AUTHORED_SIMULATION only, no provider call | Pending, qualified clinician |
| D13 Terms/IP | Team reviews first refusal/publicity provisions before submission | Commercial restrictions may alter participation decision | Pending, team/organizer/counsel |
| D14 Deadline | Request canonical UTC closing time | Official surfaces disagree; do not resolve silently | Pending, organizer |
| D15 Budget | Prototype hosting allowance $0-$50/month plus $20-$50 AI experiment | Credits not guaranteed; clinical/legal costs not priced | Proposed, team |
| D17 Review revisions | Apply all eight independent findings, preserve narrow scope | User authorized planning revisions on 23 Oct, not clinical/build approval | **Authorized planning work**, user |
| D18 Release modes | Authored simulation default; reviewed selection conditional, no public medical prose | Runtime AI absent without actual approval | Selected planning revision; actual approvals pending |
| D19 Admission mechanism | Vercel sin1 + Upstash Singapore primary, atomic counters, USD 1/day reservation cap | Authored mode if unavailable; no service provision authorized | Selected planning revision, ADR 0004 |
| D20 Prior revision-2 capacity | 172h across A/B was the old plan | Superseded by D21, not feasible on the current solo capacity | Historical, superseded |
| D21 Solo delivery | User builds everything; Jeremiah role unassigned. Core 82h, gross capacity about 100h, reserve 18h gross/about 14h before internal submission | No hidden second reviewer or parallel workstream | Solo builder confirmed; reduced scope/estimates proposed |
| D22 Report scope | Complete preview and browser Print/Save as PDF, share all or cancel | Selective field omission and its dependency-redaction work deferred | Proposed solo scope reduction |
| D23 AI capacity | No runtime model service in committed solo core | Safe fragment-only design retained; 24h added builder work plus any independent reviewer time needs funding/approval | Deferred, no fabricated AI delivery |
| D16 Implementation | Build the app foundation and one complete authored fictional journey | Other variants, report, runtime AI and deployment remain later work | **Authorized**, user, 24 October 2026 |

## Approval checklist for your team review

* Confirm challenge and narrowly stated intended use.
* Confirm essential/deferred features, visual direction and English scope.
* Review architecture, provider experiment, no persistent health record decision and privacy wording.
* Review sole-builder capacity, reduced scope and sequential schedule; agree any Jeremiah contribution separately without counting it in the budget.
* Resolve submission terms/eligibility concerns and seek organizer deadline clarification.
* Assign clinician/source rights/legal followup; do not conflate software approval with clinical approval.
* Explicitly authorize the first implementation milestone if the proposal is acceptable.

Record each future decision with date, actual approver, selected option, rationale and affected docs. Update the canonical owner document and ADR when a proposal changes. Do not create contradicting meeting notes as a new specification. A blanket build approval does not authorize sending outreach, accepting new terms, collecting patient data, purchasing services or submitting the final entry unless the user separately requests those actions.

## Authorized first milestone, 24 October 2026

T03 to T05: pin supported dependencies, create shared contract and a minimal fictional nonurgent journey with authored output, session clear and one browser test. Add no account, database or predictive model. Expand only after that loop is verified. The user authorized this milestone with “please proceed.” Build status and verification evidence are recorded with the implementation PR.

## Authorized second milestone, 25 October 2026

The user said “please proceed with the next milestone” after agreeing the scope of scenario breadth and safe navigation. T06 to T09 cover the twelve locked fictional examples, whole example replacement, ordered authored outcomes, urgent/unknown safety interruption and inline source context. PR #2 is merged. This authorization does not approve clinical content or source rights, runtime AI, reports, deployment, purchases or submission.

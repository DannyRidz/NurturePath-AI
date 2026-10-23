# Demonstration and pitch plan

Map evidence to the six [published assessment dimensions](https://hack2skill.com/event/futurehealthchallenge/). No numeric judging weights were found. Solo revision 3 commits to authored simulation with no public AI service; Jeremiah is not assigned building, testing, review, deck or video work. Any actual team contribution should be declared only after agreed/performed. Do not present our challenge selection weights as the rubric.

| Published criterion | What our evidence should answer | Functionality, research and tests | Demo evidence / current gap and risk |
|---|---|---|---|
| Health impact and clinical relevance | Does this address an upstream access problem with plausible safe benefit? | Guided private preparation, source/reviewer records, comprehension tasks | Show understood next step; no measured health or real referral outcome yet |
| Technical depth and architecture | Are decisions coherent, traceable and reliable? | Versioned rules, schema boundary, source selection, output guards, isolation tests | Explain why AI cannot change care direction; avoid complexity as a substitute for proof |
| Working solution and demonstration quality | Does one complete journey work in its disclosed mode? | First use through report/clear, mobile checks and failure tests | Show actual functioning build, urgent scenario and AI outage; risk incomplete integration |
| Responsible AI, safety and data governance | Are limits enforced, not only disclaimed? | Consent, synthetic only intake, static urgency, no health logs, citation checks | Show invalid selection IDs falling back and clear action, only if reviewed selection is enabled; independent clinical review still needed |
| Scalability and deployment readiness | Can the prototype be operated and extended credibly? | Version pin, budgets, kill switch, rollback, future approved data architecture | Show operations evidence and pilot prerequisites; no patient readiness claim |
| Commercial viability and path to pilot | Who benefits, who pays and what must be proven? | Clinic licensing hypothesis, workflow/reviewer feedback, fixed fee incentive design | Show report usefulness and explicit pilot gates; no partner or willingness to pay proven |

## Under three minute submission video, target 2:50

| Time | What to show and say |
|---|---|
| 0:00-0:18 | “People can delay discussing reproductive concerns because the first step feels private and unclear. This research prototype helps prepare that conversation. It does not diagnose fertility.” Cite burden/access context on slide without inventing local statistics |
| 0:18-0:35 | Open actual mobile UI, visible fictional label, choose locked case and show purpose/privacy. Show separate AI consent only for an eligible REVIEWED_SELECTION case; otherwise show authored-mode/AI-disabled disclosure |
| 0:35-1:00 | Complete representative questions, briefly show why asked and review/edit. If recording cuts waiting/typing, label the edit honestly |
| 1:00-1:28 | Show deterministic next step and source. In REVIEWED_SELECTION request simpler authored wording, show actual model-selected fragment IDs and registry text. In AUTHORED_SIMULATION show the authored explanation and explicitly say AI is disabled pending content approval |
| 1:28-1:48 | Preview the complete report and all-facts sharing notice, show browser Print/Save as PDF or Cancel, then clear. No selective omission claim in solo core |
| 1:48-2:08 | Reset to separate fictional urgent case, trigger immediate static guidance. No waiting for AI, no fake ambulance/clinician alert |
| 2:08-2:25 | REVIEWED_SELECTION: clearly label injected invalid fragment IDs or provider failure and show authored fallback. AUTHORED_SIMULATION: show whole-variant reset/recovery and the explicit AI-unavailable boundary, with no provider-failure or generation claim |
| 2:25-2:42 | Show actual evaluation sheet with n/N, failures/limitations and clinical reviewer status. Before actual runs, this part cannot show scores |
| 2:42-2:50 | Clinic supported preparation pilot, required approvals, team and clear scope of next evidence |

This compresses the requested end to end story; do not use the indicative seven minute live slot as the video limit. Test legible text, captions and audio. Upload only after authorization to an approved host, check anyone-with-link permissions in a fresh session, and retain a local copy. No upload or message was performed during planning.

The mode changes the story materially: if no approved content exists, do not claim a working AI feature or replace the live segment with an undisclosed old recording. AUTHORED_SIMULATION demonstrates the preparation/safety workflow and names AI selection as outstanding. Evidence slide separates 32 navigation, 24 request and 16 core state cases in authored mode (72 executed); eight additional selection/infrastructure cases run only in reviewed mode (80 executed). Mark unrun cases not applicable, never passed; AI attempts and a second-style presentation study are deferred from the solo core; if separately funded they require distinct denominators. No 80/80 clinical accuracy or demographic fairness claim.

## Live presentation variant and fallback

Terms mention ideally seven minutes plus three minutes Q&A, with actual duration conveyed by organizer. Prepare a 3 minute core and optional 4 minute extension: architecture, clinical review process, evaluation breakdown, business/pilot assumptions and operations. Adapt to confirmed slot later.

Fallback assets after build: local working authored synthetic mode, prerecorded 2:50 flow, PDF report and architecture/evidence slides. If showing a recording, identify it as recorded. Never fabricate live provider responses or display cached model text as freshly generated. No real patient information or third party booking is needed.

## Mandatory official template mapping

The [native official template](https://docs.google.com/presentation/d/1eQhkruQ0nL1a7EjgH8ZXYlC1T0P_kjPYmepwaonzAoQ/) was read via Google Drive. It has 15 slides; extracted content includes the fields below. Preserve the official template when authoring a copy later. No deck has been created or edited now.

| Template item | Planned content source |
|---|---|
| Team name, size, problem statement | Confirm actual submitting team details; select exact challenge label |
| Team members, country, role, organization, age confirmation | Each member supplies truthful facts; do not copy private dashboard details into a public plan |
| Team capability summary, max 1,000 characters | Relevant real skills/work, no invented healthcare expertise |
| Architecture/workflow diagram | Document 08, simplified to one diagram |
| Target users and intended outcome | Documents 04/05, with simulation boundary |
| Success measures and evidence supporting approach | Actual artifact from document 13; sole-author review status, sources and limitations |
| Data sources and legal rights | Document 03, original synthetic provenance, source licensing |
| Risks and safeguards | Documents 11/12/20, human oversight/failure behavior |
| Hardware requirements if applicable | Software only; do not add unnecessary hardware |
| Path to pilot/scale | Document 15, approvals and operational ownership |
| Preexisting IP/third party materials | License inventory and true prechallenge baseline |
| Conflict declaration | Team member verification, no guessed “none” |
| Additional slide / remaining page | Evidence or concise limitations if allowed; inspect visually when authoring rather than assuming blank pages are dispensable |

Prepare H4 form text after build: summary ≤2,000 characters, work during challenge ≤1,500, Prototype stage, accurate technology selections, demo/prototype URLs, software choice, conflict declarations, PDF ≤5MB and video under 3min. Recheck current form before submission.

## Defensible top three argument

“NurturePath demonstrates a complete private preparation path, with source linked explanations, a patient controlled report and explicit limits. Its safety design keeps urgent guidance available when the model fails. We show the actual behavior, failures and comprehension evidence rather than a fertility score the data cannot support.”

This is a proposed argument, not proof of top three merit or a probability of winning. Weak points: the interaction is copyable; local clinical review and real access outcomes may be missing; an authored leaflet may perform similarly; no provider partnership is secured. Strengthen it with one meaningful clinician review, a real formative test and transparent held out failure results. Adding features will not repair absent evidence.

## Likely judge questions

| Question | Honest answer framework |
|---|---|
| Why use AI at all? | To test choosing between complete approved authored bundles. No model-written medical prose is displayed. Compare with deterministic authored style; if no benefit or no clinical approval, omit runtime AI and say so |
| Is it clinically validated? | No. State exact review status and synthetic test limits. A reviewed rule set is still not a validated clinical product |
| What happens if AI is wrong/offline? | It returns only IDs that must match a complete allowed bundle. Invalid/offline selection uses authored default; app next step is unchanged. Show actual test |
| Why not train the UCI dataset? | 100 narrow volunteer records cannot justify individual fertility prediction or population generalization |
| How do you protect privacy? | Fictional bounded inputs, memory state, variant ID only request, optional disclosed selection processing, expiring pseudonymous limiter counters, no health logs and controlled report download; acknowledge vendor/device residuals |
| Where does the user receive care? | Current prototype prepares for care; it does not book, dispatch or verify referral completion. Pilot needs a real partner pathway |
| What is different from existing tests/chatbots? | Preparation before testing, explicit reasons/limits and controlled handoff; not replacement diagnostics or a global novelty claim |
| Who pays? | Clinic licensing hypothesis, fixed fees avoiding referral incentives; willingness to pay untested |
| Can it operate in UAE/Brunei? | Real patient use requires local intended use, privacy, transfer and healthcare approval analysis first |
| What did you build during the event? | Use actual commits, dates and demo evidence, with third party and preexisting materials declared |

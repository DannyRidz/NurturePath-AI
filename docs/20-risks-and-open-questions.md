# Risk register and final gap analysis

Risk ratings are planning judgments. Severity and likelihood use 1 low to 5 high; score is their product, not an actuarial estimate. Owners A/B are developers; clinical/legal questions require qualified external review. Residual risk remains even after passing synthetic tests.

| ID | Risk / impact | Severity / likelihood / score | Mitigation and trigger | Owner |
|---|---|---|---|---|
| R01 | False reassurance delays care | 5/3/15 | No healthy verdict, unknown handling, static urgent branch; any miss blocks affected function | B + clinical reviewer |
| R02 | Clinically unreviewed rules treated as validated | 5/4/20 | Simulated presets and explicit unvalidated labels; separate expectation approval status | Builder |
| R03 | AI invents treatment or changes meaning | 5/3/15 | Only exact approved complete fragment IDs can render; no provider prose. Card approval and authored fallback remain necessary | Builder |
| R04 | Data disclosure via logs, reports, shared device | 5/3/15 | No real intake, log allowlist, local clear/race tests and download notice | B, A for UX |
| R05 | Deadline timezone conflict causes late entry | 4/3/12 | Organizer clarification, 19 Nov internal submission, recheck form | Builder |
| R06 | IP terms restrict exclusive commercialization | 4/3/12 | Review six month first refusal and publicity clauses, get written clarification | Shared / counsel |
| R07 | Guideline reuse rights incompatible with commercial content | 4/3/12 | Original concise summaries/links, license register, rights advice | Builder |
| R08 | Solo scope exceeds available capacity | 4/4/16 | 82h authored core vs ~100h gross; about 14h reserve before internal target; public AI/partial report omission deferred; freeze 10 Nov | Sole builder |
| R09 | No clinical reviewer available | 4/4/16 | Early request brief; lock simulation status by 1 Nov, lower claims | Builder |
| R10 | Provider access, latency, quota or billing failure | 3/3/9 | Access spike, cap, timeout, authored mode, actual account checks | Builder |
| R11 | Cultural phrasing harms trust or excludes | 4/3/12 | Neutral copy, optional disclosures, local lay/clinical review | Builder |
| R12 | Poor usability or inaccessible flow | 4/3/12 | Small question set, keyboard/readers/real phones, formative tasks | Builder |
| R13 | Synthetic tests mistaken for clinical accuracy | 5/3/15 | n/N, reviewer status, no prevalence/fairness extrapolation | Builder |
| R14 | Overreferral creates anxiety/cost | 4/3/12 | No weighted lifestyle score, qualified pathway review, track inappropriate referrals later | Clinical reviewer |
| R15 | Premature patient launch triggers unassessed obligations | 5/3/15 | No personal intake; intended use/legal/clinical gate before pilot | Shared / counsel |
| R16 | Demo lacks evidence or looks like generic AI wrapper | 4/3/12 | Show report, urgent/failure controls and actual comprehension/evaluation | Builder |
| R17 | Deployment/URL permissions fail for judges | 4/3/12 | Fresh-session link checks, pinned release, local/video fallback | Builder |
| R18 | Registration/team/conflicts not fully verified | 4/2/8 | Team confirms actual members, ages, affiliations and checkpoint obligations | Builder |

## Open questions by urgency

Before implementation approval: retain challenge, synthetic-only scope, chosen visual direction, primary model experiment, architecture without DB and budget. User confirmed developer capacity. Before submission: canonical UTC deadline, IP interpretation, template/finalist/checkpoint requirements, actual team declarations, source rights and any judge service availability expectation. Before calling content reviewed: named clinician, approved questions, local urgency/care pathways and source conflicts. Before patient pilot: intended use/classification, privacy/transfer regime, operating entity/contracts, incident medical lead and validation protocol.

User correction: the user alone builds; Jeremiah may do other work but no role/time is agreed here. Building alone does not change registered team membership. Confirm truthful submission contributions separately without editing team registration or inventing Jeremiah's responsibilities.

## Five perspective self review

This is an internal planning review, not five independent experts or a fresh model audit. Findings below were incorporated into the proposal.

| Perspective | Initial gap / concern | Revision made | Remaining gap |
|---|---|---|---|
| Hackathon judge | Broad feature list risks unfinished demo; unclear formal deliverables | Narrow full journey, official deck mapping and under 3min story; all ten challenges compared | Actual evaluation and clinician evidence still absent |
| Ordinary consumer | Risk scores, long intake and AI terms could confuse | One next step, small guided sections, why asked, unknown/declined, clear report/finish | Must test comprehension with adults; drafted copy is not validated |
| Senior architect | Database/auth/vector store consume time without essential use | Stateless synthetic app, shared schemas, pure rules, finite cards, early vertical slice | Actual account access, metadata limiter qualification and PDF feasibility need early spikes |
| Clinical safety reviewer | Unreviewed triage could appear patient ready; unknowns and timing risk | Preset fictional cases, explicit unvalidated status, no treatment/score, urgent AI bypass and signoff checklist | Qualified review is outstanding; narrow red flag coverage not a clinical screen |
| Product/business strategist | Referral count and token cost do not prove value or economics | Preparation/comprehension hypothesis, fixed clinic fee, real pilot gates and full cost drivers | No customer commitment, outcomes or defensibility established |

## Residual decision

The proposal is feasible as a focused research demonstration, conditional on disciplined scope and early integration. It is not ready for patient deployment. The largest competitive improvement would be actual reviewed content and observable comprehension, not extra AI architecture. Top three placement cannot be responsibly predicted from public criteria alone.

## Independent review revision 2

The independent reviewer found eight decision gaps, not a need for broader product scope. The user authorized addressing all eight. Canonical contracts now lock twelve fictional variants, separate authored and clinically gated selection modes, forbid public free prose, define exact simulation predicates/missingness/aggregation, remove transitive report disclosures, split evaluation by outcome type, choose atomic shared admission, and staff one-candidate review. All are planning changes, not tested controls.

The default authored mode has no runtime AI, so its competition story must disclose that limitation. Revision 3 defers public AI/shared counters and partial report redaction from the solo core. Core 82h leaves 18h gross reserve, approximately 14h to the internal date. Human independent review cannot be claimed from self-review; external capacity is unconfirmed. The full report and disposition are in docs/reviews/2026-10-23-independent-plan-review.md. Clinical source-section approval, actual account/limiter verification and organizer questions remain explicit prerequisites.

## Sole-builder correction, revision 3

The old 172h allocation was viable only under the earlier two-builder assumption. The user corrected that assumption before implementation. Do not simply merge the A/B task lists or assume faster delivery with Codex. The new 82h authored core removes actual work: public model/Redis integration, custom PDF/selective redaction, second style and model experiments. Runtime AI absence weakens the challenge argument; professional review and actual usability evidence remain the most useful possible support, without assigning them to Jeremiah. The solo replan is a proposal and has not received a fresh independent model feasibility review.

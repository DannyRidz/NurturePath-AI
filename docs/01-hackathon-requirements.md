# Competition requirements and evidence

Verified 23 October 2026. Public pages were read through web access and rendered browser UI. The existing authenticated participant browser was used read only for the roadmap, ten challenge detail dialogs, submission form, Resources, Announcements, and Live Modules. No submission field, team membership, registration, or agreement was changed.

## Source keys

* H1: [Public competition page and expanded FAQ](https://hack2skill.com/event/futurehealthchallenge/).
* H2: [Authenticated roadmap](https://hack2skill.com/event/futurehealthchallenge/dashboard/roadmap).
* H3: [Authenticated challenge catalog](https://hack2skill.com/event/futurehealthchallenge/dashboard/challenges).
* H4: [Actual submission form](https://hack2skill.com/event/futurehealthchallenge/dashboard/submissions/6ac3d0d9a4e929a814f726ee).
* H5: [Challenge terms](https://hack2skill.com/event/futurehealthchallenge/tnc), rendered browser text.
* H6: [Resources](https://hack2skill.com/event/futurehealthchallenge/dashboard/resources), [Announcements](https://hack2skill.com/event/futurehealthchallenge/dashboard/announcement), Live Modules within H2.
* H7: [Official 15 slide submission template](https://docs.google.com/presentation/d/1eQhkruQ0nL1a7EjgH8ZXYlC1T0P_kjPYmepwaonzAoQ/), text read through Google Drive connector. Visual/template styling was not parsed because no deck is being authored.

## Requirements matrix

| ID | Finding and classification | Source | Planned response / unresolved issue |
|---|---|---|---|
| H-01 | O: worldwide participation, one to five members; one team per person | H1 FAQ | One builder fits the published team size range; building alone does not remove Jeremiah from registration. Verify actual registered members and their declarations separately |
| H-02 | O/Q: public guidance requires lead and award recipients to be 18 by deadline; terms also discuss minors 14+ with waiver | H1, H5 eligibility | Confirm adult eligibility; do not assume permission for a minor award recipient |
| H-03 | O: three areas and ten statements | H1, H3 | All ten summarized and compared in document 02 |
| H-04 | O: no mandatory vendor, model, platform or hardware | H1 | Select the simplest stack; Azure is optional |
| H-05 | O: organizers provide no datasets, including synthetic data; disclose sources and rights | H1 expanded data FAQ | Team authored fictional fixtures, attribution/license register |
| H-06 | O: existing ideas/solutions/prototypes allowed; disclose maturity and work done during event | H1 existing product FAQ, H4 | Current repo is README only; preserve future commit history and build dates |
| H-07 | O: working prototype plus documentation, assumptions, dependencies and limitations | H1, H4 | Runnable synthetic demonstration and architecture/evaluation/release notes |
| H-08 | O: official reference PPT template is mandatory; upload PDF, maximum 5 MB | H4, H7 | Fill template copy later, export PDF, inspect all slides and verify file size |
| H-09 | O: challenge selection, summary max 2,000 chars, solution stage, work built max 1,500 chars, technology type, prototype link | H4 | Prepare final fields after build, report Prototype rather than Pilot-ready |
| H-10 | O: software/hardware declaration and team conflict declaration | H4 | Software; each member verifies truthful conflict answer |
| H-11 | O: demo video link, viewable by anyone with link, under 3 minutes; URL fields show 1,024 char limits | H4 | Target 2:50, captions, incognito permission check |
| H-12 | O/Q: public deadline is 20 November; dashboard timezone labels conflict | H1, H2, H4 | See time table below, ask organizer |
| H-13 | O: six named evaluation dimensions, no published numeric weights found | H1, H5 | Map evidence in document 19; our scoring weights are not official |
| H-14 | O: public registration 15 Oct to 10 Nov; H2 closes 11 Nov 02:29 (+08) | H1, H2 | Account appears registered; team should confirm membership, age and permissions |
| H-15 | O: weekly Thursday sessions recorded | H1 | Session times, URLs and actual recording availability not established |
| H-16 | O/Q: Resources advertises Azure resources with literal credit/resource placeholder text | H6 | No credit amount, activation or account quota confirmed; budget without credits |
| H-17 | Q: no guaranteed clinical reviewer, mentorship allocation or dataset access established | H6 | Request clinician support; cannot count it as available |
| H-18 | O/Q: top three present at GITEX, public date window 7 to 11 Dec | H1, H2 | Travel, funded expenses and exact finalist slot unverified |
| H-19 | O/Q: terms describe demonstration time conveyed by organizer, ideally 7 min plus 3 min Q&A | H5 | This is indicative, not the submission video limit or a guaranteed live slot |
| H-20 | O: participants retain IP per FAQ; terms add exclusivity first refusal/publicity conditions | H1, H5 | Team rights review before submission; detail below |
| H-21 | O: third party rights must be secured; submitted materials may be publicized | H5, H7 | No patient information, secrets or unauthorized guideline content in artifacts |
| H-22 | O/Q: terms require checkpoint attendance/engagement; details not supplied | H5 | Organizer should name channels, dates, attendance requirements |
| H-23 | Q: no mandatory hosting region, source visibility policy, service uptime period, or specific clinical deployment permission established | H4/H5/H6 inspection | Synthetic demo only; ask retention/access expectations for judges |
| H-24 | O: terms allow amendments and state precedence over inconsistent promotional terms | H5 | Recheck rules before freeze and submission, retain dated evidence |

## Time discrepancy

| Surface | Exact observed meaning | Conversion / limitation |
|---|---|---|
| Public H1 | Working prototype due 20 November 2026 | No time or timezone shown |
| Roadmap H2 | Sat 21 November 2026 02:29 AM (+08) | 20 November 18:29 UTC, 22:29 UAE |
| Submission H4 | 21/11/2026 02:29:00 AM (IST) | If India Standard Time, 20 November 20:59 UTC, 21 November 04:59 Brunei |

Do not pick one timezone as authoritative without clarification. **S: submit internally by 19 November 16:00 Brunei (08:00 UTC, 12:00 UAE).** Calendar interval from 23 October to 20 November is 28 days; do not treat a dashboard countdown as guaranteed working time. Public evaluation dates are 20 to 30 November; H2 displays evaluation from 21 November in +08. Treat finalist logistics as provisional.

## IP and other terms needing team review

H5's Intellectual Property Rights section describes six months after conclusion during which an exclusive third party transaction must first be offered to the organizer on the same terms, with 30 days to accept. It also authorizes disclosure of ideas, and a later clause grants broad perpetual nonexclusive sublicensable promotional rights in marketing content. These are published terms, not a conclusion that ownership transfers. Their scope and interaction with the FAQ merit written organizer clarification and, for commercialization, counsel review.

Terms also mention prize taxes and deductions, organizers' ability to change awards, third party rights warranties and indemnities, and checkpoint participation. Do not forecast net prize proceeds or treat winning as commercial funding. The page includes generic provisions and inconsistent age wording; ask which current challenge specific terms govern.

## Male challenge traceability

| Official desired outcome, paraphrased | Proposed evidence | Gap |
|---|---|---|
| Explain earlier signals, separate screening and diagnosis | Rule trace and source cards, no probability score | Clinician approval of mappings |
| Respect culture and choices | Neutral questions, optional sensitive details, no marriage assumptions | Local comprehension review |
| Remove an access barrier | Appointment preparation flow and shareable report | Actual access improvement not yet measured |
| Appropriate safe next step and human oversight | Static urgent branch, routine care information, reviewer signoff record | No live referral service or clinician on call |
| Explicit consent, minimal data and controlled sharing | Memory only sessions, optional AI, report preview and deletion | Provider retention remains separate |
| Demonstrate realistic case performance and fairness | Held out fixtures, comprehension study, denominator reporting | No referral completion or health outcome evidence yet |

## Clarification list, to send only with explicit authorization

Ask support+fhdic@hack2skill.com to confirm the canonical UTC deadline, applicable IP terms, age rules, exact checkpoints and finalist slot, code access requirements, template page requirements, credit allocation, session recordings, clinical mentor availability and judge access duration. No email was sent. Resources' Azure guide link was observed, but its published document could not be read through web access, so no allocation details are assumed.

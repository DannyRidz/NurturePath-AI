# NurturePath AI master plan

Prepared 23 October 2026, Asia/Brunei. Status: **First milestone merged in PR #2. Scenario breadth merged in PR #3. Complete printable report authorized, built and verified on 25 October 2026.**

Start with the [executive summary](00-executive-summary.md), then review the [approval register](21-decisions-and-approvals.md). The recommendation is to retain Male Reproductive Health and build a small, synthetic scenario prototype for education and care navigation. No clinical validation, usability results, model benchmarks, partnership, or regulatory compliance is claimed. Revision 2 incorporated the authorized independent review fixes. Revision 3 rebases delivery after the user clarified they are the sole builder. On 24 October the user authorized the app foundation and one complete authored fictional journey.

## Reading map

| Document | Decision it supports |
|---|---|
| [00 Executive summary](00-executive-summary.md) | Is this worth building, within the available time? |
| [01 Hackathon requirements](01-hackathon-requirements.md) | What is official, and what is unresolved? |
| [02 Challenge comparison](02-challenge-selection-analysis.md) | Why retain this challenge after comparing all ten? |
| [03 Sources and skills](03-research-and-sources.md) | What supports each recommendation? |
| [04 Product requirements](04-product-requirements.md) | What belongs in the prototype? |
| [05 People and journeys](05-user-personas-and-journeys.md) | Who benefits and what must they understand? |
| [06 Design system](06-ui-ux-design-system.md) | What should the experience look and feel like? |
| [07 Screen specifications](07-screen-specifications.md) | What appears on each screen and in each state? |
| [08 Software architecture](08-software-architecture.md) | How should the sole builder structure the system? |
| [09 Data and API contracts](09-database-and-api-design.md) | Where does every input and output come from? |
| [10 AI architecture](10-ai-architecture.md) | What may the model do, and how does it fail safely? |
| [11 Clinical safety](11-clinical-safety.md) | What requires qualified clinical approval? |
| [12 Privacy and security](12-privacy-and-security.md) | Where could sensitive information escape? |
| [13 Datasets and evaluation](13-datasets-and-evaluation.md) | What evidence can be produced honestly? |
| [14 Competitors](14-competitor-analysis.md) | What is the defensible distinction? |
| [15 Business and pilot](15-business-and-pilot-strategy.md) | Who might buy it, after evidence and approvals? |
| [16 Roadmap](16-development-roadmap.md) | What fits before submission? |
| [17 Backlog](17-task-backlog.md) | Who does what, with dependencies and completion tests? |
| [18 Quality strategy](18-testing-and-qa.md) | Which failures block release? |
| [19 Demo and pitch](19-hackathon-demo-and-pitch.md) | How does a sub three minute demonstration prove value? |
| [20 Risks and review](20-risks-and-open-questions.md) | What could invalidate the plan? |
| [21 Decisions and approvals](21-decisions-and-approvals.md) | What is proposed, confirmed, or awaiting a decision? |
| [22 Definition of done](22-definition-of-done.md) | What separates a finished demonstration from a patient service? |
| [Living scope](scope/scope.md) | Coarse implementation sequence and current progress |
| [Architecture decision records](specs/0001-prototype-foundation.md) | Foundation, safety/AI/design and [shared admission](specs/0004-public-ai-spend-controls.md) |
| [Independent review and resolution log](reviews/2026-10-23-independent-plan-review.md) | Eight findings and the authorized planning revisions |

## How to use this plan

Official competition facts belong in document 01. Source provenance belongs in 03. Product acceptance criteria belong in 04, clinical rule proposals in 11, API contracts in 09, and tasks in 17. Other documents link to those owners rather than defining competing versions. ADR status stays Proposed until the team approves it. A clinical proposal cannot become approved merely through software team approval.

Evidence labels: **O** officially confirmed; **G** strongly supported by published guidance; **S** our proposed strategic decision; **Q** requires organizer or qualified reviewer clarification. Dates are Brunei time unless a source timezone is explicitly quoted. Numbers described as targets or scenarios are not achieved results.

The user is the sole application builder. Jeremiah's other contribution is unassigned and provides no assumed engineering or review capacity. Carry forward 25h/week as the user's working availability: about 100 gross hours to 20 November or 96h to internal submission on 19 November 16:00 (+08). Solo core: 82h, leaving approximately 18h gross reserve or 14h to the internal target. Feature freeze remains proposed for 10 November. The official timezone discrepancy remains unresolved.

Revision 3 commits to authored simulation, one plain explanation style, inline evidence and a complete printable report with no per-field omission. Public AI/Redis work, additional styles and selective report redaction are deferred beyond the core budget. The twelve-variant contract and safety controls stay intact. Full report disclosure/consent replaces partial omission in the solo core; the stronger transitive-redaction design remains a prerequisite if that enhancement is later added. The historical 172h two-builder allocation is superseded. Technical contracts for conditional future AI remain specified, not funded or implemented.

The original planning handoff created Markdown only. The authorized first build now adds the Next.js foundation and V01 journey. Runtime AI, other variants, reports, deployment and competition submission remain outside this milestone. On 25 October the user superseded the CodeRabbit requirement: diff inspection, applicable tests, real browser verification and passing CI determine engineering merge readiness.

On 25 October 2026 the user authorized the next milestone: the twelve locked fictional examples, whole example replacement, deterministic authored outcomes and urgent/unknown safety interruption. This extends implementation authorization only for that slice. Reports, runtime AI, deployment and submission remain later work.

On 25 October 2026 the user authorized the complete printable summary milestone and directed Codex to use recommendations without questions, implement it and verify actual behavior. The scope is full preview, browser Print / Save as PDF, Cancel / Back and report/session clearing, with no selective omission or PDF generation library. Runtime AI, deployment and submission remain later work.

On 26 October 2026 the user authorized release validation and fixes, with recommendations applied without questions. Browser evidence and remaining gates belong in [release verification](release-verification.md). Deployment and competition submission remain later work.

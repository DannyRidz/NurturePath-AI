# Solo builder backlog, revision 3

Updated 23 October 2026 after the user clarified that they alone build the app. Jeremiah has no allocated hours. The user authorized the first T03-T05 milestone on 24 October 2026. Work is limited to the foundation, minimum design primitives and one complete V01 journey; other tasks remain planned. Estimates are builder hours, uncertain by roughly ±30-50%. The earlier A/B allocations are superseded rather than reassigned to an imaginary reviewer.

Committed scope is AUTHORED_SIMULATION: locked fictional cases, one authored plain explanation, inline sources, full-report preview/print, consent/clear and appropriate tests. No public model integration or selective report omission is included. The [roadmap](16-development-roadmap.md) owns dates/capacity assumptions; this table owns effort.

| ID | Task / priority | Owner / committed hours | Dependencies | Acceptance and proof |
|---|---|---|---|---|
| T01 | Competition and solo-scope decisions, P0 | Builder / 2h | User review | Solo scope and known deadline/IP questions recorded; no invented organizer answers |
| T02 | Content/reviewer brief, P0 | Builder / 4h | T01 | Source provenance and actual unvalidated status; no clinical approval assumed |
| T03 | Foundation and contracts, P0 | Builder / 5h | Explicit build authorization | Supported stack, exact catalog/enums, no answer payloads, reproducible build |
| T04 | Minimal design primitives, P0 | Builder / 4h | T01 | Swiss tokens, semantic controls, focus/mobile shell; no extra design direction implementation |
| T05 | Thin authored journey, P0 | Builder / 6h | T02-T04 | One complete fictional path, consent, authored output, clear, one browser test |
| T06 | Guided catalog/review, P0 | Builder / 6h | T05 | Whole-variant switches, clear replacement notice, no personal intake or unsupported permutations |
| T07 | Rules and authored evidence, P0 | Builder / 8h | T02,T03 | Twelve catalog rows/expected outcomes, precise rule/missingness behavior, original source-linked text and actual approval status; no approved AI bundle authoring |
| T08 | Urgent interruption, P0 | Builder / 3h | T06,T07 | Immediate static urgent/unknown-safety behavior, never waits for network |
| T09 | Results and inline evidence, P0 | Builder / 4h | T07,T08 | One clear next step, uncertainty, source details inline; no separate evidence portal or second wording style |
| T10 | Public model service, deferred | Unallocated / 0h | Separate capacity/clinical approval gates | Not delivered in solo core; no SDK, account or Redis service needed for authored deployment |
| T11 | Model selection guard implementation, deferred | Unallocated / 0h | T10 | Not delivered; exact fragment-only safety contract retained for later work |
| T12 | Printable complete summary, P0 | Builder / 3h | T09 | Full preview, explicit share-all-facts warning, Print/Save as PDF or cancel; no field selectors, hidden redactions or PDF library |
| T13 | Session clear and navigation state, P0 | Builder / 3h | T06,T12 | Clear/back/refresh cannot restore old session; no provider-race claim when provider absent |
| T14 | Responsive/accessibility, P0 | Builder / 5h | T06,T09,T12 | Keyboard/focus/contrast/zoom and actual available phone checks, limitations recorded |
| T15 | Boundary/privacy checks, P0 | Builder / 4h | T03,T12,T13 | Variant validation, no personal payloads, URLs/storage/logs clean, exact full-report disclosure; no live Redis test claimed |
| T16 | Complete browser/recovery tests, P0 | Builder / 4h | Applicable T08-T15 | First use, whole-variant switch, urgent/clear, browser print/cancel and mode-unavailable checks |
| T17 | System evidence/self-review, P0 | Builder / 4h | T07,T15,T16 | Applicable typed cases with real n/N; fixture design, execution and self-review labelled same-author, not independent or blind |
| T18 | Formative usability, P0 | Builder / 4h | T14,T16; consenting volunteers | Target five adults using fictional examples, record actual recruitment/n, comprehension and misconceptions; availability unconfirmed |
| T19 | Authored deployment verification, P0 | Builder / 3h | T15-T17 | Known build/headers/logs, fresh-session judge URL and rollback; no external AI/limiter activation |
| T20 | Official deck/evidence, P0 | Builder / 4h | T17-T19 | Template/PDF size, solo build contribution and actual results/limitations, no AI claim |
| T21 | Demo recording/rehearsal, P0 | Builder / 4h | T19,T20 | Under three minutes, captions, authored case, urgent branch, print preview/clear and actual evidence |
| T22 | Final entry check, P0 | Builder / 2h | T20,T21 and separate submission approval | Correct links/fields/team declarations, actual final confirmation later |
| Total committed solo work | | **82h** | | |

Gross capacity at 25h/week to 20 November is about 100h; gross reserve 18h. Before the internal 19 November target, available capacity is approximately 96h and reserve about 14h. Reserve is not automatically an enhancement budget. Recompute from actual start/availability and measured throughput; do not claim the same feature set became twice as quick because only one person builds.

## Deferred or separately funded work

| ID | Work | Additional builder estimate | Unconfirmed dependencies |
|---|---|---:|---|
| X-AI | One-provider reviewed fragment selection: T10 adapter 8h, T11 guards 4h, clinical bundle mapping 4h, deployed limiter/qualification 4h, evaluation execution 4h | 24h total, not in core | Actual clinical/rights approval, provider access, safe shared controls, and four external independent scoring hours if that evidence is claimed |
| X-REPORT | Selective report omission and transitive disclosure tests | 6h | Exact dependency closure, no partial implementation that leaks omitted facts |
| X-STYLE | Second authored style/presentation-pair study | 3h | Core done and enough buffer; no demographic fairness claim |
| X-MODELS | Second/third model comparison | Not scheduled | Requires separate review capacity; no deadline commitment |

Public AI can enter scope only if remaining measured capacity covers the 24h package plus at least 10h contingency and the external gates exist. The present reserve cannot cover that package. Savings, extra hours or a changed deadline must be real and recorded. Do not replace a missing human reviewer with the builder's own blind-score label. Jeremiah may contribute other work if agreed, but no task, time saving or reviewer independence assumes it.

## Completion convention

Keep scope status planned until real work exists. Every task needs evidence of its observable outcome. Mark omitted AI work deferred/not delivered, not passed. Safety/privacy acceptance remains mode-specific; real-world patient deployment is still excluded. Personal intake, accounts, health DB, clinic booking, translations, prediction, FHIR, wearables and dashboards remain outside this deadline scope.

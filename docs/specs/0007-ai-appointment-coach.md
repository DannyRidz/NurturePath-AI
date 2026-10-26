# 0007. AI appointment preparation coach

**Date:** 2026-10-26
**Status:** Proposed
**Authorization:** Capture the recommendation in a plan only. Implementation, provider activation, spending and public AI access are not authorized by this request.
**Readiness:** Product proposal, not yet an approved implementation specification. Resolve the decisions below before building.

## Summary

Add an optional AI coach that helps someone prepare to discuss a fictional example with a clinician. It would draft a short factual summary and three discussion questions. The existing authored guidance remains available and continues to determine every next step.

## Context

The deployed application currently has twelve fixed fictional examples and no runtime AI. The user wants a meaningful AI feature and asked to record the recommended coach before implementation. The user is the sole builder, with no assumed engineering or review capacity from Jeremiah.

The existing AI plan permits only selection of complete approved authored text bundles. Generated summaries and questions are a different capability. This proposal does not silently supersede ADR 0002, the release modes in document 10, the existing privacy contract or ADR 0006's static hosting design. Their implementation contracts must be reconciled if the coach is approved.

## Proposed requirements

These are acceptance criteria for the proposed slice, not additions already approved in the current PRD.

* **CO-01:** On an enabled nonurgent fictional result, offer “Help me prepare for a conversation.” The action is optional and follows a separate AI disclosure and consent step.
* **CO-02:** An actual model call produces a brief summary and exactly three relevant discussion questions using the canonical example facts. Label the output as an AI draft, identify the fictional context and preserve unknown or declined answers without guessing.
* **CO-03:** Never ask the model to determine urgency, diagnose, estimate fertility, interpret tests, recommend treatment, select a care service or set appointment timing. Keep the authored result visually distinct and unchanged.
* **CO-04:** V07 and V08, or any future urgent/critical-safety-unknown case, bypass the coach entirely. Neither a model call nor a network request may delay the existing local safety interruption.
* **CO-05:** Accept only enabled catalog IDs and versions. Derive facts on the server; do not accept arbitrary health answers, free text prompts, names, uploads or conversation history. No patient account or saved history is included.
* **CO-06:** Missing approval, disabled configuration, missing credentials, rejected input, provider refusal, invalid output, timeout or exhausted allowance leaves the authored journey usable. Show an honest unavailable/fallback state and never label authored text as generated AI.
* **CO-07:** Clear, consent withdrawal and whole example replacement invalidate in-flight work and remove the old AI draft. A late response cannot reappear or enter another example's report. Aborting a browser request does not guarantee provider cancellation or prevent billing.
* **CO-08:** Keep the key on the server, bound requests and spending, minimize logs, and disclose what reaches the provider. In-memory app state and a provider's retention policy are separate matters. No anonymity or zero retention claim without evidence.
* **CO-09:** Any later report inclusion requires explicit review and choice. Append a clearly labelled AI section without replacing or omitting authored facts, reasons, sources or limits. Cancelling inclusion preserves the existing report. No automatic saving or sharing.
* **CO-10:** Evaluate the coach against the authored report baseline before making usefulness claims. Record exact model/configuration versions, case sets, attempt counts, failures, fallback frequency, latency, token use and measured cost. Public enablement requires the content, privacy, operational and evaluation gates below.

## Options considered

| Option | Benefit | Tradeoff |
|---|---|---|
| Appointment preparation coach, recommended | Fits the existing complete journey and offers a visible use for generated summaries and questions | New content risks, server support, review and evaluation are needed |
| Select approved authored explanations | Retains the existing finite output boundary | Less generative flexibility; must demonstrate value beyond deterministic selection |
| General medical chatbot or prediction | Broader interaction | Outside this proposal, its data, evidence, clinical scope and operating requirements are not established |

## Proposed decision

Plan the coach first, rather than add several AI features together. Start with one enabled nonurgent fictional example as a thin end to end experiment. Broaden only after the same boundary and evidence hold for each added example. Plain language explanations and comprehension feedback remain later possibilities, not automatic additions to this slice.

Generated medical language cannot be made semantically safe merely by a schema, a prompt or keyword filtering. Existing source links do not constitute approval of generated text. Public enablement needs a qualified content/safety review and an agreed residual-risk protocol; engineering tests alone cannot supply those approvals.

## Proposed journey

1. Finish an existing fictional assessment and read its authored result.
2. Choose the coach action, read the AI/provider disclosure and explicitly consent.
3. Request the draft for this exact example and version.
4. Review the labelled summary and three discussion questions alongside the unchanged authored result.
5. Dismiss, clear or choose report inclusion if that later milestone has been approved and built.

An illustrative question is “What information would be useful to bring to an appointment about this concern?” It is a product example, not a clinically approved output or an implemented response.

## Value sourcing and state

| Value | Proposed source |
|---|---|
| Example ID, answers and reason codes | Current canonical scenario catalog, resolved by the server |
| Eligibility | Explicit enabled-example/content-review registry, defined before implementation |
| Urgency and next step | Existing deterministic rules, never a model output |
| Summary and three questions | Bounded model response grounded in the enabled fictional case |
| Sources displayed | A reviewed local registry; never model-invented URLs |
| Provider/model/content versions | Server configuration and approved content registry |
| Consent and current request identity | Current browser session; transport and server validation still need design |
| Fallback | Existing authored result plus a truthful AI status |
| Report inclusion | Explicit current-session user choice; no persistence |

Proposed states: unavailable or idle, awaiting consent, loading, draft available, and failed with authored fallback. Clear, withdrawal or example change invalidates the current request. Exact schemas, limits, response codes and concurrency behaviour are owed decisions, not left for a builder to invent.

## Decisions to resolve before implementation

| Decision | Required outcome |
|---|---|
| Content and clinical boundary | Define enabled cases, permitted language, review owner, evidence and approval criteria for generated output |
| Provider and model | Choose one currently supported model after checking access, retention, costs, capability and a bounded synthetic experiment; do not reuse old price tables as current evidence |
| Server and hosting | Approve native Next.js on Vercel or a separate server endpoint. The current static export cannot host a secret-bearing model endpoint. Retain the public demo URL and verify anonymous access after any hosting change |
| Input/output contract | Exact request fields, structured output, length/token limits, provenance, semantic evaluation and invalid-output behaviour |
| Consent and request lifecycle | Provider disclosure, withdrawal, invalidation, late-result rejection, cancellation limitations and report handling |
| Public cost and abuse controls | Explicit approved budget, enforceable shared admission/rate/concurrency limits, reservations, provider billing limits, timeouts, retry policy, kill switch and failure behaviour. Review ADR 0004 rather than assume browser-only counters suffice |
| Privacy and logging | Provider processing/retention, geographic constraints where applicable, no case/prompt/output logging by default, minimal operational metadata and verified deployed headers |
| Evaluation and staffing | Frozen fixtures, held-out cases, review rubric, numerical release thresholds and actual qualified reviewer availability. No hidden second reviewer capacity |
| Solo scope and schedule | Re-estimate remaining work and tradeoffs using actual progress. The old 82h core and 24h fragment-selection extension are not estimates for this new coach |

## Build plan after separate authorization

1. Resolve and ratify the above decisions, reconcile the PRD, AI/API/privacy contracts, ADRs and backlog, and obtain explicit build authorization, CO-01 through CO-10.
2. In an isolated nonpublic experiment, prove one complete nonurgent case through server validation, model call, labelled draft and authored fallback. Use synthetic data only, CO-01 through CO-06 and CO-08.
3. Add consent lifecycle, clear/change races, admission limits, failure behaviour and operational shutdown checks, CO-04 through CO-08.
4. Evaluate eligible breadth and report usefulness against the authored baseline. Add optional report inclusion only as its own verified milestone, CO-02, CO-09 and CO-10.
5. Complete review, latest head CI and actual browser/host verification before separately approving public AI enablement. Record model and release versions and prove disable/rollback behaviour, CO-01 through CO-10.

## Verification and evidence plan

| Area | Evidence required |
|---|---|
| Fact fidelity | Every supported/unknown/declined fact preserved; no invented facts or causal claims in the evaluated set |
| Questions and boundaries | Relevant questions, no diagnosis/treatment/timing assertions, no unsupported source claims; qualified review of observed output |
| Safety bypass | Zero provider calls for urgent, critical unknown, disabled or unapproved cases |
| Robustness | Refusal, malformed/oversized output, timeout, outage, budget exhaustion and limiter failure all leave authored guidance usable |
| Session isolation | Clear, revoke, replacement, simultaneous requests and late completion cannot restore or cross-contaminate a draft |
| Privacy and operation | No key in bundles; no personal intake or persistent app health data; observed provider payloads, logs, actual host headers, cost accounting and kill switch |
| Usefulness | Compare comprehension and preparation with the authored report using a defined task/rubric; record actual participants and denominators rather than infer benefit from fluent text |
| User experience | Keyboard, screen reader/manual checks where available, desktop/mobile browser projects, draft review, report choice and unavailable states |

Targets are not results. Numerical thresholds, repeat counts and review staffing must be fixed before model evaluation. A zero-defect test set is not a guarantee about future generated responses.

## Migration plan

Keep the verified authored app available while experimenting. Build with the AI switch off, verify the server-capable deployment separately and retain a known healthy rollback deployment. Publicly enable only eligible cases after separate approval and operational checks. Turning AI off must restore the authored experience without changing its safety rules or requiring a provider request.

## Rationale and consequences

Conversation preparation addresses a concrete communication task within the current product. It can be compared with the existing report rather than judged only by whether a model responds. The cost is a wider content boundary and a new operational surface. This plan does not claim eligibility, competitive advantage, medical accuracy or a completed AI feature.

## Follow-up

Implementation authorization, clinical/content and source-rights review, provider/model selection, approved budget, hosting/API design and measured evaluation remain outstanding. No account, paid resource, key, endpoint or public AI call is created by saving this proposal.

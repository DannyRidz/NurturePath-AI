# 0007. AI appointment preparation coach

**Date:** 2026-10-26
**Status:** In Progress
**Authorization:** Capture the recommendation in a plan only. Implementation, provider activation, spending and public AI access are not authorized by this request.
**Readiness:** Concrete local experiment design added 6 November 2026. Awaiting design acceptance and build authorization. Public deployment remains a separate, incomplete release design.

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


## Local experiment decision, 6 November 2026

The next slice is a local experiment on `127.0.0.1`, with V01 General learning only. This narrows the next build to something the sole builder can verify. Do not migrate the public Vercel project for this experiment. No provider call is permitted in production, CI, an exported preview or a remotely accessible development server.

Recommended provider candidate: Google Gemini Developer API, stable model code `gemini-3.1-flash-lite`, with paid service data terms. Google documents structured output support. This is a candidate for qualification, not a reliability finding or an activated account. Use a direct server REST call with native fetch, Zod validation and no agent framework, retrieval, tools, grounding or automatic retries. The alternative is the existing finite authored selection design, if generated prose proves unhelpful or cannot pass review.

Google's terms restrict clinical practice and medical advice. Keep this experiment to fictional communication preparation. Review provider terms, account region availability and the intended use before activation; uncertainty means no call. Paid services do not use prompts/responses to improve Google's products under the checked terms, but that is not a zero retention promise. Do not substitute unpaid service terms silently. No billing account, key or spending is authorized here.

### Feature design

| Item | Local experiment contract |
|---|---|
| Eligibility | V01 only, catalog/rules/content `sim-1`, plus a server registry entry with `experimentEnabled: true`. This is engineering experiment eligibility, never clinical approval. All other IDs fail before provider admission |
| Browser entry | Optional action on the completed V01 authored result. Existing adult and simulation acknowledgements remain required. No report integration |
| Disclosure | “This optional experiment sends this fixed fictional example to Google to draft conversation questions. It does not assess your health. Google processes the request under the account terms described here. Clearing removes this draft from this app but cannot recall a request already sent.” Show verified account specific retention details before enabling consent |
| Consent | Unchecked checkbox, labelled “I agree to send this fictional example to Google for this draft.” Separate Request draft button. Decline closes the panel without a request. Provider, notice or case change requires fresh consent |
| Request | POST `/api/coach`, JSON only, maximum 1,024 UTF-8 bytes, strict object `{variantId:"V01", catalogVersion:"sim-1", rulesVersion:"sim-1", contentVersion:"sim-1", noticeVersion:"coach-notice-1", consent:true, requestId:UUID}`. Reject extra fields, answer maps and free text |
| Request identity | Browser `crypto.randomUUID()` per attempt. Browser also tracks a monotonically increasing session revision in memory. Capture both on dispatch and require both to match before committing a response |
| Provider input | Server resolves all seven canonical answers from `src/lib/scenario.ts`, their labels from the existing report mapping, and the authored result. Fixed instructions identify fiction, preserve every answer status and prohibit inference, diagnosis, treatment, tests, urgency, service choice and appointment timing. Input is data, never a user instruction |
| Provider output | Strict JSON object `{summary:string, questions:[string,string,string]}`, no additional keys. Summary 1 to 600 Unicode code points; each question 1 to 180, distinct after trim/case normalization. Plain text only, no HTML, Markdown links or URLs. Model gets this schema; server independently validates it |
| Limits | Nonstreaming, one attempt, temperature 0 where supported, lowest documented thinking setting, maximum 1,024 total generated tokens including thinking. Entire request/schema/instructions at most 8,192 UTF-8 bytes. Enforce a 15 second server deadline, 18 second browser deadline and a 16 KiB provider response body cap. Unsupported hard token bounds mean candidate fails qualification |
| Success | 200 `{status:"draft", requestId, variantId, catalogVersion, rulesVersion, contentVersion, noticeVersion, promptVersion:"coach-prompt-1", provider:"google", model, generatedAt, summary, questions}`. Model comes from actual request configuration, generatedAt from server UTC. Validate response again in browser, render through escaped React text |
| Failures | 400 invalid schema; 403 missing/invalid local origin, consent or disabled case; 409 stale versions; 413 oversized input; 429 experiment allowance exhausted or busy; 503 disabled/configuration/provider failure; 504 deadline. JSON errors contain only `{status:"unavailable", code, requestId}` when requestId validated, otherwise omit it. Never echo provider bodies or credentials |
| Cache/logging | All endpoint responses use `Cache-Control: private, no-store`. No prompt, output, request body, IP or credentials in app logs. Operational records contain attempt number, UTC time, model/config version, duration, status and token counts only. Disable SDK tracing; use no SDK retries |

The model can return valid JSON containing poor medical language. Structural checks and a small prohibited pattern check may reject obvious failures, but cannot certify meaning. This experiment is therefore local and requires manual reading of every observed successful output. Do not label a draft as approved or safe merely because validation passed.

### Local access and spending boundary

Serve only on `127.0.0.1`. The route requires a server enable flag, exact allowed Origin `http://127.0.0.1:3000`, JSON content type and a random 256 bit experiment token supplied to the operator through a masked local control. Hold that token in browser memory only and send it in `Authorization`; never a URL or NEXT_PUBLIC variable. Deny absent Origin, cross origin requests and exported builds. Production always denies even if a key is mistakenly present. This is an operator experiment, not a public authentication design.

Recommended activation allowance, subject to explicit approval: at most 60 provider attempts and USD 1 of application reservations for the entire experiment, whichever comes first. One active request across the local server, no automatic retries, duplicate requests consume another attempt. Reserve USD 0.01 before each provider dispatch, without refunds. Qualify current input/output/thinking prices against the stated bounds so worst case charge per attempt is below that reservation; otherwise disable. This does not cap tax, hosting fees or a provider invoice.

Use one local process with an exclusive filesystem lock and an ignored metadata ledger under `.local/coach-experiment/`. Persist only experiment ID, cumulative attempts and integer reserved cents, never case facts, prompts or responses. Update the ledger atomically before dispatch, including failed calls; missing/corrupt ledger after initialization fails closed. Initialization is an explicit operator action, not automatic on restart. Refuse a second process while locked. Stop after a crash and reconcile the ledger before another activation. These controls are local only; do not reuse them in serverless hosting. No patient/session persistence is introduced.

Configuration remains server only: `COACH_EXPERIMENT_ENABLED` defaults false, `GEMINI_API_KEY`, `COACH_EXPERIMENT_TOKEN`, fixed model ID, experiment ID and absolute ledger path. Missing activation evidence, terms/disclosure, current price qualification or any configuration disables dispatch. Keys and tokens stay outside git and shell arguments. Check real provider quota/billing controls before activation; alerts are not a hard cap.

### State and lifecycle

Idle opens disclosure, consent enables Request, Request enters loading, then valid current completion enters draft or failure enters unavailable. Disable duplicate clicks while loading. Manual retry requires another deliberate click and fresh request ID, retaining current consent only for the same case/provider/notice. A local allowance failure remains unavailable.

Clear, Hide, consent withdrawal, panel dismissal, example replacement and navigation away abort the browser request, increment the revision and discard the draft. Hidden content must not reappear from a late completion. Returning to the result starts idle and requires consent again. Keep the authored result and existing complete report usable in every state. No generated output enters printing or a report in this slice.

### Evaluation targets, fixed before model runs

These are proposed experiment gates, not results or public release thresholds.

1. Offline fixtures cover valid output, malformed JSON, extra properties, missing/duplicate/oversized questions, guessed facts, advice, hostile markup, refusal, timeout, invalid versions, ledger failure, concurrent requests and all lifecycle races. Unit tests prove structural/operational rejection; semantic fixtures document reviewer judgments rather than claim automated medical safety.
2. Make ten V01 qualification calls after activation approval, freeze the prompt/schema/configuration, then make twenty fresh V01 evaluation calls. No tuning on the twenty call evaluation set; a changed prompt/model restarts that evaluation. Count every provider failure in the denominator. The remaining thirty attempts are reserve, not an implied larger test set.
3. Require at least 18 of 20 evaluation attempts to yield structurally valid drafts, zero observed invented facts or prohibited recommendations, and all successful drafts to preserve the seven answer states without inference. Sole builder records per draft pass/fail with a reason. This is an engineering/content screen, not independent or clinical approval.
4. For each successful draft compare with the existing V01 report: are the questions relevant, distinct and usable without introducing medical recommendations? Require at least 80% of successful drafts to pass all three. Record actual numerator/denominator and reviewer identity. Do not describe this as measured patient benefit.
5. Record latency p50/p95, provider token usage, failures, reservations and measured provider charge when available. Target p95 under 15 seconds; unavailable billing data stays unknown. Zero calls for V07/V08, all other disabled cases, absent consent and disabled configuration.
6. Verify the complete authored regression suite and coach states in desktop/mobile Chromium and WebKit plus desktop Firefox, including keyboard flow, clear/Hide/Back and delayed responses. CI uses deterministic fake provider responses only. Actual provider evidence is a separate operator run.

Public enablement still needs qualified content and rights review, privacy/terms review, shared admission and approved public budget, a server hosting migration specification, broader frozen and held out cases, independent review and explicit public release approval. Passing this local experiment does not satisfy those gates.

### Ordered next slice and solo estimate

1. Accept this local design and explicitly authorize its build, reconcile the local experiment exception in documents 09, 10, 12 and ADR 0002 without weakening their public boundary (CO-01 to CO-10).
2. Build V01 only with a fake adapter first, exact route validation, local access controls, ledger and draft UI. Keep provider dispatch disabled (CO-01 to CO-08).
3. Complete lifecycle/failure tests, authored regressions and browser verification; review latest head CI through a PR (CO-04 to CO-08).
4. Present exact account terms, model/price qualification, disclosure and USD 1/60 attempt allowance for activation approval. Only then run the thirty call experiment and save its evidence (CO-02, CO-08, CO-10).
5. Decide whether to revise, stop or design a separately approved hosted release. Report inclusion remains deferred (CO-09).

Planning estimate: 16 to 24 builder hours for the disabled local slice and verification, plus 4 to 8 hours for provider qualification and experiment recording, assuming access is available. At 25 hours per week that is roughly one to two working weeks. External review and public migration are excluded and have no committed completion date. Re-estimate after the first complete V01 loop.

### Migration and rollback

Strategy: isolated local feature flag, no production migration. Keep `vercel.json`, the public URL and production export behavior unchanged. Use a separate Next.js experiment app at `experiments/coach/`, with its own app directory, Next configuration and TypeScript configuration, using the root locked Next/React/Zod dependencies. Its `/api/coach` Route Handler runs on Node. Import canonical source exports from the root rather than copy the catalog. Add an explicit local start command bound to `127.0.0.1:3000`; root build and Vercel still build only the existing root app. The experiment UI presents the canonical V01 answers/result and existing report components through the same session provider, with a fixture entry that cannot select any other eligible case. Extract shared components only if needed, preserving public behavior. CI must separately typecheck/build the experiment and prove the production export contains neither endpoint nor experiment UI.

Rollback: stop the local server, revoke the experiment key/token, disable the flag and retain only minimal counter evidence. The deployed authored app has no experiment dependency. Do not claim abort or local deletion erases provider records.

### Checked references

Official documentation checked 6 November 2026. Access and prices have not been tested against the user's account.

* [Gemini 3.1 Flash Lite model](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite), stable code and structured output capability.
* [Structured output](https://ai.google.dev/gemini-api/docs/structured-output), schema subset and requirement to validate semantic correctness separately.
* [Gemini service terms](https://ai.google.dev/gemini-api/terms), paid/unpaid data distinctions and medical use restriction.
* [Current pricing](https://ai.google.dev/gemini-api/docs/pricing), recheck exact account processing rates before activation; no historical price is an approved allowance.
* [Vercel deployment protection](https://vercel.com/docs/deployment-protection), relevant to a future hosted experiment, not proof this local design is publicly protected.

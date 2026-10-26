# AI architecture and release modes, revision 2

Planning update, 26 October 2026: [proposal 0007](specs/0007-ai-appointment-coach.md) captures the user's requested AI appointment coach plan. Generated summaries/questions would expand the boundary below. This proposal does not enable a new release mode or authorize calls; reconcile these contracts and obtain separate approval before implementing it. The deployed application remains authored only.

The user approved the review's planning revisions on 23 October 2026. Public free prose generation is deferred. Optional AI selects complete authored explanation bundles; the app supplies every displayed word. This is assisted content selection, not autonomous medical explanation. Implementation and external service activation remain unauthorized.

Solo revision 3: AUTHORED_SIMULATION is the only committed deadline mode. REVIEWED_SELECTION remains designed but deferred outside the 82h core. Clinical approval alone does not fund it: the additional builder hours, shared-control qualification and any independent reviewer must exist first. Jeremiah supplies no assumed engineering/review capacity.

## Release-mode matrix, canonical mode definition

| Mode | Content status | Runtime | Evidence and demo |
|---|---|---|---|
| AUTHORED_SIMULATION, default | Rules/cards may be draft and explicitly unvalidated | Locked fictional catalog, sourced static wording, no provider call or external AI checkbox; endpoint 503 | Full authored journey and simulation tests. State AI is disabled pending clinical approval |
| REVIEWED_SELECTION, conditional | Enabled variant rules, cards and every reachable bundle have qualified clinical approval and rights clearance | Same catalog; separate AI consent; model returns fragment IDs only, app validates and renders authored text | Actual AI selection metrics only; no clinical validation claim |
| FREE_PROSE_RESEARCH, deferred | Requires separate approved experiment and residual-risk protocol | Not exposed in competition runtime | No promise of per-response medical safety from schemas/keywords/sampling |

Engineering review, clinical approval and rights clearance are separate fields. Developers cannot supply a clinical approval. A guideline's publication is not approval of our derived card. Approval of some variants does not enable the rest; config exposes actual per-variant eligibility. No clinician means authored simulation only, and a material competitive limitation: runtime AI is not delivered. Adapt completion status, deck and video; never fabricate generation or imply a recorded call is publicly enabled.

## Candidate research retained

Dated 23 October 2026, USD per million short standard text tokens. No model benchmark/account test has run.

| Candidate | Documented capability and input/output rates | Revised role |
|---|---|---|
| [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna), [pricing](https://developers.openai.com/api/docs/pricing) | Structured output, $0.10/$0.50 | Primary candidate if content approval and account access exist |
| [Gemini 2.5 Flash-Lite paid](https://ai.google.dev/gemini-api/docs/pricing) | Schema output, $0.10/$0.40 | One conditional alternative if needed and review time is funded |
| [Claude Haiku 5.5](https://platform.claude.com/docs/en/models/haiku-5-5/overview) | Schema output, $0.10/$0.50 short input | Further comparison deferred unless review capacity/reserve permits |

No candidate experiment is in the solo core. If separately funded, evaluate one candidate against authored baseline, not three. The hypothesis is better wording selection, not clinical judgment. If deterministic style selection performs equally well, retain authored mode and report that honestly. Provider capabilities are not medical reliability evidence.

Retain provider retention/paid-free distinctions from the source registry. Use store=false, no tools and no automatic SDK retries; these are not zero retention. Provider changes need revised disclosure/consent and qualification, never silent failover. Record model snapshot/alias and settings.

## Exact permitted output

1. Request contains variantId/style/version/revision/consent only. Server derives canonical answers and rules. Urgent/insufficient variants never invoke a model.
2. Look up at most three eligible cards; verify engineering, clinical and rights states for all reachable fragments. Missing approval means authored fallback, no call.
3. For each eligible variant/style, registry defines exactly two complete approved bundles, concise and standard-length alternatives. Each is one to three fragments in fixed order, preserving all relevant caveats/factors, with no placeholders or health interpolation. Do not enable that variant until this finite mapping exists and is approved.
4. Model sees fictional reason codes, requested standard/plain style and the two complete alternatives. Return only fragmentIds, one to three unique IDs. No summary, rationale, medical advice, URL, free string or next-step field; no extra properties.
5. Accept exact array equality to an allowed complete bundle for this variant/style/contentVersion. Reject unknown/duplicate/missing/reordered/cross-variant or mixed-bundle IDs, refusal, incomplete response and timeout. Add trusted provenance server side. Invalid output uses the predetermined authored default bundle.
6. Render text and sources from the local versioned registry. Never render or stream any other model bytes. Keep deterministic next-step panel unchanged. Label success “AI assisted content selection,” fallback “Authored explanation.”

This makes arbitrary model prose undisplayable; it does not guarantee authored content is medically correct. Approval and content testing remain essential. A valid selection can still be unhelpful; score clarity separately rather than treating valid IDs as comprehension success.

Bounds: at most 3,000 input tokens verified before admission using a supported tokenizer or conservative offline token bound; max_output_tokens=256 including reasoning; reasoning disabled where supported; no tools/uploads/retries; one attempt and eight second deadline. Do not enable a candidate unless those bounds are enforceable. ADR 0004 rechecks price reservations on every model change.

## Retrieval and failure behavior

Exact card/bundle ID lookup, no embeddings, vector database, live ingestion, uploads or agent framework. Source-section locators and approval states live in documents 03/11. A clinician resolves guidance conflicts. Later RAG/paraphrasing needs a separate decision and experiment.

Disabled mode, missing approval/key, stale version, exhausted allowance, limiter failure, invalid/refused IDs or timeout leaves authored education usable. Clear, variant changes and revocation invalidate late responses. Only status/time/token counters enter operational logs; synthetic evaluation outputs are separate artifacts. Public generation remains disabled until clinical/rights, account, shared admission and deployed privacy checks pass.

## Measurement and cost

Measure allowed-bundle membership, version/context, rendering fidelity, provider/fallback attempts, latency/tokens and human-rated clarity with [typed denominators and staffed review](13-datasets-and-evaluation.md). Human sampling is not an online semantic filter.

At assumed 1,500 input and 256 billed output tokens, Luna text cost is about $0.000278 before other fees. This is arithmetic, not a bill. The USD 0.01 attempt reservation is conservative for bounded calls, rechecked against actual rates before enablement. Hosting/Redis traffic charges and billing anomalies remain separate costs.

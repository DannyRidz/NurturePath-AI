# Gemini qualification for the bounded coach trial

Checked 6 November 2026. Governing contract: [specification 0007](specs/0007-ai-appointment-coach.md). Scope: documentation qualification only. No provider request, account inspection, billing change, key creation or public activation occurred.

**Latest follow-up:** The user asked to carry out the remaining qualification and approved trial. A further documentation check identified the Interactions API as a possible alternative, but did not establish the whole billable input bound. [The clarification packet](gemini-provider-clarification.md) contains offline measurements of the exact existing request and the approved public provider question. It was [published on 7 November](https://discuss.ai.google.dev/t/documented-billable-token-bounds-for-gemini-3-1-flash-lite-structured-text/198793) under the authorized `Danny_Ridz` profile; a provider reply is pending. Real dispatch stays disabled; no key was retrieved or credits spent.

**Decision: retain Gemini as the candidate; do not activate.** Documented structured output and advertised prices support further preparation. Account-specific terms, retention, access and the hard combined token bound remain unverified. This is not model performance evidence or permission to spend.

## Starting evidence

PR [#9](https://github.com/DannyRidz/NurturePath-AI/pull/9) was open, unmerged, at head `464b392244d557a85deb2c2f9765fbe8c7510be6` when checked. [Actions run 42212658090](https://github.com/DannyRidz/NurturePath-AI/actions/runs/42212658090) completed successfully for that exact head. The accepted local simulation remains the baseline. No merge is authorized by this qualification task.

## Documentation findings

Official sources were retrieved through indexed search. Direct page retrieval failed with unsupported Markdown content type; search extracts have different crawl dates. Recheck the full current pages before activation. Do not treat an indexed extract as account evidence.

| Area | Finding | Qualification |
|---|---|---|
| Model | The [model page](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite) identifies `gemini-3.1-flash-lite` and structured output support. The [Gemini 3 guide](https://ai.google.dev/gemini-api/docs/gemini-3) also contains a broad preview-status statement. | Keep the exact candidate ID; resolve lifecycle/status inconsistency before calling it stable or freezing a run. No automatic model substitution. |
| API | [GenerateContent REST](https://ai.google.dev/api/generate-content) documents generation configuration, finish reasons and usage metadata. | Plan one direct nonstreaming server request; no SDK/framework, tools, grounding, caching or retries. No adapter added in this change. |
| Structure | [Structured output](https://ai.google.dev/gemini-api/docs/structured-output) documents required properties, additional-property control and array item bounds. | Suitable for a summary and three strings. Unicode length, distinctness, plain text and semantic fidelity still require local validation/review. |
| Thinking | The [GenerateContent thinking guide](https://ai.google.dev/gemini-api/docs/generate-content/thinking) lists minimal thinking for this model; minimal can still produce reasoning tokens. | Candidate setting is `thinkingConfig.thinkingLevel: MINIMAL`, not a promise of zero thinking cost. Do not combine with a speculative numeric thinking budget. |
| Hard output bound | REST describes `maxOutputTokens` as a response-candidate limit; retrieved model-specific evidence does not explicitly establish the required combined ceiling for hidden thinking plus visible output. | **Unresolved activation blocker.** Obtain authoritative evidence for this exact model/API/configuration that total billable generated tokens cannot exceed 1,024. A response-byte cap or post-response counter cannot enforce pre-dispatch cost. If unsupported, this candidate fails specification 0007. |
| Region | [Available regions](https://ai.google.dev/gemini-api/docs/available-regions) lists Brunei. | Regional listing alone does not verify this operator's account, billing country or model access. No region/account inference from timezone. |

## Terms and privacy

The [Gemini terms](https://ai.google.dev/gemini-api/terms) distinguish paid API use through a project with active billing from unpaid processing. Paid prompts/responses are not used for product improvement; that does not establish zero retention. The terms prohibit clinical practice and medical advice and impose adult-use restrictions.

Only the local adult operator and fixed fictional V01 communication preparation are proposed. Whether that intended use satisfies the restriction still needs an explicit recorded review; fictional framing alone does not settle it. No real health details or public users enter this experiment. Record the applicable processing addendum, abuse-monitoring retention/access, deletion limitations and geographic processing details for the actual account before finalizing disclosure. Uncertainty keeps dispatch disabled. Do not paste synthetic prompts into unpaid AI Studio as a workaround.

## Conditional allowance calculation

[Standard paid pricing](https://ai.google.dev/gemini-api/docs/pricing) lists text input at USD 0.25 per million tokens and output, including thinking, at USD 1.50 per million. No batch, audio, tools, paid grounding or explicit cache is proposed.

The following is arithmetic, **not a qualified worst-case charge**. If input is proven at most 8,192 billable tokens and combined output/thinking at most 1,024:

* Input: `8192 × 0.25 / 1,000,000 = USD 0.002048`.
* Output and thinking: `1024 × 1.50 / 1,000,000 = USD 0.001536`.
* Total: `USD 0.003584` per attempt, below the proposed USD 0.01 reservation.
* Thirty planned calls: at most USD 0.10752 under those assumptions; USD 0.30 reserved.
* Sixty total attempts: at most USD 0.21504 under those assumptions; USD 0.60 reserved. The 60-attempt limit binds before the USD 1 reservation limit.

Specification 0007 limits the entire request to 8,192 UTF-8 bytes, not tokens. Do not silently equate those units. Establish a conservative tokenizer/provider-overhead bound for the exact serialized text/schema/system instructions before approving the input estimate. A token-count API request also needs separate provider-call authorization. Recheck account rates, currency/taxes and available quota/billing controls; application reservations are not an invoice cap. Alerts do not stop charges. Failed/aborted attempts remain reserved; never automatically refund or retry.

## Proposed activation packet, still incomplete

Before requesting activation approval, complete and review this evidence without exposing secrets:

1. Record operator/account region, paid project status, permitted intended use, applicable terms/processing addendum and retention details. Record review date and reviewer, not credentials or billing identifiers in git.
2. Resolve exact model status, request parameter compatibility and provider-enforced total generated-token ceiling. Establish the input-token bound and recalculate cost. Reject any incompatible configuration rather than relax limits silently.
3. Prepare a separately reviewed local-only adapter change with mock-transport tests: strict provider schema, 8,192-byte outbound cap, one candidate, 1,024 generated-token ceiling, 15-second deadline, 16 KiB response cap, refusal/truncation rejection, no retries and no prompt/output/secret logs. Keep real dispatch disabled. The existing simulation cannot dispatch to Gemini.
4. Freeze exact request/prompt/schema/configuration versions and hashes, canonical V01 inputs and seven answer states, authored report comparator, per-draft rubric and evidence format. Reuse the numerical gates in `experiments/coach/AGENTS.md`; do not tune on the twenty fresh evaluation calls.
5. Finalize provider disclosure and fresh consent separately from the mock notice. Include provider processing and cancellation/billing limits; never claim anonymity or zero retention without evidence.
6. Prove disabled/missing-evidence behavior, ledger reservation before dispatch, one active request, restart/crash handling, kill switch and production/export isolation with deterministic transports and browser regression checks. Rehearsal counters cannot be mistaken for a fresh paid allowance; retain/reconcile evidence explicitly.
7. Present the concrete implementation and account evidence for **separate explicit authorization** of local provider activation and the proposed USD 1 / 60-attempt maximum. Initial sequence remains ten qualification calls, then twenty frozen evaluation calls; thirty reserve attempts are not automatic extra runs. Public AI remains outside that approval.

## Later run record

No run has started: provider attempts 0, measured cost not applicable, model quality/latency unknown. Once separately authorized, record every attempted call, including failures: phase/sequence, UTC time, exact requested and returned model/version, configuration hash, duration/status, validation/reviewer decision and reason, prompt/candidate/thinking tokens, reserved cents and measured charge when available. Keep secrets and provider bodies out of operational logs. Store manually reviewed synthetic drafts only through an explicit evaluation-artifact decision, outside the anonymous counter ledger. Compute denominators from all attempts; missing usage/charge stays unknown. Report p50/p95 with the method and sample count. Passing this local screen supplies neither clinical approval nor public release approval.

## Change verification

This qualification changes documentation only. Runtime behavior, mocks, notices, deployment and account configuration are unchanged. Reviewed source links and allowance arithmetic; no browser behavior changed and no new model tests were run. PR #9's passing CI applies to its recorded head, not to this new document.


## Implementation and account continuation, 6 November 2026

The user ultimately selected Gemini and approved use of existing AI Studio credits for a maximum of 60 local V01 attempts and USD 1 in application reservations, conditional on passing account and cost checks. The paid tier, prepaid availability and auto reload off were observed through the authenticated AI Studio UI. No account IDs, balances or keys are recorded in this public repository. No billing change was made. A generic existing key was visible but was not copied or used; no new credential was created.

The implementation now includes a disabled Gemini adapter, exact request hashing, expiring activation evidence, direct REST transport, strict response/provenance checks, no retries, anonymous reservations and truthful Gemini browser states. The public export still excludes it. This supersedes the earlier statement that no adapter exists, but does not mean dispatch is qualified.

**Cost qualification remains no-go.** Minimal thinking does not guarantee zero thought tokens. General documentation and first party support discussions describe combined caps, but the retrieved material does not settle that hard bound for this exact model/API/configuration. Do not copy Interactions API `max_output_tokens` guarantees into the GenerateContent contract. The [token counting clarification](https://discuss.ai.google.dev/t/gemini-api-counttokens/188451) also says `countTokens` excludes output schemas in generation configuration. A token count alone cannot establish the whole billable input bound here. The larger conditional input ceiling of 16,384 plus 1,024 combined generated tokens would yield USD 0.005632 per attempt at the checked rates. It remains conditional, not a proven maximum.

No activation record has been manufactured. No model inference or token counting call has been made, and no credits were spent by this work. Before running the approved trial, obtain authoritative model specific bounds or approve a separately qualified Gemini model/configuration through an explicit spec update. Continue to count every admitted failure and do not infer safety or usefulness from synthetic transport tests.

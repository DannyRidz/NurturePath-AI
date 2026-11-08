# Review, feat/rehearsal-p3, 2026-11-08

**Reviewed by**: gpt-6-astra, fresh review task (author model unavailable)
**Scope**: Final pass: 14 project source/configuration/test/documentation files, uncommitted P3 working tree; initial pass: 10 files
**Verdict**: Approve after follow-up fix (initial working tree: Changes requested)

## Summary

Reviewed the new Gemini adapter, frozen-fixture trial runner, local operator command and their changes to the rehearsal contracts, admission and service. The explicit authorization covers local synthetic P3 calls under a new lifetime 150-attempt / USD 3 estimated-reservation allowance, without an invoice cap or reset; this review does not authorize public typed rehearsal or personal intake. One verified phase-gating defect allows an incomplete prerequisite artifact to be approved. No provider calls, paid Redis operations or production operations were performed during review.

## Major

### 🟠 Incomplete prerequisite artifacts can unlock the next paid phase, `scripts/rehearsal-p3.mjs:211`

**Problem**: `review-smoke` and `review-qualification` only require each existing JSONL row to have `outcome: expected` and matching configuration/fixture hashes. They do not establish that all four smoke slots or twenty qualification slots completed, or even that the rows identify unique expected slots. The next-phase guard checks the resulting artifact hash but likewise does not check a complete successful prerequisite. A partially written or truncated artifact can therefore pass both gates.

**Why it matters**: The operator must finish and review each phase before spending on the next. The run loop normally retains all planned slots, but interruption or artifact-write failure can leave a proper prefix of successful rows. A hash proves that the file is unchanged, not that the prerequisite was completed. This can bypass the intended engineering screen and misstate its denominator without exceeding the separate global allowance.

**Reproduction**: Evaluated the exact review predicate with a one-line JSONL record identifying `Q1`, slot 1, with `outcome: expected` and the matching configuration/fixture hashes. The guard returned `false` for rejection even though the manifest requires four smoke slots or twenty qualification slots. The subsequent prerequisite code accepts the hash of that same incomplete file. This deterministic check involved no provider, Redis or credential access.

**Suggested fix**: Validate the complete canonical manifest, including exact unique ordered fixture/slot identity, expected outcomes and result metadata, before creating a review and again when consuming it. Require and validate a complete matching summary; bind both artifact and summary hashes into the review. Add truncated, duplicate, incorrect-slot and absent-summary regression cases.

## Strengths

- The live transport requires an exact registered synthetic tuple before fetch, reconstructs fixed facts and goals, bounds request/response size and total duration, and validates model, finish state, usage and feedback before successful settlement.
- Real and simulation profiles have distinct versions, configuration hashes and provenance. Existing HTTP routes remain wired to simulation; no live provider import or activation flag enters the public application.
- The operator path uses hidden credential input, a fixed local Unix-socket store, AOF with synchronous persistence, a single approved release namespace, an exclusive durable initialization marker and fixed lifetime counters. No refund/reset command or production counter access is introduced.
- Unknown provider/settlement outcomes retain reservations and pause admission. The trial keeps all sixty evaluation slots in its denominator and does not claim human-rubric or clinical qualification from machine outcomes.

## Test coverage

Read all new and changed test code. The parent reports 138 passing unit tests including isolated Redis suites; the browser suite was still running at the initial review. Deterministic tests cover registered transport context, arbitrary-text rejection, two-round receipts, provenance separation, usage/output rejection, response deadline/size, terminal refusal, full evaluation denominators and activation fields. The uncovered operator prerequisite-validation path is the concrete finding above. Real model qualification and subsequent account/operating/release checks are not inferred from these tests.

## Follow-up resolution, 2026-11-08

Reviewed `validatePhaseForReview`, both operator call sites and the new regression test. The helper now requires the exact complete ordered smoke/qualification manifest, unique request IDs, valid live result/provenance/usage, expected receipt-issued metadata, and a successful matching summary with consistent counter deltas. It runs both when recording the engineering review and when consuming a prerequisite. Review records bind both the artifact hash and summary hash. The original Major finding is resolved.

Independently ran the focused regression: one test passed, nine unrelated tests skipped. It exercises complete smoke and qualification results and rejects truncated, duplicate, wrong-slot, incorrect receipt metadata, missing-summary and inconsistent-counter cases. The parent reports final results of 139/139 unit/service tests with both isolated Redis suites, 60/60 simulated browser cases across five projects, passing lint and root/rehearsal type checks, successful native/rehearsal/export webpack builds and passing export isolation.

The parent also reports fresh billing/terms activation evidence and one-time initialization of the separate local allowance with zero attempts, zero reserved cents and zero issued sessions; this reviewer did not access that store or make provider calls. No open major, blocker, minor or nit remains from this pre-dispatch review. **Approve** proceeding with the explicitly authorized local synthetic P3 trial through the reviewed operator gates. This is engineering approval of the trial implementation, not evidence that Gemini qualifies, an invoice guarantee, clinical approval, or permission for public typed rehearsal/personal intake. Preserve all real outcomes and denominators, and require actual reviewed prerequisite artifacts before advancing phases.

## Temporary local credential handoff check

Read the ignored `.local/rehearsal-p3/handoff.mjs` helper and the operator command's bounded non-TTY stdin input support before the parent submitted a credential. For the stated single local operator submission, no concrete credential-exposure or cost-control blocker was found: the helper binds loopback, checks exact Host/Origin, uses a rotating nonce and fixed phase allowlist, limits the request body, and transfers the key through child stdin rather than arguments, environment or files. Its response does not echo the key, and captured child output is redacted before status-file persistence. The underlying command still enforces activation, prerequisite review, exclusive phase artifacts and the same lifetime Redis counters.

This was source inspection only; the reviewer neither read a credential nor submitted the form nor made provider calls. The helper is temporary operator tooling, not a public application route or a replacement for the reviewed CLI gates, and should be stopped after the handoff work.

## Prompt-v2 allowance rebind check

The parent reports four completed prompt-v1 smoke attempts with eight reserved cents and no pending operation, followed by an engineering finding that some follow-up questions addressed the learner rather than being questions the learner could ask. Read the prompt/notice-v2 refinement and the new `rebind` branch before its invocation. The refinement changes the reviewed configuration while retaining the frozen evaluation manifest; it is not a qualification result.

No concrete counter-reset or dispatch blocker was found in the rebind code. The command checks the approved packet, exact old/new configuration and expected attempt count, then atomically compares old configuration, attempts, reserved cents, enabled state and absence of a pending request. The script's only Redis mutation is the existing budget's `configuration` field; it does not write counters, allowance limits, enabled state, session totals or a new namespace. It subsequently appends configuration-history metadata. A failed history append requires reconciliation, but cannot itself refund attempts or dispatch a provider call. Old configuration artifacts must remain archived as planned, and the subsequent smoke/qualification/evaluation calls still pass the original activation and lifetime admission gates.

This assessment is source inspection, not a test against the funded store. The reviewer did not access credentials, invoke rebind or make provider calls. It supports rebinding the same allowance for the authorized pre-qualification prompt refinement, preserving the reported four prior attempts and eight reserved cents; it does not authorize an allowance reset or imply a successful v2 content screen.

## Prompt-v3 investigative trial check

The parent reports that v2 smoke and qualification passed structural checks but failed the engineering content screen because a numbered placeholder was interpreted as a specific reproductive-health topic. No frozen evaluation calls had occurred. Reviewed the v3 prompt/notice and `validateCommunicationContent` change against that failure. The added guard rejects the listed health-topic terms unless already present in current wording and rejects fact IDs not literally present in that wording. It runs during provider-result parsing and profile decoding before successful settlement, and again at live-envelope validation. A guard failure retains the reservation and pauses admission through the existing error path.

Independently ran all twelve Gemini tests: twelve passed, including the new numbered-fact/topic regressions and reservation/shutdown assertion. No concrete new dispatch, credential or counter blocker was found. The guard is deliberately narrower than a semantic content review; passing it does not establish that every unsupported topic or misleading inference has been eliminated. The v3 investigative smoke and requalification still require content screening before any frozen evaluation is allowed.

This review supports the authorized local investigative trial using the same lifetime allowance and preserving the parent-reported twenty-eight prior attempts and fifty-six reserved cents. Additional investigative calls must remain counted, including the failed-content-screen runs. No provider calls, credential access or funded-store operations were performed by this reviewer, and no public rehearsal/personal-intake permission is implied.

## Final pre-PR review

Reviewed the current complete project diff and new files, including the extracted initialization/rebind Lua, their new ephemeral-Redis tests, the v3 adapter/validation, trial prerequisite checks, operator command, root instructions, scope and operations documentation. The added Redis regressions check that initialization cannot reset existing totals and that rebind changes only configuration while rejecting mismatched counters, shutdown and pending work. No further concrete blocker or major/minor finding was identified.

The operations and scope records distinguish structural passes from failed engineering content screens and state that v3 investigative smoke passed while repeat qualification and held-out evaluation remain incomplete. The parent reports thirty-two lifetime attempts and sixty-four reserved cents, with no pending operation at smoke completion. These are reported operator observations, not an independent funded-store read by this reviewer. The failed earlier runs remain part of the lifetime history.

**Final code-review verdict: Approve** for a PR containing the isolated local trial implementation and its honest partial-results record. This is not a claim that the P3 model qualification/evaluation milestone is complete. Automatic approval review has required specific authorization for the next browser credential handoff; that authorization remains pending and this code-review verdict does not grant it. Do not dispatch the dependent paid phase until that approval is supplied.

At this final review, the parent reports 143 passing unit/service tests including both ephemeral Redis suites and successful current native/rehearsal webpack builds. The sixty-case browser rerun and export verification were still running. Finish those checks and inspect actual CI results for the eventual latest PR head before claiming merge readiness. The reviewer made no provider calls and accessed no credentials, funded local store or production service.

## Prompt-v4 unsupported fact-reference fix

Reviewed the two-file follow-up after the parent reported that v3 qualification stopped at Q3 round one: the provider supplied `Q03` for the vague phrase “fictional information 3,” and the existing validator rejected it. Reported lifetime totals are now thirty-seven attempts and seventy-four reserved cents, with admission paused and the failed attempt pending reconciliation. The held-out evaluation has not run.

The change advances prompt and notice together to v4, requires empty `factIds` in the instructions and constrains the provider response schema with `maxItems: 0`. The configuration hash includes these changes. The new request regression checks the actual serialized provider schema, while the existing response regression continues to reject invented fact references. Independently ran the Gemini regression file: all twelve tests passed. No concrete blocker or new correctness issue was identified in this narrow fix.

**Code-review verdict: Approve** for the fix. This is not proof that the provider will pass a fresh qualification, and it does not resolve or reopen the paused funded store. No reconciliation/recovery command was included in this reviewed change; further calls require a separately reviewed path that preserves the failed attempt and all thirty-seven admissions/seventy-four cents. Qualified content review, operator/notice evidence and worldwide tester release readiness remain incomplete. The reviewer performed no provider, credential or funded-store operations.

## Explicit prompt-v3 failure reconciliation review

Reviewed the subsequently added `reconcile` operator branch, `reconcileLocalRehearsalScript` and Redis regression. The branch is restricted to the recorded prompt-v3 configuration, pending request and exact thirty-seven attempts/seventy-four reserved cents. It reads the preserved twenty-slot qualification artifact and summary, checks the recorded failed Q3 slot and response/model/finish state, validates observed usage, and writes an exclusive synced audit record before attempting the metadata transition. The atomic Lua operation again checks the exact old configuration, counters, disabled state, pending request and 150/300 lifetime limits, then changes configuration/enabled state and removes pending. It does not refund counters, create an allowance, reopen the failed session or make a provider call. Replaying the transition fails its old-state checks.

An initial edit accidentally inserted an extra script argument into four existing rebind test commands, which would make Redis reject their `numkeys` argument. Reported this concrete test defect; the author removed those arguments. Inspected that correction and independently ran the complete rehearsal Redis test file against a new disposable Unix-socket Redis process: all seven tests passed, including initialization, rebind and reconciliation. The first sandboxed attempt could not start Redis; the approved escalated rerun passed. Neither run accessed the funded store or production Redis.

**Code-review verdict: Approve** for this specific recorded reconciliation. No concrete blocker remains in the reviewed recovery change. This verdict is not a generic recovery/reset approval or evidence of subsequent qualification. The preserved failed response, observed usage and lifetime totals remain part of the record, and any later model/tester release claims must use actual evidence. No credentials or provider service were accessed by the reviewer.

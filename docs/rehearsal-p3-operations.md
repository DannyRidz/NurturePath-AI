# Local P3 Gemini trial

## Authorization and boundary

On 8 November 2026 the user explicitly approved the local synthetic P3 Gemini trial and a separate lifetime ceiling of 150 admitted attempts and USD 3 in estimated application reservations (two cents per admission). This is not an invoice cap. There is no refund, reset, automatic retry or top up. The original public coach, its 60 attempt / USD 1 allowance and its production configuration remain unchanged.

The paid entry is the local operator command `npm run rehearsal:p3`. It accepts only a phase, never arbitrary practice text. Both the runner and provider adapter restrict requests to the frozen synthetic fixture registry. The browser workspace remains the visibly simulated P0 through P2 journey. There is no live rehearsal HTTP endpoint, public typed field, personal intake, study recruitment or public activation in this change. Paid dispatch is rejected in CI, Vercel and export environments.

## Account and provider review

The existing AI Studio billing account was refreshed and read on 8 November. Paid prepaid service, sufficient available credit for the approved reservation allowance and auto reload off were observed. No billing change, credit purchase or new credential was made. Account identifiers and balances are not recorded here. A key must belong to a project associated with that active paid account; key entry is hidden and memory only.

The exact intended use is an adult operator testing authored, invented V01 communication questions. It does not provide medical answers or operate in clinical practice. The [Gemini terms](https://ai.google.dev/gemini-api/terms) were read from Google's current first party Markdown after the web reader failed to handle that format. The terms restrict clinical practice and medical advice. Paid processing does not train Google products on the prompts/responses, but permits limited abuse/legal retention and international processing. This engineering use review is not legal or clinical clearance and supplies no public typed-text privacy approval.

The [current standard Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing#gemini-3.1-flash-lite) lists USD 0.25 per million text input tokens and USD 1.50 per million output tokens including thinking. The transport requests `gemini-3.1-flash-lite`, one candidate, temperature zero, MINIMAL thinking, JSON output and maxOutputTokens 1536. It uses no tools, search, caching, history, uploads, streaming or retries. A reviewed profile accepts observed input up to 16,384 tokens and combined output/thinking up to 1,536, with a 15 second total deadline, 16 KiB serialized request and 32 KiB response caps. Token observations and reservations are estimates, not authoritative pre-dispatch billable ceilings or settled invoices. Missing/invalid usage or output pauses admission for reconciliation.

The configuration hash binds the actual model, full system instructions, schema/settings, complete canonical facts, goals, rubric and live notice/prompt versions. The fixture hash separately binds all qualification and frozen evaluation inputs/actions. A local activation record binds both hashes, the user's approval, account/intended-use checks and a review expiry of at most seven days. It contains no credentials. It is operator evidence, not a provider or legal certification.

## Persistent local admission

P3 uses a separate local Redis primary, bound only to an owner-only Unix socket under ignored `.local/rehearsal-p3/store`. Append-only persistence and `appendfsync always` preserve totals across process restarts. No production Redis credentials or public coach counter commands are used. All commands are metadata only. The stable namespace is `{nurturepath-rehearsal}:gemini-local-1`, with hard limits 150 attempts and 300 reserved cents. Sessions and rate metadata expire; budget totals do not.

`init` checks reviewed activation evidence and creates the allowance once. An exclusive durable creation marker and an atomic absent-key check prevent normal reinitialization. Missing, stale, corrupt or pending state stops dispatch; the runner never deletes a socket, discards its AOF, resets totals or initializes a replacement namespace to recover. Do not remove the store or marker to bypass exhaustion. Preserve them with your local operator records. AOF loss or unknown settlement requires explicit investigation, not a new allowance.

The existing atomic admission primitive validates session/round/expiry, configuration, duplicate request IDs, one active global request, two attempts per session, five starts and ten admissions per client per minute before consuming both counters. A daily HMAC pseudonym represents the local operator without collecting a real client IP. Tickets and original-question receipts exist only in runner memory and are omitted from saved result artifacts. Provider keys and signing secrets are never written to files, arguments, logs or browser assets.

## Commands and phase ordering

Set `REDIS_SERVER_BIN` and `REDIS_CLI_BIN` to your local Redis binaries. The locked root dependencies supply the TypeScript loader. Commands are run from the repository root:

* `npm run rehearsal:p3 -- config` prints the exact configuration and fixture hashes offline.
* `npm run rehearsal:p3 -- init` creates the approved local allowance once, enabled for fixture trials only, after valid activation evidence exists.
* `npm run rehearsal:p3 -- status` reads only metadata and totals.
* `npm run rehearsal:p3 -- smoke` runs two two-round synthetic sessions, at most four admissions.
* `npm run rehearsal:p3 -- review-smoke` records an explicit engineering content screen after validating the exact complete four-slot artifact, summary and counters. It cannot certify clinical quality.
* `npm run rehearsal:p3 -- qualification` runs the ten frozen two-round qualification sessions after the matching smoke review.
* `npm run rehearsal:p3 -- review-qualification` requires the exact complete twenty-slot artifact and summary, and binds both file hashes in the review record.
* `npm run rehearsal:p3 -- evaluation` consumes that reviewed qualification and runs the separate thirty-session, sixty-slot frozen evaluation. It never tunes on evaluation responses.
* `npm run rehearsal:p3 -- rebind` applies an explicitly reviewed configuration change to the same allowance only when the exact previous hash/counters match and no request is pending. It changes only the configuration hash, preserves reservations and enabled/shutdown state, and appends metadata history. It cannot reopen an uncertain disabled allowance. Archive old synthetic evidence without overwriting it before a new configuration run.
* `npm run rehearsal:p3 -- disable` stops new admission without refunds; it can run while a trial holds the operator lock. In-flight requests may still bill.

Paid phase commands prompt for the existing paid-project Gemini key on hidden terminal input. Never paste it into chat, a command argument or a file. Each phase is created with exclusive file creation; existing phase artifacts are never overwritten to retry a failure. Any recovery or configuration revision must reconcile actual usage and preserve lifetime totals before a separately recorded continuation. There is no automatic recovery or reenable command.

Provider requests are deliberately paced. The runner preserves every planned slot, including pre-admission blocks, terminal denials, unexpected results and dependent uncompleted slots after uncertainty. Unsuccessful first rounds never receive invented receipts to force round two. Evaluation version 2 corrects the earlier manifest's terminal follow-up to send the still-current round one ticket, which can be denied as closed without fabricating a receipt. This correction was frozen before any provider call.

## Evidence and remaining gates

Synthetic result and observation artifacts are saved only under the ignored operator directory with owner-only permissions, separately from Redis operational metadata. Console output contains phase/fixture IDs, statuses, counts and summaries, never practice text, generated prose, provider bodies or credentials. Non-success API error bodies are not retained as free text. Review output artifacts locally before approving a phase.

Report planned-slot success over all sixty evaluation slots, actual provider results over invoked attempts, reservations separately from dispatches, coached output counts/goal/round coverage, failures, duration sample count/p95 and observed estimated charges. The report must retain missing/unknown usage. Current public usage is not inferred from historical counts and is not read by this isolated runner; combined public/local usage is unknown unless an authorized read of the public store is recorded.

Human rubric scores and qualified medically adjacent review remain separate. The helper always reports `qualified: false` and human rubric review pending. An engineering screen of valid synthetic responses is not evidence of learned skill, clinical readiness, public privacy clearance or comparative benefit. B3 through B5, public activation and P4 through P6 remain later work. Native OS print checks from P1 remain manual.

## Initial live smoke continuation

The first configuration (`rehearsal-gemini-prompt-1`, hash `a8e156e9c1ee5412bb3a2cd9644d22c88d3b1e2eab43649fad1a705384658158`) completed four structurally valid smoke outputs using four attempts and eight reserved cents. Observed token-based estimated charges were USD 0.002338. Engineering content inspection did not approve that coaching presentation: follow-up questions addressed the learner rather than becoming questions they could ask a professional, and one phrase generalized symptom absence. The outputs and failed engineering screen are retained under the ignored version archive; they are not removed from lifetime totals or treated as qualification success.

Before qualification or any frozen evaluation call, prompt and notice advanced together to version 2 (hash `218f828a48e5d0dd00134ccd559463cf8289a41f6e09e08091f5be7500155f8c`). Instructions now require learner-perspective takeaway questions, preservation of already clear wording, no factual paraphrase and no internal goal IDs in comments. The same namespace was rebound under an atomic exact-counter guard, retaining all four attempts and eight cents. The held-out evaluation manifest remains version 2 with hash `15e84d01bc50d766eb094d90d2a15ccb83b2e84e63dd71cafc1f3d0548df0517`; it was not tuned on provider evaluation responses.

A temporary loopback-only, one-use credential handoff was reviewed for this operator run because computer-use access to Terminal was unavailable. It enforces Host, Origin, nonce and phase checks, sends the in-memory generic paid-project key only through helper stdin, and stores only redacted operational metadata. The production key is not used. This temporary handoff is not a product endpoint or public browser feature and must be stopped after the trial.


## Qualification refinement and current evidence

Version 2 completed another four smoke calls and twenty qualification calls. All twenty qualification responses passed structural checks, but engineering inspection rejected the batch. Some responses inferred clinical topics or fact references from placeholder numbers. One response interpreted information 7 as a supplied duration of difficulty conceiving, although the canonical answer supplies no duration. All outputs and the failed screen are retained in the version archive. Lifetime totals reached 28 attempts and 56 reserved cents.

Before any held out evaluation call, prompt and notice advanced together to version 3, configuration `76bb350fcebd1946ae043d1340416b19109d95d4a5801ca133ac1079775f30ae`. Instructions explicitly prohibit mapping bare numbers to facts or introducing health topics absent from the current practice question. A narrow deterministic regression check rejects the observed topic and fact reference failures before successful settlement. Content inspection remains required because this check cannot establish complete semantic safety.

The same allowance was rebound at exactly 28 attempts and 56 cents. Four investigative smoke calls then passed structural and engineering content inspection, covering both goals and rounds. This smoke used USD 0.0020365 in observed token based estimates, with p95 1,415 ms. Totals are 32 admitted provider attempts and 64 reserved cents, with admission enabled and no pending request at smoke completion. These four calls and the planned twenty call repeat qualification use 24 of the 30 investigation slots. Qualification and the sixty slot evaluation remain pending. Human rubric scores and qualified review remain pending.

On continuation, automatic approval review required specific authorization for entering the existing generic paid project key into the temporary loopback credential handoff. The next funded phase is awaiting that authorization. The listener is restricted to `127.0.0.1:59439`, and the proposed transfer passes the key through hidden helper stdin. The approved provider allowance remains the same.


## Engineering verification

The complete 143 test unit and service suite passed, including real atomic operations against isolated ephemeral Redis stores. Root and rehearsal type checks, lint, native root and rehearsal webpack production builds, static preview webpack export and export isolation checks passed. The Gemini regression file passed all twelve tests after the final reporting change. All 60 browser checks passed and cover the full local simulated journey across desktop and mobile Chromium and WebKit, plus desktop Firefox. Native operating system print dialogs and human content scoring remain manual work.


## Worldwide tester continuation

On 8 November the user requested continuing until the app is ready for colleagues worldwide to test live rehearsal. The requested audience is worldwide, with a common tester experience rather than individual tester configuration. Actual provider availability and the B3 through B5 release evidence still require verification. The operator contact, processing notice, qualified content review and hosted tester allowance have no completed evidence in this record. The separate proposed 30 attempt / USD 0.60 tester allowance has not received specific approval and has not been created.

A subsequent attempt to restart the temporary credential helper was rejected by automatic approval review. The review required explicit approval of the generic key transfer through `http://127.0.0.1:59439/` into hidden runner stdin, and judged the user's general continuation instruction insufficient. A specific approval question was sent. No new provider call occurred. A read of the durable local allowance confirmed enabled admission, no pending request, 32 attempts and 64 reserved cents. P3 qualification and evaluation remain incomplete.

The colleague readiness sequence is to finish and inspect P3 evidence, resolve the typed text notice and provider availability requirements, obtain qualified content review, establish the specifically approved hosted allowance and protected access, then verify actual deployment, both coaching rounds, worksheet printing, clearing, failure behavior and shared shutdown. Final tester instructions must identify the fictional adult scope and the measured limitations. Completion must be recorded against actual evidence before inviting testers.


## Approved handoff and qualification failure

The user explicitly accepted the described loopback credential transfer and local qualification/evaluation allowance on continuation. The handoff succeeded. Qualification dispatched five calls. Four responses passed validation. The fifth response supplied fact ID Q03 for the vague current phrase fictional information 3, which contains no literal fact ID. The unsupported fact reference validator rejected it before successful feedback settlement. The remaining fifteen slots were retained as uncompleted. The frozen evaluation was not started.

The complete qualification artifact and summary are retained under the ignored operator directory. Durable totals are 37 attempts and 74 reserved cents. Admission is paused with pending request `9a43df4f-620c-43c3-ac40-460b6817cb4c`. The rejected response includes observed provider usage of 1,230 input tokens and 163 output tokens, total 1,393, with STOP and the expected model. Its token based estimated charge is USD 0.000552. The phase summary conservatively includes this failed response in unknown usage because it lacks a validated result envelope. The observed usage must remain available during explicit reconciliation.

The temporary listener was stopped and the key cleared from agent memory after the failure. No reservation was refunded and no allowance was reset or reopened. Continuation requires a reviewed reconciliation path preserving the exact counters and failure, plus a configuration revision that prevents unsupported fact references at generation. The latest qualification does not satisfy B4. Worldwide live tester readiness remains incomplete.


## Generation schema correction

The unsupported Q03 response exposed a mismatch between instructions and the generation schema. Instructions prohibited inferred references, while the schema still offered all seven IDs. The local trial schema now limits factIds arrays to zero items, and prompt and notice advance together to version 4. Configuration is `442a4fbcdb44f04ff7409e32b7c248839ba44a2a253b78298301b767fb6adfef`. The request regression asserts this generation constraint. All twelve Gemini tests, lint and root type checking passed. This correction has not been verified by a live call. The funded store retains the previous configuration, paused state, pending request and all 37 attempts / 74 cents. A deliberate reviewed reconciliation remains required before changing that store.

The user's request to complete worldwide tester readiness supplies continuation authorization. It supplies no actual qualified reviewer or operator contact, and the recorded hosted tester allowance remains a proposal. These gaps remain explicit release dependencies under specification 0009. Engineering checks cannot supply those external facts.

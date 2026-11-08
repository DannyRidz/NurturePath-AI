# Local conversation rehearsal, P0 through P2

Authorization: user instruction on 8 November 2026, continuing draft PR #14. Specification 0009 governs. B0 is closed only for P0 through P2 using simulated responses. The original public app and its lifetime allowance are unchanged. B2 through B5, paid qualification, public typed rehearsal and personal intake remain disabled. No production counter operation, provider call or spending is part of this work.

## Run locally

Use the locked root dependencies, then `npm run build:rehearsal` and `npm run start:rehearsal` (or `npm run dev:rehearsal`). Set `REHEARSAL_LOCAL_TOKEN` to a locally generated 64 character hexadecimal access token in your terminal environment. This is a simulation access token, never a provider secret. Enter it only in the local operator access field. The launcher binds 127.0.0.1:3002, removes inherited provider/store credentials and refuses Vercel/export operation. Do not expose this workspace through a tunnel. There is no provider transport or activation command.

Complete the existing V01 written journey, then choose Start local rehearsal. Both goals, two simulated feedback rounds, editable worksheet questions, explicit selections, ordering and a separate sheet preview are available. Feedback is deliberately authored and labelled simulation, not adaptive model output or a demonstration of learning benefit. Rejecting the simulation agreement still permits writing, selecting and printing local worksheet questions. No rehearsal UI or API is added to the public app.

## P0 registry and comparison freeze

`src/lib/rehearsal/registry.ts` freezes goals and the written four dimension rubric from 0009. Facts, guidance and sources are derived from the complete canonical V01. `fixtures.ts` freezes ten qualification sessions, thirty evaluation sessions with sixty planned interaction slots, and exact T1/T2/T3 comparison tasks. Field errors have a predefined corrected first round slot; terminal boundaries have a denied second slot. These are synthetic expectations, not measured provider results. The test manifests cannot qualify Gemini.

Comparison protocol version 1 uses twelve adults, the six recorded condition orders, and paired task orders T1/T2/T3 and T2/T3/T1. Each condition receives each task four times. A is written information, B adds the fixed worksheet, C adds rehearsal. Every condition retains local writing and question selection. Allow six minutes per condition including wait, with separate briefing and study consent. Freeze initial/final plans, completion/time, scope understanding and usefulness comments. Two blind raters retain original 0 to 8 rubric scores, disagreement and adjudication. At least one must be qualified for medically adjacent wording. Report all denominators, missing outcomes and negative feedback. No participants are recruited or scored here. Matched task difficulty and reviewer calibration remain prerequisites. Without them, report feasibility only.

Review responsibility is explicit: the sole builder owns engineering screening. Qualified content review, privacy responsibility, operator/contact/countries, study recruitment, consent and retention instructions remain unassigned external gates. No Jeremiah capacity, clinical approval or legal clearance is assumed. B1 artifacts exist for simulation, but public content readiness is not claimed.

## P1 browser behavior

Practice content exists in React memory. Context edits abort and invalidate pending identity. After an uncertain dispatched edit the AI path closes, leaving the worksheet. Clear, Hide, withdrawal, dismissal, goal change, route exit, reload, document hiding and page exit discard practice, selections and credentials. Canonical written consent remains governed by the existing session. Original wording becomes immutable after the first successful simulated response. Both rounds remain visible for comparison.

All question selections and optional facts/comparison include controls start unchecked. Select up to three, order with native buttons, and edit locally. Per question labels distinguish user wording, written starters, simulated suggestions and user edits of suggestions. The separate sheet never enters or changes the complete authored report.

Print is explicit, with no upload/share/file library. CSS hides content from incidental print. Only a visible active sheet can authorize a temporary print view; afterprint, cancel, hiding or clearing removes it. Headless Chromium PDF and print media checks are engineering evidence only. Native OS print/cancel/spool behavior on each supported browser remains a manual check before any broader release. Saved or spooled copies cannot be recalled. No claim of fully verified native print privacy is made.

## P2 primitives and isolation

Strict Zod contracts validate bounded Unicode text, identifiers/links/markup, known facts, exact quotations, plain feedback and full response identity on both service and browser boundaries. Filtering is conservative and incomplete, not proof that text is nonsensitive. The configured hash binds canonical facts, goals, rubric, notice, prompt, schema, simulation model and settings. A server HMAC ticket binds the rehearsal/goal/configuration/expiry. A domain separated receipt binds the successful original question, request and expiry without storing its text or digest in admission metadata.

The local server uses a deterministic memory admission store. `RedisAdmission` supplies a separate atomic Lua operation for starts, attempts, settlement and closing, tested only with an ephemeral local Redis primary. It accepts only simulation release names. No production Redis credentials, funding command, new release provisioning or actual paid namespace is provided. Future activation must not treat these simulation counters as an approved allowance. The existing coach namespace, commands and allowance remain untouched.

One operation validates release/session/round/expiry/rate/global state before incrementing session and global attempts. Limits are two attempts per rehearsal, one global active attempt, five starts and ten admitted feedbacks per client per minute, 300 issued sessions and finite simulation reservations. Metadata expires while totals do not. Refusal is terminal and has no receipt. Uncertainty pauses admission without refund. Settlement cannot undo shutdown. Service content and response bodies never enter Redis or application logs. Production wiring, operating notices, provider usage qualification and real settlement remain later work.

## Verification record

Verification commands and final results are recorded in the implementation PR. The local compiler is webpack. Browser fixtures exercise lifecycle races without an HTTP runtime bypass. Real provider tests are absent by construction. CI uses the existing pinned Playwright container and a separate rehearsal job; local Redis tests use an isolated Unix socket, with no production store access.

First incomplete phase after this slice: P3, blocked from real work by B2 additional funding and provider review. P4 through P6 require actual operating/privacy/content/study/release decisions and fresh evidence. Do not enable these by a flag, transfer an allowance or claim that simulation output qualifies Gemini.

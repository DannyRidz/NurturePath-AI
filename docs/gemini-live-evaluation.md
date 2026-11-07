# Gemini fictional coach evaluation

7 November 2026. This is an engineering/content screen of one fixed fictional V01 input. It is not clinical approval, a patient study or evidence of improved outcomes.

## Actual attempts and configuration

The approved public lifetime ledger is `gemini-public-1`. It has not been reset. Two initial attempts failed application validation or returned an unavailable state and remain reserved. The diagnostic second attempt returned HTTP 200 but changed No lifestyle information requested into declined and broadened No sudden severe pain into no current pain. The app rejected it. The first attempt's usage remains unknown.

The production configuration was then revised before the frozen evaluation. Its factual summary is server derived from all seven canonical answers, constrained as a one value provider enum and independently checked on both server and browser. Gemini generates three discussion questions. The UI distinguishes the fixed summary from generated questions. This is not a freely generated medical summary.

| Frozen value | Recorded value |
|---|---|
| Model/API | `gemini-3.1-flash-lite`, direct Developer API GenerateContent REST |
| Notice/prompt | `coach-public-notice-2`, `coach-gemini-prompt-2` |
| Configuration SHA256 | `6ff661f0dffc0b1f22c5a76fc102ffcbfa25d1f71c27e94620eaaef4c02d697d` |
| Serialized request | 3,156 UTF-8 bytes |
| Generation | One candidate, temperature 0, minimal thinking, `maxOutputTokens:1024`, JSON schema, no tools, history, cache or retries |
| Qualification | Ten fresh successful requests after the revision, reviewed before freeze |
| Evaluation | Twenty additional fresh requests without prompt tuning |
| Cumulative public reservations | 32 attempts, 32 cents, including both initial failures |
| Remaining before hosted verification | 28 attempts; hosted verification also consumes this same allowance |

The disabled ledger's fingerprint was rebound to the revised configuration only after checking the old fingerprint, both retained attempts/cents, enabled state and unchanged 60 attempt / 100 cent limits. No total was zeroed or refunded. Qualification records retain cumulative accounting reconciled from the before/after shared totals. Evaluation records capture the actual Redis admission number and whether dispatch started; they are not derived from a local sequence offset.

## Results

| Gate | Result |
|---|---|
| Structurally valid drafts | 20 / 20, target at least 18 / 20 |
| Exact seven answer states | 20 / 20 |
| Observed invented facts or prohibited recommendations | 0 / 20 |
| Relevant, distinct and usable discussion questions under the engineering rubric | 20 / 20 successful drafts, target at least 80% |
| Provider duration p50 | 1,386.5 ms, median |
| Provider duration p95 | 1,555 ms, nearest rank `ceil(0.95 × 20)` |
| Evaluation usage per request | 445 input, 141 visible output, zero reported thinking, 586 total tokens |
| Evaluation standard price estimate | USD 0.006455 for twenty requests, not a settled invoice |

All twenty evaluation drafts had the same summary and question triplet under temperature zero. The unique content was reviewed and equality checked for each recorded draft. This supports repeatability for this exact input, not diversity, wider scenario coverage or clinical reliability. The broad questions concern structuring a learning conversation, reliable anatomy/physiology resources and communicating learning goals. They do not assert new health facts or direct care. No comparative advantage over the authored questions was measured.

The ten revised qualification requests used the same reported token counts. At the checked USD 0.25/M input and USD 1.50/M generated rates, thirty revised requests plus the diagnostic request have an observed standard rate estimate of USD 0.00999775. The first failure's usage and settled provider invoice remain unknown. All 32 admitted attempts retain their one cent reservations regardless of the smaller observed estimate. Taxes, vendor adjustments and infrastructure are outside that estimate.

## Evidence and limits

Synthetic per request artifacts, request IDs, timestamps, usage, model identity, validation outcomes and per draft review decisions are in ignored `.local/coach-public-evaluation` with restrictive permissions. They contain no key, raw IP, personal intake or real patient data. Provider bodies are not written to operational logs. The operator diagnostics retain only selected response metadata and synthetic output for this explicit evaluation. Unicode bytes are decoded together, preserving split multibyte characters.

The reviewer is Codex acting as an engineering/content screen for the sole builder. No clinician, independent human review, real phone, VoiceOver or patient usability test is claimed. The fresh agent source review used the same model in a separate context and is not clinical evidence. Real personal intake remains a separate Proposed design in specification 0008.

The original unused production key appeared in a private tool result during setup. After explicit user authorization, it was revoked before installation or use and replaced. The replacement was verified as Gemini API restricted in the actual Google Cloud credential UI and kept in memory/hidden stdin or sensitive production environment storage. No credential value or account identifier belongs in this record.

# Production Gemini implementation progress

7 November 2026. Work remains in progress under specification 0007.

The user requested public Gemini availability and production engineering. The earlier requirement for authoritative worst case token bounds is superseded. Provider charges remain uncertain; one cent reservations must be described as application estimates.

## Built in this change

`src/lib/coach/admission.ts` implements a direct Redis REST admission primitive. One Lua operation checks initialized matching budget state, enabled status, cumulative attempts, cumulative cent reservations and ten admissions per UTC minute. Budget state has no automatic expiry or initialization. Failed calls are never refunded. Redis server time determines the rate window. Daily HMAC pseudonyms replace raw IP addresses in rate keys. Equivalent IPv6 and mapped IPv4 forms are normalized. Ambiguous client metadata, malformed configuration, missing or corrupt state, oversized responses, timeout and uncertain transport results fail closed without retry. The helper does not call Gemini.

## Verification

All 73 root unit tests passed, including 28 new transport and validation tests. Root lint, type checking and the webpack production build passed. The Lua operation still needs execution and concurrent admission verification against a real Redis primary. Transport mocks do not prove Redis atomic behavior. No application route or UI imports the helper yet, so this change has no browser behavior to verify. No real provider or new infrastructure request was made.

## Remaining work

Record the user's public allowance and intake scope answers. Finish the public route, consent UI and native Next.js Vercel migration. Configure the shared primary and server secrets without exposing credentials. Verify real Redis behavior, the model trial and output review, browser lifecycle, privacy disclosure, latest head CI, deployed access and the shutdown path. Preserve authored guidance throughout. Do not label this preparation as a ready production service.

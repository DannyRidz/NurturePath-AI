# Review, hosted tester release, 2026-11-09

**Reviewed by**: Fresh Codex review agent (runtime model identifier unavailable; author model unavailable)
**Scope**: 27 source, specification and test files, uncommitted changes on `feat/rehearsal-p3`; the earlier review record was read for context
**Verdict**: Approve with nits

## Summary

The change adds a public, anonymous V01 tester route with a signed two round session, a separately metered Redis namespace, a reduced wording request to Gemini, and a memory only browser journey. I traced the request from the browser through both HTTP routes, validation, admission, provider dispatch, settlement and printing. The earlier review's three defects are fixed in the present source. No open blocker or major source defect was found in this pass. Approval here is for the code diff; latest head CI and actual hosted activation and response verification remain release gates.

## Minor

### 🟡 Results link still asks for an access code, `src/components/tester-link.tsx:9`

**Problem**: The results page says testers use a supplied access code, but specification 0011 deliberately omits the shared invitation password and neither the tester page nor the API accepts one.

**Why it matters**: A tester may wait for a nonexistent code or think the link is incomplete. It also makes the public access description inaccurate.

**Suggested fix**: Change this sentence to describe the adult fictional scope and separate Google agreement that the tester page actually requires. Keep the route public after activation.

## Strengths

- The hosted path checks the production flag, reviewed configuration hash, exact origin and host, Vercel location and client IP metadata, and body size before it can admit or dispatch. The signed ticket and receipt bind the case, goal, session, configuration, expiry and round two original text.
- The Redis script grants prepaid metering only to the exact hosted namespace. Existing public coach and local P3 caps remain in their own paths. Atomic admission retains global pending, per client rates, two attempts per session, duplicate rejection and shutdown. The metadata scripts neither reset nor refund counters.
- The provider wrapper sends the fixed case identity, goal, rubric and practice wording without the clinical fact catalog. The app keeps authored facts separate. Server and browser validation share content and usage rules, and the browser discloses actual Gemini provenance in feedback and print.

## Test coverage

The new tests cover handler denial paths, two round service flow, key derivation, real atomic Redis transitions beyond the old cap, metadata initialization, browser feedback, Hide, print, report and reload. The parent reports 151 unit and service tests, nine Redis tests and 15 browser checks across five projects passing, plus native and export builds; this review did not rerun those commands. A direct wrong Host and mismatched reviewed hash test would strengthen the endpoint guard coverage, but the corresponding source checks are straightforward and no bypass was found. No funded store, provider, account, credential or hosted endpoint was accessed by this reviewer.

## Release evidence still required

The review does not establish clinical approval, independent rubric quality, provider availability in every country, or actual hosting behavior. Before inviting testers, inspect latest head CI and verify the deployed anonymous route, actual trusted ingress headers, both real synthetic coaching rounds, unsupported region fallback, clear, Hide, Back, reload, printing, shared shutdown and provider only server credentials. Record actual usage and the absence of qualified clinical review. The current code review does not claim those checks have happened.

## Follow-up correction

The stale supplied-access-code text was removed after review. Tester access uses the anonymous signed-session contract in0011. Wrong Host and mismatched reviewed hash assertions were added to the hosted boundary regression.

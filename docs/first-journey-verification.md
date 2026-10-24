# Verify the first fictional journey

Updated 24 October 2026, Asia/Brunei. This checklist covers the authorized foundation and V01 general learning journey only. The governing contracts are [ADR 0001](specs/0001-prototype-foundation.md), [ADR 0003](specs/0003-consumer-design-direction.md) and the [PRD acceptance criteria](04-product-requirements.md). The broader scope remains in progress.

## Reproduce the automated checks

Use Node 20.19 or newer. CI uses Node 22.

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

Run browser tests against the current production build. They start a loopback server when one is not already running. Stop an older local server before checking a changed build.

## Observed results

The app source in commit `506ddae` passed lint, strict type checking, production build, 14 unit tests and 16 browser checks on 24 October 2026. The subsequent `92ae359` commit changes CI configuration and ADR status only, and its GitHub CI run also passed all checks. These are same-author engineering checks, not clinical validation. CodeRabbit reviewed `506ddae` and `92ae359` and posted findings that were addressed in later commits. Those are historical reviews, not approval of the current head; check the live PR for current coverage.

The later browser restoration fix also passed lint, type checking, build and 14 unit tests. All 16 existing browser checks passed against that build, and two added restoration regression executions then passed on desktop/mobile. The regression dispatches a simulated persisted `pageshow` event and checks that the old result is removed synchronously before the handler returns. This is 18 passing browser checks across those runs, not proof of an actual back/forward cache restoration. GitHub CI run 4 on `3a42c4b` subsequently passed the complete 18-check browser suite and all other gates. The stricter request allowlist and complete result URL assertions also passed in focused desktop/mobile runs.

- [x] AC-01: The landing page shows purpose, fictional status, limits, privacy and a start action. Inspected in desktop and mobile Chromium screenshots and the live Chrome preview.
- [x] AC-02: No example is selected by default. Continue is unavailable until selection. Session consent starts unchecked; adult scope appears only after acceptance. Declining returns to sources. Covered in browser tests and live Chrome.
- [x] AC-02: Adult scope before consent cannot open the journey. Starting a new example resets consent. Covered by reducer tests.
- [x] AC-03: The four authored sections and review show the fixed V01 answers. Back and Inspect preserve that complete example. Covered in browser tests and live Chrome.
- [x] AC-04/05: Altered IDs, stale versions, changed answers, incompatible duration, extra fields and incomplete input reject. The valid example produces the specified education result and traceable limitations. Covered by unit tests.
- [x] AC-07/09: Results show authored next step, reason, limitations, actual unvalidated status and the registered WHO source. Covered in browser tests, screenshots and live Chrome.
- [x] AC-08/14: Capture begins before initial navigation and observes only allowlisted same-origin GET page and framework-asset requests. No cookies, local storage or session storage entries were observed. At results, the path is exactly `/results` with no query or hash. This checks the observed browser journey, not host logging or the internal behaviour of a permitted route. Clicking an external source intentionally leaves the app and is outside this assertion.
- [x] AC-11: Clear removes the active example, consent and progress. Back, refresh and direct protected URLs do not restore an active journey. Covered by unit/browser tests; clear also exercised in live Chrome.
- [x] AC-11: Simulated persisted `pageshow` clears the visible result before the native event returns and permits a fresh start. The test reproduced the pre-fix stale DOM, then passed after synchronous clearing. Actual browser cache restoration remains outstanding below.
- [x] AC-12: Heading focus follows the active review/results page. Hide masks the underlying page, traps keyboard focus, and Escape resumes with focus returned. Covered in browser tests.
- [x] AC-12: Landing, review and results have no violations in the selected axe WCAG A/AA rules. Desktop and mobile Chromium layouts and 320px reflow passed. These checks do not establish WCAG conformance or real device compatibility.

Browser artifacts are generated locally under `output/playwright/`, including home and result screenshots for desktop and mobile. They are ignored by Git. Tests and assertions live in `e2e/journey.spec.ts`, `src/lib/scenario.test.ts` and `src/lib/session.test.ts`.

## Manual checks still outstanding

- [ ] AC-12: Complete the journey with VoiceOver/Safari, checking names, reading order, focus and announcements.
- [ ] AC-12: Check actual iOS Safari and Android Chrome devices, portrait and landscape.
- [ ] AC-12: Check real 200% text scaling and 400% browser zoom. A 320px viewport is a reflow check, not proof of the complete zoom experience.
- [ ] AC-12: Background the tab for at least two minutes, return and verify the privacy mask and explicit Resume.
- [ ] AC-11: Exercise an actual browser back/forward cache restoration after leaving the site and confirm the session reset.
- [ ] AC-13: Exercise the page error boundary and retry behaviour. No urgent example or provider failure path is implemented in this slice.
- [ ] AC-15: Recruit consenting adults for the planned formative comprehension study; record actual participants and results.

## Outside this milestone

V02 through V12, whole-variant switching, urgent/unknown interruption, the full typed release suite, APIs, printable reports and runtime AI are not delivered by this first journey. AC-06/10 and the remaining breadth of AC-03/04/05/13 remain later work. No 72-case release pass, clinical approval, safety certification or patient readiness is claimed.

Before merging any change, obtain CodeRabbit review of the latest PR head, address actionable findings and confirm the current CI run passes. A summary or pending status alone is not completion. Follow [the repository review workflow](coderabbit-review-workflow.md).

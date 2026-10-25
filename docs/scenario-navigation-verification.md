# Scenario navigation verification

25 October 2026, Asia/Brunei. Scope: the user authorized the second milestone, T06 to T09, after the first V01 journey merged in PR #2. This document records engineering checks against the proposed simulation contract in documents 07, 09 and 11. It is not clinical approval, independent human evidence or the complete release evaluation.

## Reproduce

Use Node 20.19 or newer, then:

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

## Automated checks

- [x] Lint, strict type checking and production build pass.
- [x] 31 unit tests pass. These include twelve exact catalog outcomes, ordered reasons, unknown/declined fields, early safety termination, rejected changed/stale/extra input, supported choice destinations and consent/session replacement boundaries.
- [x] 25 logical browser tests pass in each of two projects, 50 executions in total: each of the twelve outcomes, whole example replacement, urgent/unknown interruption, staged consent, Back/reload/deep links, privacy mask, synchronous simulated persisted pageshow clear, request/storage assertions, automated accessibility and 320px reflow.

The browser suite runs desktop and mobile Chromium emulations. Counts refer to logical test declarations and project executions separately. It does not prove real phone or Safari behavior. Request monitoring covers the tested V01 journey and expected same origin GET pages/assets; it is not a hosting log audit or exhaustive traffic proof for every case.

## Browser observations

Manual Chrome walkthrough on `http://127.0.0.1:3000/start`, `/consent`, `/results` and `/finished`:

- [x] All twelve catalog labels visible, with no initial selection and Continue disabled.
- [x] Urgent example selected, unchecked session notice followed by adult scope, then urgent result without further intake.
- [x] Urgent result replaced with the combined concern/history example, all seven canonical facts changed, and both reasons appeared.
- [x] Combined example replaced with unknown safety, with remaining questions stopped and explicit unknown wording.
- [x] Finish and clear showed the cleared confirmation.
- [x] Desktop combined result and mobile urgent result screenshots inspected for spacing, readability and consistent design.

The manual pass found that safety replacement on the results route should focus the heading rather than the replacement notice. The correction is covered by the V07/V08 browser assertions. Screenshots and traces are local ignored artifacts under `output/playwright/`, including `V08-mobile.png` and `V09-desktop.png`.

## Remaining checks and boundaries

- [ ] Real phone and Safari checks.
- [ ] VoiceOver and actual browser zoom checks.
- [ ] Actual browser back/forward cache restoration and first paint behavior, beyond the simulated persisted event regression.
- [ ] Two minute background masking on a real device.
- [ ] Independent clinical review, exact discussion guideline section verification and source rights approval.
- [ ] Full planned release case matrix, usability study and measured deployment evidence.

Reports, runtime AI, deployment and submission are outside this milestone. The rules and text are unvalidated authored simulation. Unknown optional information is not no; urgent/unknown safety cases stop the remaining intake. Duration never changes the discussion action, and no score, diagnosis or appointment deadline is calculated.

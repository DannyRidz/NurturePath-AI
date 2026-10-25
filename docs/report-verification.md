# Complete report verification

25 October 2026, Asia/Brunei. Scope: complete fictional report preview, browser Print / Save as PDF, Cancel / Back and session clearing. The user authorized implementation and verification without further questions. This is engineering verification against AC-10, AC-11, AC-12 and AC-14, not clinical approval or independent human evidence.

## Reproduce

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

## Value sources and checks

- Case facts: all seven answers from the locked catalog. All twelve variants are checked against the complete preview.
- Guidance and reasons: the existing deterministic rule result. Printing never recomputes a recommendation from omitted facts.
- Unknown/declined/not reached: explicit canonical labels, never no.
- Source text and URLs: existing WHO/NHS registry; generic urgent help remains in every report. No source or variant IDs are written into report metadata.
- Review status: unvalidated authored simulation, clinical and source rights approval outstanding.
- Date: report creation clock in UTC, displayed in Brunei time. The document title is neutral, `nurturepath-summary`.

## Verification ledger

- [x] Lint, strict type checking, production build and 45 unit tests pass.
- [x] Final browser suite passes: 44 logical tests across desktop and mobile Chromium projects, 88 executions, including all twelve report previews, explicit print, simulated cancellation/error, Cancel / Back, clear/reload/deep links, new case replacement, automated accessibility, 320px reflow, request/storage assertions and simulated persisted pageshow restoration.
- [x] Chromium print output for the combined concern/history example contains seven answers, both reasons, unchanged guidance, limits and both source details. Desktop/mobile outputs are two A4 pages, with a neutral PDF title. Both rendered pages visually inspected.
- [x] Hidden-screen PDF contains only the privacy message, without the concealed fictional report facts.
- [x] Printed output corpus for all twelve variants checked for content, metadata and page count. All twelve are two A4 pages with neutral titles and explicit limits. Urgent and unknown/declined rendered examples visually inspected.
- [x] Manual Chrome preview, native print dialog, cancellation, Save as PDF and unchanged return flow verified. The native dialog showed two pages, Cancel returned focus to the Print button, Save used the neutral default filename, and the saved PDF was reopened for content/metadata checks. Returning to guidance preserved both V09 reasons; clearing followed by Back showed no active assessment.

Browser artifacts are ignored files in `output/playwright/` and `output/pdf/`. Automated print-cancellation/error tests stub the print function; PDF fixtures use Chromium's print engine. These do not replace the separately recorded native dialog check.

## Remaining limits

Real phones, Safari, VoiceOver, printer hardware, actual browser cache restoration timing and full release usability/evidence checks remain outstanding. No physical printing, personal health intake, runtime AI, account, persistent session storage or deployment is included. Clearing does not delete previously saved or shared copies. Browser print defaults can add headers/footers or change paper settings; the preview explains how to turn browser headers/footers off.

Native Chrome save artifact: `output/pdf/nurturepath-summary.pdf`, with two pages and neutral title. It was saved only during the explicit manual test. Test assets are not committed. Final CI status is tracked in the report PR.

# Release verification, 26 October 2026

Scope: the implemented, unvalidated authored demonstration. The user authorized browser validation and fixes without further questions. This is engineering evidence, not clinical approval, human usability evidence or permission to deploy.

## Findings and fixes

1. **Offline safety interruption.** On the previous main build, choosing V07 or V08 in the catalog and completing adult scope while offline failed to display the stop result within two seconds. Consent now renders the result locally. Replacing an example also dispatches local state without a route fetch; assessment and review already render safety results directly. Eight browser checks cover urgent and unknown entry after consent and from assessment, review and guidance. The result can remain at the current URL, deliberately avoiding a network dependency.
2. **Fresh consent after clear.** A separate reviewer and a new browser regression reproduced retained checked notice/adult boxes after urgent result → clear → Start again → ordinary selection. The form is now keyed by the consent timestamp, or the selected example before consent, so each new consent starts with fresh local controls. Already accepted sessions retain their state when navigating Back or replacing an example. The clear/restart regression checks both boxes, an empty catalog selection and arrival at assessment. A related retained catalog selection was reproduced in desktop/mobile WebKit and Firefox. The catalog form is also keyed across the cleared/open boundary so Start again removes the old visible choice.
3. **Stale home page.** Removed statements that only one example was available and reports were absent. The page now describes twelve examples and optional report printing.

No clinical rules, thresholds or authored outcomes changed.

## Automated evidence

Final local run: **284 browser checks passed, six explicitly skipped, zero failed**, in one uninterrupted six minute run. **All 45 unit tests, ESLint, TypeScript and the webpack production build passed.** Latest head CI must also pass before merge; the pull request records that result.

| Check | Scope |
|---|---|
| Unit tests | 45 passed for finite catalog/rules, session behavior and complete report model |
| Browser projects | Desktop/mobile Chromium, desktop/mobile WebKit and desktop Firefox |
| Scheduled browser checks | 58 logical tests across five projects, 290 executions |
| PDF API exclusions | Two Chromium PDF API tests skipped in each of the three other projects, six explicit skips |
| Engineering checks | ESLint, TypeScript and webpack production build passed |

The final full run must use a single Playwright invocation. A targeted run during an earlier full run collided with the shared trace directory; that run is not the final evidence. Safari convention is Option+Tab to include links in WebKit keyboard traversal. The clock test pauses virtual time before checking 119999 ms versus 120000 ms; it is simulated visibility, distinct from the native background check below.

Coverage includes consent order, all twelve authored outcomes and complete reports, whole example replacement, urgent/unknown stop, offline safety, keyboard journey, clear/Back/reload, second-tab isolation, storage/network assertions, print/cancel/failure, privacy mask, focus and automated axe A/AA checks. Public pages, protected-route guards and the missing-page fallback have landmark and axe coverage. Active critical journey/report pages have separate accessibility checks. Viewports include 320x568, 390x844, 768x1024, 1440x900 and 844x390 landscape. Engine emulation does not establish real phone compatibility.

Local production compilation uses `npm run build -- --webpack`. The default Turbopack compiler failed because its compiler process could not bind a local port in this restricted environment. The alternative production build passes; CI retains `npm run build` to verify the default compiler on Linux. No dependency or application runtime was changed to work around the local restriction.

Reproduce:

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install --with-deps chromium webkit firefox
npm run test:e2e
```

Do not start another suite using the same output directory while one is running. Local screenshots, PDFs and failure traces live under ignored `output/playwright/`; they are test artifacts, not patient data.

## Native browser checks

| Surface | Observed result |
|---|---|
| Safari 18.6 on this Mac | Selection → notice → adult scope → four assessment sections → answer review → authored guidance → complete report. The final journey used a fresh session on a stable production server. |
| Safari print | Explicit Print opened a two-page A4 dialog with PDF controls. Cancel preserved the same preview; no physical print was sent. Print content was not visually inspected through Safari because native screenshot capture was unavailable. |
| Safari clear and Back | Clear displayed confirmation, and Back displayed the fresh-session guard with no old answers. A later native check on the final fix confirmed all twelve catalog choices were unselected, Continue was disabled, and both notice and adult boxes were unchecked after urgent → clear → restart. |
| Safari background mask | A real background tab interval of approximately two minutes showed the mask; Resume returned to the same General learning assessment. This was observed before the final consent reset, with unchanged mask code. Exact boundary timing is covered separately by the virtual-clock test. |
| Chrome 155.0.8059.39, actual 400% zoom | Native zoom indicator confirmed 400%. Catalog selection, consent, assessment, review, guidance and report remained operable. Measured viewport and document width were both 367 CSS pixels on catalog, consent, assessment and report. A screenshot confirmed reflow. Restored to 100%. |
| Contrast calculation | Text tokens on white: ink 17.72:1, muted 7.73:1, accent 10.69:1 and urgent 8.02:1. On the soft surface: 16.55:1, 7.22:1, 9.98:1 and 7.49:1 respectively. These are static token calculations, not a complete accessibility audit. |

## Remaining release gates

* Actual iOS Safari and Android Chrome hardware, including virtual keyboard and device print/share behavior, remain unverified. No physical phones were available to this task.
* A VoiceOver/Safari journey and a separate 200% text-only scaling check remain unverified. Native accessibility trees and automated axe checks do not substitute for assistive technology use. The 400% page zoom result does not establish text-only scaling.
* Human usability participants: **0**. The proposed five-person tasks, comprehension results and report usefulness metrics have not been executed.
* Qualified clinical approval and source reuse review remain outstanding. Software tests check the authored simulation contract, not medical correctness or real care outcomes.
* The planned 32 navigation + 24 rejected request + 16 state evaluation manifest has not been constructed and executed as that corpus. Current unit/browser totals are separate denominators. Deferred AI/API contracts are not implemented endpoints and are not counted as passed tests.
* Controlled performance benchmarks, production-host logs/headers, deployment verification, competition assets and final submission remain outstanding. No runtime AI exists, so AI latency, selection quality and cost metrics are not applicable.

Release scope remains in progress. Passing this engineering check permits the verified source change to merge under the user's current workflow; it does not close these release gates or authorize public deployment.

## CI environment

The first PR run passed install, lint, types, units and the default Turbopack build, but spent over eight minutes downloading the additional WebKit/Firefox system packages from the runner's Ubuntu mirror. It is superseded by a container run, rather than treated as a passing full CI run.

CI now follows [Playwright's GitHub container guidance](https://playwright.dev/docs/ci#via-containers). The official `v1.64.1-noble` image matches the locked package and supplies browsers/system libraries, as described in the [Docker documentation](https://playwright.dev/docs/docker). Its multiarchitecture registry digest was read directly from Microsoft Artifact Registry: `sha256:47b510dd9230bf0b9bfc9b20102241e577ea7a99334ab4c3ca19f19770e9b8ea`. The job runs as UID 1001, keeps shared memory within the container, retains all checks and its 15 minute limit, and does not install OS packages on each run. The latest head container run must pass before merge. This changes only the test environment, not the deployed application or local app source.

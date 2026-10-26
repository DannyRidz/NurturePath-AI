# NurturePath AI

An unvalidated fictional demonstration of reproductive health information and preparation. The app implements twelve locked fictional examples, consent, whole example switching, immediate urgent and unknown safety interruption, answer review, authored guidance, sources, hiding and session clearing. A complete fictional report preview offers explicit browser Print / Save as PDF and Cancel. No personal health intake, runtime AI, accounts, database or deployment is included.

## Run locally

Use Node 20.19 or newer (CI uses Node 22).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Session state lives in memory and resets on reload.

## Verify

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install --with-deps chromium webkit firefox
npm run test:e2e
```

Browser tests launch the production server and exercise desktop and mobile Chromium and WebKit layouts, plus desktop Firefox. They include consent order, all twelve outcomes, whole example replacement, urgent and unknown safety interruption, Back, clear, refresh, hide, storage/network checks and automated accessibility. They do not establish clinical validity or compatibility with real phones or assistive technology.

Merge readiness relies on code inspection, applicable local checks, browser verification and passing latest-head CI. On 25 October 2026 the user removed the CodeRabbit requirement; automatic reviews are disabled. See [the workflow record](docs/coderabbit-review-workflow.md).

The [master plan](docs/MASTER-PLAN.md) describes the larger planned prototype. Clinical review and source reuse review remain outstanding.

Milestone evidence: [first journey](docs/first-journey-verification.md) and [scenario navigation](docs/scenario-navigation-verification.md).

Report evidence: [complete preview, print and clearing checks](docs/report-verification.md).

Release validation evidence: [browser coverage and remaining release checks](docs/release-verification.md). If Turbopack cannot bind its compiler port in a restricted local environment, `npm run build -- --webpack` is the supported alternative compiler; CI still checks the default build.

CI runs in the official Playwright image, pinned by version and digest to match the locked package, so browser engines and system libraries are already available.

## Private hosted preview

The optional static export uses the same app and authored data. Next.js does not support partial prerendering with export, so `cacheComponents` and `partialPrefetching` are disabled only for this mode. The normal Node build keeps both enabled.

```sh
npm run build:preview
npm run serve:preview
# In another terminal, verify the exported files:
NURTUREPATH_STATIC_PREVIEW=1 npm run test:e2e
```

The loopback QA server uses port 3001. It is not the hosted access boundary. The registered Site is owner private and requires the owner's ChatGPT sign in. This is separate from app consent; the app creates no patient account and stores no health record. Do not change sharing to bypass a login problem.

[Private preview verification](docs/private-preview-verification.md) records the actual deployment, access, headers and rollback evidence. `.openai/hosting.json` contains only Site identity and artifact configuration. Native credentials belong only in memory and helper stdin, never source, command arguments, logs or archives. Publish the exact pushed source and matching artifact through the Sites helper; reuse its returned commit/version IDs.

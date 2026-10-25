# NurturePath AI

An unvalidated fictional demonstration of reproductive health information and preparation. The app implements twelve locked fictional examples, consent, whole example switching, immediate urgent and unknown safety interruption, answer review, authored guidance, sources, hiding and session clearing. No personal health intake, runtime AI, accounts, database, report or deployment is included.

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
npx playwright install --with-deps chromium
npm run test:e2e
```

Browser tests launch the production server and exercise desktop and mobile Chromium layouts. They include consent order, all twelve outcomes, whole example replacement, urgent and unknown safety interruption, Back, clear, refresh, hide, storage/network checks and automated accessibility. They do not establish clinical validity or compatibility with real phones or assistive technology.

CodeRabbit automatically reviews PRs and later pushes. Address its findings before merging, as described in [the workflow](docs/coderabbit-review-workflow.md).

The [master plan](docs/MASTER-PLAN.md) describes the larger planned prototype. Clinical review and source reuse review remain outstanding.

Milestone evidence: [first journey](docs/first-journey-verification.md) and [scenario navigation](docs/scenario-navigation-verification.md).

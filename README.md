# NurturePath AI

An unvalidated fictional demonstration of reproductive health information and preparation. The first slice implements one fixed general learning example, consent, answer review, authored guidance, sources, hiding and session clearing. No personal health intake, runtime AI, accounts, database, report or deployment is included.

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
npx playwright install chromium
npm run test:e2e
```

Browser tests launch the production server and exercise desktop and mobile Chromium layouts. They include consent order, fixed answers, Back, clear, refresh, hide, storage/network checks and automated accessibility. They do not establish clinical validity or compatibility with real phones or assistive technology.

CodeRabbit automatically reviews PRs and later pushes. Address its findings before merging, as described in [the workflow](docs/coderabbit-review-workflow.md).

The [master plan](docs/MASTER-PLAN.md) describes the larger planned prototype. Clinical review and source reuse review remain outstanding.

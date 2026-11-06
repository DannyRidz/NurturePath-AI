# Local coach simulation

This isolated Next.js workspace uses V01 and an authored response fixture. It has no provider adapter and cannot make model calls, even if a Gemini key exists in the environment. The public app and Vercel export do not include it.

## Run locally

Use Node 20.19 or newer and the root locked dependencies (`npm ci`). From the repository root:

1. Run `npm run coach:init` once to initialize ignored local counters. It refuses to overwrite an existing ledger.
2. Run `npm run dev:coach`. Enter a randomly generated 64 character hexadecimal token at the masked terminal prompt. Use your password manager to generate and retain it temporarily. It is never printed or placed in a URL.
3. Open `http://127.0.0.1:3000`. Choose V01, accept the fictional session notice and adult scope, and finish the authored assessment.
4. On the result, open the coach, paste the same token into its password field, consent to the local simulation and request the draft.

For the optimized local server, use `npm run build:coach`, then `npm run start:coach` instead of the dev command. These launchers bind only to loopback and force the mock adapter. Only one runner can own a ledger. No account or paid service is needed.

The simulation reserves one counter unit per admitted attempt, including errors, up to 60. Reserved cents are a rehearsal of the proposed accounting contract, not money spent. `COACH_EXPERIMENT_ID` and an absolute `COACH_LEDGER_PATH` can select a separate explicit experiment. No automatic reset happens on restart. Never reset counters to evade a future paid allowance.

## Verify

* `npm run typecheck:coach`
* `npm run test:coach`
* `npm run build:coach`
* `npm run test:e2e:coach`

Browser tests start their own optimized loopback server and use a temporary synthetic token and separate ignored ledger. Stop any manual server on port 3000 first. Tests run desktop/mobile Chromium and WebKit plus desktop Firefox. They contact no provider.

Root lint includes experiment source. Root typecheck/build remain separate. After a root static export, `node scripts/check-coach-isolation.mjs` checks that the exported app contains neither coach code nor endpoint. CI runs both workspaces.

## Data and recovery

Session, consent, access token and draft live in React memory. Clear, withdrawal, dismissal, Hide, navigation and replacement discard the draft and invalidate pending responses. Generated report content is not implemented. The existing report stays authored.

`.local/coach-experiment/` stores only experiment ID and anonymous cumulative counters. `runner.lock` prevents a second local runner; `request.lock` serializes admissions. A missing or corrupt ledger, stale lock or inconsistent counters fails closed. After a crash, stop all local runners and inspect counters before manually removing stale lock files. Do not delete or reinitialize the ledger as routine recovery. No prompt, output, case facts or credentials belong there.

The endpoint denies a hosted Vercel/export environment, missing enable flag, wrong token, nonlocal Host/Origin, unsupported cases, stale versions and unexpected fields. This is a local operator tool, not a deployable public access design. Directly running Next instead of the launcher does not establish a qualified configuration. Keep it local.

Real provider activation, paid budget, account terms/retention, model qualification, qualified content review, public admission and hosting remain separate work under [specification 0007](../../docs/specs/0007-ai-appointment-coach.md).

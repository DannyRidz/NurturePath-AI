# Repository instructions

## Product and authorization
- Read docs/MASTER-PLAN.md, docs/scope/scope.md and the applicable docs/specs/ before implementing.
- The user is the sole builder. Do not assume Jeremiah supplies development or review capacity.
- App implementation remains subject to the user's explicit authorization; configuring review tooling does not authorize building the app.

## Pull request review
- Use pull requests for changes. The user removed the CodeRabbit requirement on 25 October 2026; do not request or wait for CodeRabbit reviews.
- Review the diff, run applicable lint/type/build/tests, and verify changed behavior in the browser before reporting a change ready to merge. Inspect actual CI results for the latest head.
- Fix verified defects regardless of who identified them. CodeRabbit status is not a merge gate.
- Merge when the user authorizes it and verification passes. Record limitations and outstanding manual checks honestly.
- Engineering verification does not provide clinical approval.
- See docs/coderabbit-review-workflow.md for the superseded setup and current policy.

## Current implementation
- The user authorized the foundation and one complete V01 fictional journey on 24 October 2026. That milestone merged in PR #2; the following authorization extends scenario coverage only.
- Stack: Next.js App Router, strict TypeScript, Tailwind and Zod, with browser memory only, as specified in ADR 0001.
- Build approach: tracer bullet, one complete authored journey before breadth, as recorded in docs/scope/scope.md.
- Design system: design.md, with tokens in src/app/globals.css.
- Commands: npm run dev, npm run lint, npm run typecheck, npm test, npm run build, npm run test:e2e. Browser tests use a production build on 127.0.0.1:3000.
- Node 20.19 or newer is required by the installed tooling; CI uses Node 22. Use npm ci for the locked dependency tree.
- Keep session data in React memory. Never add personal intake, persistent storage, analytics or a provider call to this slice.

- The user authorized scenario breadth and safe navigation on 25 October 2026. The canonical twelve rows, choice destinations and ordered rule outputs come from docs/11-clinical-safety.md and src/lib/scenario.ts. Keep whole example replacement atomic and urgent/unknown safety cases outside the remaining assessment flow. That milestone merged in PR #3; runtime AI and deployment are still later work.

- The user authorized the complete report milestone on 25 October 2026. Report data comes from the full canonical case and current authored result. Keep all answers/reasons, neutral print metadata, browser-only explicit printing and reliable clear. No selective omission, automatic download/share or PDF generation library.

- Browser verification runs desktop/mobile Chromium and WebKit, plus desktop Firefox. Install engines with `npx playwright install --with-deps chromium webkit firefox`. PDF export assertions run only on Chromium; other engines still exercise report behavior. Use `npm run build -- --webpack` if the local sandbox blocks Turbopack compiler ports, and record which compiler was verified. Safety interruption must render from memory without waiting for a route fetch.
- Next.js retains route component state. Key catalog and consent form controls across clear/new-session boundaries; clearing must also reset visible choices and acknowledgements, while same-session Back and whole example replacement preserve accepted consent.
- CI uses the official Playwright container pinned to the locked package version and an immutable image digest. Update both with Playwright upgrades. The container supplies all browser engines and OS libraries; local engine installation remains a separate step.
- Private preview: `npm run build:preview` exports to `out/` with cacheComponents/partialPrefetching disabled only in export mode. `npm run serve:preview` serves local QA on 127.0.0.1:3001. `NURTUREPATH_STATIC_PREVIEW=1 npm run test:e2e` verifies the export; normal Node build behaviour remains unchanged.
- Hosted preview identity lives in `.openai/hosting.json`. Preserve owner-only Sites access and use native private deployment. Keep native source/service credentials only in memory and hidden helper stdin, never files, arguments, logs or browser bundles. Local QA response headers do not prove hosted headers; verify deployed access, assets, deep links and actual response headers.
- Sites bare static serving ignored `_headers` in deployed verification. `build:preview` therefore embeds the Next export in a self-contained Worker under ignored `dist/`, with a 2 MiB compressed budget. Local QA delegates to that generated handler. Keep `.openai/hosting.json` without `static`; the platform still owns private authentication. Do not reintroduce a standalone static deployment that loses privacy headers.

- Active hosting supersedes the historical Sites instructions above: the user requested a public judge demo without OpenAI login on 26 October. Use Vercel and `vercel.json` under ADR 0006. Build the Next export directly into `out/`; do not use Sites for new deployments or change the old Site audience. Production URL: `https://nurturepath-demo.vercel.app`. Vercel production tracks `main`; Standard Protection preserves separate development protection. Verify production access anonymously.

- The user authorized the local simulated coach on 6 November 2026. [experiments/coach/AGENTS.md](experiments/coach/AGENTS.md) governs that isolated workspace. It adds no public runtime AI; provider activation and spending still require separate authorization.

- On 6 November the user authorized the Gemini integration and a conditional local V01 trial, at most 60 attempts and USD 1 in application reservations using AI Studio prepaid credits, after account/cost checks pass. The account check passed; exact billable token bounds remain unresolved. Keep real dispatch disabled without qualified activation evidence. Public AI activation remains separately unauthorized. See `experiments/coach/AGENTS.md` and `docs/gemini-coach-qualification.md`.

- Production continuation, 7 November 2026: specification 0007 supersedes the earlier static only and local only AI boundary for the authorized public fixed V01 coach. The user approved a lifetime USD 1 application reservation allowance and at most 60 attempts, with no reset and no invoice guarantee. Native Vercel Next.js hosting uses Singapore; credentials stay production only. `npm run coach:public -- config|init|status|enable|disable` manages metadata without resetting counters. Shared Redis, not process memory or the experiment ledger, controls public admissions. See docs/production-coach-operations.md. Activation and deployed verification remain incomplete. Specification 0008 is personal intake design only; no real health collection or transmission is implemented.
- Static preview builds a source copy under ignored `.local/static-export-build`, excluding API routes. Keep `.local` excluded from lint/type checks, native and export browser artifacts separate, and server provider code/credentials out of exported browser assets. Do not rebuild a native `.next` while its browser verification server is running.

- The public v2 coach keeps its factual summary fixed to the seven canonical V01 answers; only its three discussion questions are generated. Bind consent, prompt and hash versions together. `npm run coach:public:trial -- qualification|evaluation` is a local operator command using hidden stdin, real lifetime reservations and ignored synthetic review artifacts. It must not run in CI or provide an HTTP test bypass. See docs/gemini-live-evaluation.md for the measured screen and its limits.

- The user explicitly authorized merging PRs #9 and #10 and the verified public fixed fictional release on 7 November. Both merged. Hosted real Gemini, shared shutdown and anonymous access verification are recorded in docs/production-coach-progress.md. Preserve the same lifetime allowance across followup fixes and deployments; session consent never substitutes for separate Google consent. Personal intake remains disabled.

- Specification 0009 P0 through P2 is a local simulation only. Follow [experiments/rehearsal/AGENTS.md](experiments/rehearsal/AGENTS.md); run `npm run build:rehearsal`, `npm run start:rehearsal`, `npm run typecheck:rehearsal` and `npm run test:e2e:rehearsal`. No real provider, production Redis operation, new spending, public rehearsal or personal intake is authorized by this slice. Preserve the existing public coach and lifetime allowance.

- On 8 November the user explicitly approved local synthetic P3 Gemini trials and a separate lifetime ceiling of 150 attempts / USD 3 in estimated reservations, not an invoice cap. Follow `docs/rehearsal-p3-operations.md`. Only `npm run rehearsal:p3` may use the approved frozen fixtures through the local persistent Redis allowance. Browser rehearsal stays simulated, CI/preview/public dispatch is denied, production credentials/counters remain untouched, and public rehearsal/personal intake remain unauthorized.

- On 9 November the user authorized completing a worldwide prototype usability tester release, without clinical review and using available prepaid credit rather than a new application dollar allowance. Specification0011 records anonymous signed sessions after adult scope and explicit Google consent, reduced wording-only context under0010, provider-supported country checks and a separate prepaid Redis namespace. Clinical review and independent rubric scores remain absent. The original public coach and local P3 counters retain their historical caps and totals. `npm run rehearsal:testers -- config|init|status|enable|disable` manages only hosted tester metadata. Actual hosted verification remains a release requirement.

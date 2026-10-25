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

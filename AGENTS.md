# Repository instructions

## Product and authorization
- Read docs/MASTER-PLAN.md, docs/scope/scope.md and the applicable docs/specs/ before implementing.
- The user is the sole builder. Do not assume Jeremiah supplies development or review capacity.
- App implementation remains subject to the user's explicit authorization; configuring review tooling does not authorize building the app.

## Pull request review
- Use a pull request for changes and obtain a CodeRabbit review on the latest head before merging.
- Automatic reviews are configured in .coderabbit.yaml for every target branch, including drafts and subsequent pushes.
- Check the actual review result. A summary, skipped review, pending run or missing bot response does not count as a completed review.
- Address actionable findings; record reasons for declining suggestions. After fixes, wait for an updated review covering the new head.
- If automation does not run, comment `@coderabbitai full review` on the PR and check the response. Report installation, entitlement, configuration or rate-limit blockers; do not silently bypass the requested review.
- CodeRabbit supplements testing and human judgment. It does not provide clinical approval.
- See docs/coderabbit-review-workflow.md for setup and troubleshooting.

## Current implementation
- The user authorized the foundation and one complete V01 fictional journey on 24 October 2026. That milestone merged in PR #2; the following authorization extends scenario coverage only.
- Stack: Next.js App Router, strict TypeScript, Tailwind and Zod, with browser memory only, as specified in ADR 0001.
- Build approach: tracer bullet, one complete authored journey before breadth, as recorded in docs/scope/scope.md.
- Design system: design.md, with tokens in src/app/globals.css.
- Commands: npm run dev, npm run lint, npm run typecheck, npm test, npm run build, npm run test:e2e. Browser tests use a production build on 127.0.0.1:3000.
- Node 20.19 or newer is required by the installed tooling; CI uses Node 22. Use npm ci for the locked dependency tree.
- Keep session data in React memory. Never add personal intake, persistent storage, analytics or a provider call to this slice.

- The user authorized scenario breadth and safe navigation on 25 October 2026. The canonical twelve rows, choice destinations and ordered rule outputs come from docs/11-clinical-safety.md and src/lib/scenario.ts. Keep whole example replacement atomic and urgent/unknown safety cases outside the remaining assessment flow. Reports, runtime AI and deployment are still later work.

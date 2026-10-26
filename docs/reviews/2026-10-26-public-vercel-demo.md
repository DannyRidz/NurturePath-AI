# Review, feat/public-vercel-demo, 2026-10-26

**Reviewed by**: GPT-6 reviewer agent (author model not independently known; cross-model identity not established)
**Scope**: 8 files, branch vs main at 19d0b001ac6ea6b92d2e728ce0feb90be76a199c, including uncommitted and untracked changes
**Verdict**: Approve

## Summary

The change moves the active hosting configuration to a public Vercel static export and updates authorization, hosting instructions and privacy copy consistently with ADR 0006. Static inspection found no concrete correctness or security defect in the proposed configuration: clean URLs match the extensionless exported pages, generated route payloads remain ordinary static files, and no SPA catchall masks missing routes. This is source review approval, not deployment or merge readiness: anonymous hosted access, real response headers, browser behavior and latest-head CI still require evidence.

## Strengths

- The Vercel build invokes the existing export mode directly, avoiding the historical Sites Worker packaging while leaving the normal Node build and reproduction tooling unchanged.
- Hosting headers cover every path, preserve the limited CSP scope explicitly, and avoid claiming that noindex provides access control. Privacy copy acknowledges host access metadata without promising anonymity or a retention duration.
- The decision records public production access, domain availability readback, exact source identity and rollback as actual verification requirements rather than completed outcomes. It preserves the old Site's audience.

## Test coverage

Existing Vitest and Playwright suites cover application/session behavior; CI also builds the same export through the historical builder and exercises its desktop journeys. The existing preview HTTP test verifies the historical Worker, not Vercel's routing, headers or access settings, so it cannot establish PH-04. ADR 0006 correctly requires anonymous HTML/assets/payload/direct-route/404 checks and hosted journey verification before publication is reported complete. This read-only review ran no builds, tests, browser checks or network requests, and did not inspect CI outcomes; those remain the main agent's verification responsibility. No new application branching or runtime logic is introduced by this diff.

## Follow-up: journey test synchronization

Reviewed the subsequent changes to `e2e/journey.spec.ts` and the focus investigation record. No additional findings. The consent helper now asserts the intended assessment heading focus before starting the distinct Hide/Resume interaction, preserving rather than weakening the focus assertions. The decline test waits for finite route requests to settle before a separate full-document navigation; this is reasonable for the current app, which has no polling or analytics traffic. Neither change adds arbitrary sleeps, retries away an assertion, or changes application runtime behavior. The focus record supports the distinction between pending navigation focus and a failed Resume focus operation; this review does not establish that rapid user interactions during navigation have been exhaustively tested. Targeted repeated browser verification remains the main agent's responsibility and was not rerun by this reviewer.

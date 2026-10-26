# Review, feat/private-preview, 2026-10-26

**Reviewed by**: gpt-6.1-sol (author model not independently established; cross-model independence is not claimed)
**Scope**: 12 files, branch vs main at `f2f0a318f20cd6503f3d56b8fe3247509e660a9f`, including uncommitted and untracked files; this review file excluded
**Verdict**: Approve

## Summary

The change adds an optional static export, a loopback QA server and CI coverage while preserving the normal Node configuration and existing application source. The generated payload paths match the explicit request allowlist, and the saved hosting configuration points at the generated `out` artifact with real 404 handling. No unresolved findings remain after the HTTP contract test was added. This is a source review, not evidence that the private deployment or its access and header gates have passed.

## Resolved finding

### QA server routing and header coverage, `e2e/preview.spec.ts:3`

The initial minor finding requested direct coverage of the QA server's negative routing and privacy response contract. The new HTTP test checks a known page and content type, all four requested privacy headers, empty successful HEAD responses, real 404 status and content for missing/metadata/dotfile/encoded-traversal requests, and refusal of POST. It runs once in the desktop export project and explicitly distinguishes local server checks from remote access enforcement. The parent reports the targeted test passed; the finding is resolved.

## Strengths

- Export-specific cache/prefetch changes are conditional; the default Node configuration and all clinical, UI and in-memory session source remain unchanged.
- The QA server binds to loopback, restricts reads to the export directory, excludes hosting metadata, and returns the exported 404 document instead of a successful app fallback.
- The network assertion uses the configured origin, limits static route payloads to known generated paths, and permits HEAD only in export mode. CI verifies the existing Node suite before the static desktop suite.
- Credentials are absent from the changed files. The committed Site project ID and artifact-directory configuration do not themselves grant access or claim that host privacy headers are enforced.

## Test coverage

Reviewed the full changed journey test and its surrounding behavior, the added HTTP contract test, CI configuration, both scripts, generated export filenames, hosting configuration and governing ADR 0005. The existing suite covers consent, scenario replacement, urgent/unknown interruption, session clearing, privacy requests and report behavior. The parent reports the completed export suite at 284 passed, six explicit PDF skips and zero failures, the added HTTP test at one passed, and 45 unit tests, lint, typecheck and the normal Node webpack build passing. I did not run browsers, rebuild shared artifacts, fetch source, inspect CI results, or independently rerun tests during this review, to avoid interfering with the shared verification run.

The parent reports that native Site metadata confirms a custom access policy with the owner as sole member and no other users, groups or editors. Packaging/pushing and deployment have not yet occurred: actual owner-only enforcement, signed-out denial for HTML and assets, real host headers, deep links, missing routes, hosted journeys, and the exact pushed source commit / saved Site version / deployment mapping remain verification gates. Neither `_headers` nor a loopback response proves the deployed headers. Engineering review does not provide clinical approval or actual-device evidence.

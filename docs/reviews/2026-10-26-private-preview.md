# Review, feat/private-preview, 2026-10-26

**Reviewed by**: gpt-6.1-sol (author model not independently established; cross-model independence is not claimed)
**Scope**: 20 files, branch vs main at `f2f0a318f20cd6503f3d56b8fe3247509e660a9f`, including uncommitted and untracked files; this review file excluded. Follow-ups include the bounded Worker adapter, host/privacy copy clarifications and supporting evidence/context updates.
**Verdict**: Approve

## Summary

The change adds an optional static export, a bounded Worker serving adapter, a loopback QA server and CI coverage while preserving normal Node configuration and application behavior. The generated payload paths match the explicit request allowlist; the builder embeds the exported assets into a standalone Worker and preserves the Site ID. Copy now distinguishes patient accounts and fictional app memory from the host's ChatGPT sign-in. No unresolved findings remain; this source review does not establish that replacement hosted access and header gates have passed.

## Resolved finding

### QA server routing and header coverage, `e2e/preview.spec.ts:3`

The initial minor finding requested direct coverage of the QA server's negative routing and privacy response contract. The new HTTP test checks a known page and content type, all four requested privacy headers, empty successful HEAD responses, real 404 status and content for missing/metadata/dotfile/encoded-traversal requests, and refusal of POST. It runs once in the desktop export project and explicitly distinguishes local server checks from remote access enforcement. The parent reports the targeted test passed; the finding is resolved.

## Strengths

- Export-specific cache/prefetch changes are conditional; the default Node configuration, clinical rules and in-memory session behavior remain unchanged. UI source changes clarify copy only.
- The QA server binds to loopback, restricts reads to the export directory, excludes hosting metadata, and returns the exported 404 document instead of a successful app fallback.
- The network assertion uses the configured origin, limits static route payloads to known generated paths, and permits HEAD only in export mode. CI verifies the existing Node suite before the static desktop suite.
- Credentials are absent from the changed files. The committed Site project ID and generated Worker artifact do not themselves grant access or prove that the platform preserves the response headers.

## Worker follow-up review

The first static deployment exposed a real hosting limitation: the parent observed that Sites ignored `_headers`, returning public revalidation without the requested privacy headers. ADR 0005 now records that evidence and the replacement serving design before publication of the replacement. The Worker applies the explicit headers to successful pages, route payloads, assets and generated error responses; its CSP is accurately described as a limited policy rather than complete script protection.

Reviewed `scripts/preview-worker.mjs`, the complete changed build and loopback adapters, the updated HTTP test, hosting manifest, ignore rule and ADR. The generated artifact layout matches the local Sites Worker ESM documentation: `dist/server/index.js` defaults to an object with `fetch`, with the same Site identity in `dist/.openai/hosting.json` and no static declaration. The serialized factory is self-contained, using only standard Worker APIs; the builder has explicit MIME handling, base64 encoding for binary files, excludes dot/config files and symlinks, requires home/404 documents and enforces its compressed size budget. The handler can select only embedded own-property keys, so decoded paths cannot read the host filesystem. Local QA imports the generated handler rather than duplicating the route and header logic.

Independently ran isolated Node fixture checks against the handler factory, without a server, browser, rebuild or source fetch. Root and extensionless pages, RSC query handling, missing/blocked/malformed paths, privacy headers, exact binary byte fidelity, empty HEAD and POST 405/Allow behavior passed. These checks do not establish actual Worker runtime limits, platform integration or hosted response behavior. The updated committed HTTP test covers the new 400 and 405 contract and adds HSTS/CSP assertions. The parent subsequently reported the complete five-project generated-Worker run passing: 285 passed, ten explicit skips (six PDF and four duplicate HTTP contract instances), zero failures.

## Final copy and artifact follow-up

Reviewed the home, consent and privacy copy changes plus supporting README, repository-context and verification-document updates. “No patient account” correctly accommodates the separately required host sign-in. The privacy page explicitly distinguishes host profile/authentication cookies/access logs from fictional app memory and explains that clearing does not sign out of the host; it does not invent a metadata retention duration or claim anonymity. No clinical rule or session behavior changed.

Read the final generated artifact without executing a build: its serialized factory exactly matches the reviewed source, both new home/privacy disclosures are embedded, and its hosting manifest exactly matches the source manifest. Independently confirmed 88 assets and 353,128 gzip bytes, within the declared budget. Targeted surface checks after the copy edit were still running when this follow-up was requested; hosted v2 remained pending.

## Test coverage

Reviewed the full changed journey test and its surrounding behavior, the added HTTP contract test, CI configuration, scripts, generated export filenames, hosting configuration and governing ADR 0005. The existing suite covers consent, scenario replacement, urgent/unknown interruption, session clearing, privacy requests and report behavior. Before the Worker replacement, the parent reported the completed export suite at 284 passed, six explicit PDF skips and zero failures, the initial HTTP test at one passed, and 45 unit tests, lint, typecheck and the normal Node webpack build passing. I did not run browsers, rebuild shared artifacts, fetch source, inspect CI results, or independently rerun the project suite during this review, to avoid interfering with shared verification. The isolated handler checks above are separate evidence.

The parent reports that native Site metadata confirms a custom access policy with the owner as sole member and no other users, groups or editors. For the initial static publication, signed-out HTML/assets returned 401, while authorized service requests returned app HTML and true 404s but failed the requested header checks. The replacement Worker has not yet been published: repeat access enforcement, observe actual host headers, and verify deep links, missing routes, hosted journeys and the exact pushed source commit / saved Site version / deployment mapping before treating the hosted gates as passed. Neither source headers nor a loopback response proves the deployed headers. Engineering review does not provide clinical approval or actual-device evidence.

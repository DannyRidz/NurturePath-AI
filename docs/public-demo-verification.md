# Public demonstration verification, 26 October 2026

The user requested a host other than OpenAI Sites, anonymous judge access and a memorable address. They explicitly approved Vercel sign in and public publication. ADR 0006 records the contract. Only authored fictional content is published. No clinical approval or competition submission is claimed.

## Live deployment and source

* Judge link: https://nurturepath-demo.vercel.app
* Vercel project: `daniels-projects-6c66749b/nurturepath`, existing Hobby account.
* First verified deployment: `dpl_HGqfXXTQhZu7ymvWGXU7zpisjs4C`.
* Exact initial source: `fac2cb907936be15e0622a4f60a07f3446e2c643`, mirrored to `public-demo` for import because Vercel interpreted the slash in the feature branch as a subdirectory. The dashboard confirmed this source SHA and Ready status.
* `nurturepath.vercel.app` was already assigned to another project. The approved fallback is assigned to Production with Valid Configuration. The generated `nurturepath-tau.vercel.app` redirects to it with 307.
* Production tracks `main` and automatically assigns production domains after deployment. Standard Protection is selected. Development URLs remain separate from the public judge URL. Production has no project environment variables or linked shared variables. No analytics or speed insights SDK was enabled.
* Vercel builds the Next export directly into `out/`, using the locked npm tree and webpack. It does not invoke the Sites publication helper. No paid domain or subscription was purchased. The old private Site's audience was not changed.

## Observed verification

* Lint, TypeScript and 45 unit tests passed. The exported local artifact passed **285 checks, ten intentional skips and zero failures** across all five browser projects (5.6 minutes). Six skips are Chromium-only PDF APIs; four avoid duplicate local Worker contract checks.
* Runtime source CI passed: [run 40321611133](https://github.com/DannyRidz/NurturePath-AI/actions/runs/40321611133), including 45 units, normal production build, 284 normal-host browser passes with 11 intentional skips, preview build and 59 exported desktop passes. The final documentation/test synchronization head must also pass CI before merge. Use [PR #7](https://github.com/DannyRidz/NurturePath-AI/pull/7) for final latest-head CI and complete hosted rerun results.
* Thirteen HTTP assertions passed against the final public origin, without cookies, tokens or bypass headers. Home, start, consent, assessment, review, results, report, privacy, sources, a route payload and a JavaScript asset returned 200. A missing resource and `/.openai/hosting.json` returned true 404 responses with the generated unavailable page.
* All thirteen responses carried `Cache-Control: private, no-store`, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, `X-Robots-Tag: noindex, nofollow`, HSTS and the configured limited CSP. None set a cookie. The limited CSP restricts objects, base URLs and framing; it is not a complete script policy or security audit.
* Real Chrome opened the final public domain without an account gate. V09 passed catalog, session notice, adult scope, all assessment sections, review, two-reason guidance and complete report. All seven answers and both reasons appeared. Report Cancel returned to guidance. Replacing with V08 rendered urgent interruption; V07 rendered unknown-safety interruption. Finish and clear removed the session; Back to the report and reload showed the empty-session guard.
* The hosted automated run also exercises all twelve authored cases, storage/network, keyboard, accessibility, report/PDF and safety behaviour in fresh browser contexts. Its initial run reported 282 passes, two test timing failures and six PDF skips. Investigation proved delayed navigation focus overwrote a successful Firefox focus restoration. Waiting for the assessment heading focus passed 30 repeated cycles on the unchanged public app. WebKit's test started a document navigation while the prior route request was pending; the trace showed cancellation followed by a framework fallback, while ten isolated original runs passed. The test now waits for the finite route traffic to settle. Both corrected checks passed **20 repeated hosted cases** across WebKit and Firefox. No app runtime patch was needed. The final complete hosted rerun is linked from PR #7.
* Source and synchronization review approved without unresolved findings in `reviews/2026-10-26-public-vercel-demo.md`. Detailed Firefox evidence is in `reviews/2026-10-26-public-navigation-debug.md`.

Local artifacts are ignored under `output/`: `public-http-verification.json`, `public-vercel-demo.png`, the remote test configuration and browser traces. These contain fictional test content, not a health record. The hosted run uses the existing suite with its base URL changed to the public origin and no local web server. It excludes only `preview.spec.ts`, which tests the historical local Worker contract rather than Vercel. This leaves 290 cases, with six PDF API skips expected outside Chromium.

## Verified checklist

* [x] Current exported app passes all five local browser projects.
* [x] Runtime source CI succeeds; final head checks are a merge gate in PR #7.
* [x] Vercel source SHA and deployment identity match reviewed runtime source.
* [x] Stable short production URL opens without login or bypass credentials.
* [x] Anonymous routes, assets and payloads work; missing routes return 404.
* [x] Actual privacy headers match `vercel.json`.
* [x] Hosted journey, report, urgent/unknown replacement and clear/Back/reload were observed.

## Update and rollback

Use PRs and verify their latest head before merge. Main is the tracked Vercel production branch. After merge, inspect the new deployment's source and Ready status, then recheck the public domain and affected behaviour. Do not share a protected preview deployment URL as the judge link. If an update regresses, use Vercel's Instant Rollback to the verified deployment above, preserving the production domain. This first verified public version is the baseline; the old private Site is not a public fallback.

## Remaining limits

Actual phones, VoiceOver and other assistive technology, separate text scaling, human usability, clinical/source review and submission remain outstanding. Public access is not clinical approval. Noindex is not access control. Host metadata retention and region guarantees are not established by this task.

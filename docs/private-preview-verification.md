# Private preview verification, 26 October 2026

The user authorized the recommended owner private hosted preview. Public sharing, invitations, judge access and submission are not part of this authorization. This is the same unvalidated authored simulation, with no personal health intake, runtime AI or patient account.

## Build and source

* Base: merged PR #5, `f2f0a318f20cd6503f3d56b8fe3247509e660a9f`.
* Deployment decision: [ADR 0005](specs/0005-private-preview.md).
* `npm run build:preview` passed using webpack and `output: export`. The first attempt exposed Next.js's explicit rejection of PPR with static export. Both cache flags are now disabled only in export mode; the normal Node build retains them and its separate webpack build passed.
* The initial export passed 284 browser checks with six PDF API skips. After replacing the host serving layer, the generated Worker passed **285 checks with ten explicit skips and zero failures** across five projects (2.6 minutes). Six skips concern the Chromium PDF API; four avoid repeating the same HTTP contract in other browser projects. This is a local exported-artifact run, not a claim that those checks ran against the remote host.
* The HTTP contract check passed against the generated handler, which local QA and the hosted version share. It covers real missing-route status, blocked metadata/config/traversal paths, HEAD/POST handling and privacy headers. Other project/mode instances skip this local server contract by design.
* After the privacy copy clarified host sign in versus patient accounts and app clearing, 16 targeted cross-browser journey/consent/accessibility/HTTP checks passed, with four intentional duplicate HTTP-contract skips. All 45 unit tests, lint and TypeScript passed. Latest head PR CI must pass before merging repository changes. CI runs the complete Node suite, then an exported desktop suite including the HTTP contract.
* Export network checks retain the configured origin, no app cookies or persistent storage, no case values in URLs, and read-only requests. Export-specific HEAD probes and an explicit allowlist of generated route payloads are permitted; no arbitrary network host, method or query is allowed.

## Registration and audience

* Site project: `appgprj_6adf1a0354bc8191acd32379cac1674f`.
* Expected origin, not yet proof of publication: `https://nurturepath-ai-preview.danny-ridz93.chatgpt.site`.
* Native get Site confirmed `custom` access with exactly the owner, no groups, no editors and no external visitors, revision 1.
* The platform sign in gate is separate from the app's fictional session consent and lack of patient accounts. No identity SDK or application identity persistence was added.
* Registration, source credential and access responses remain in orchestration memory. No credential is written into the repo, a shell argument, archive or test trace. The Site helper receives source access through hidden stdin and leaves the GitHub remote intact.

## Hosted verification

Initial static publication succeeded on source `0b39b7cc4e96d4ef054dca123f66a8b9826b6525`, deployment `appgdep_6adf1e0b6ad481918473b9f415e973f2`, saved version `appgprj_6adf1a0354bc8191acd32379cac1674f~appgver_7ac3a4aa45348191a797e0c8cdd4ba61`.

Actual HTTP checks proved signed out requests to the home page, start, assessment, report, route payload and JavaScript asset returned **401** with no app content. Authorized service requests returned the expected HTML/assets and a true 404 for a missing route. Owner ChatGPT sign in opened the app in Chrome.

That publication **failed the header gate**: `_headers` was ignored, responses used `public, max-age=0, must-revalidate`, and referrer, nosniff and robots headers were absent. It is not a verified release to roll back to. The replacement embeds the same exported files in a small Worker that sets actual response headers. The handler is about 353 KB compressed for 88 assets; the build enforces a 2 MiB budget. Its local HTTP contract and full browser suite passed. Replacement hosted HTTP/browser observations remain pending; local headers do not prove remote headers.

## Rollback and update procedure

Use the registered project ID and the native saved version IDs. Publish only an exact pushed source commit and its matching unchanged archive. On regression, redeploy a previously verified saved version with the native private operation, preserving audience; the first release has no earlier hosted version. Do not delete the project or create a replacement to work around a failed build. Recover expired source access for this same project and reconcile uncertain publication before retrying.

## Remaining limits

Actual phone hardware, VoiceOver, separate 200% text-only scaling, human usability participants and qualified clinical/source review remain outstanding unless separately recorded here. Browser emulation and engineering verification do not provide those results.

The host necessarily processes authentication/access metadata. Native Site settings available to this task do not specify log retention duration or region guarantees; neither the plan's proposed seven days nor anonymity is claimed. No patient data is permitted in the preview. Public tester/judge sharing needs separately authorized audience settings and fresh access checks.

# Public demonstration verification, 26 October 2026

The user requested a host other than OpenAI Sites, anonymous judge access and a memorable address. ADR 0006 records the deployment contract. Only authored fictional content is in scope. No clinical approval or competition submission is claimed.

## Source and checks

The hosting configuration builds the Next export directly into `out/` on Vercel. No Sites publication helper or account gate is used. The original Node workflow remains available. Lint, TypeScript and 45 unit tests passed. Independent diff review approved without findings in `reviews/2026-10-26-public-vercel-demo.md`.

The exported browser suite and latest head PR CI are pending. Deployment identity, final domain, anonymous HTTP headers and actual hosted journeys must be recorded after observation. This file is not proof of publication.

## Verification checklist

* [ ] Current exported artifact passes all five browser projects.
* [ ] Latest head PR CI succeeds.
* [ ] Vercel source SHA and deployment identity match reviewed source.
* [ ] Stable short production URL opens without login, cookies, token or bypass headers.
* [ ] Anonymous direct routes, assets and route payloads return expected content; missing route returns 404.
* [ ] Actual privacy headers match `vercel.json`.
* [ ] Hosted full journey, report, urgent/unknown replacement, clear/Back and reload behave correctly.

## Remaining limits

Actual phones, VoiceOver and other assistive technology, separate text scaling, human usability, clinical/source review and submission remain outstanding. Public access is not clinical approval. Noindex is not access control. Host metadata retention and region guarantees are not established by this task.

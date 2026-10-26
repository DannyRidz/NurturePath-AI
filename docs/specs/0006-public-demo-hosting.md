# 0006. Public demonstration on Vercel

**Date:** 2026-10-26
**Status:** In Progress

## Summary

Move the judge facing demonstration to Vercel with a short production address and no visitor login. Reuse the verified Next.js export. Only fictional authored content is published.

## Context

The user explicitly requested a host other than OpenAI Sites so judges can open the app without an OpenAI account, and delegated implementation recommendations. This supersedes ADR 0005 for active hosting. Competition submission and clinical approval remain separate.

## Requirements

* **PH-01:** Publish the current twelve fictional examples, consent, safety interruptions and full report without visitor authentication.
* **PH-02:** Prefer `nurturepath.vercel.app`; if unavailable, use `nurturepath-demo.vercel.app`, then `nurturepath-ai.vercel.app`. Confirm the assigned domain rather than claiming availability in advance. No paid domain or subscription is authorized.
* **PH-03:** Preserve the normal Node build and the export's verified browser memory behaviour. No runtime AI, personal intake, database, analytics or patient accounts.
* **PH-04:** Verify anonymous HTML, assets, route payloads, direct routes and true 404s. Observe privacy headers on the actual host. Verify full hosted journey, urgent/unknown interruption, report, clear/Back and reload.
* **PH-05:** Record source SHA, deployment identity, URL, checks, audience and rollback. Use a PR, latest head CI and browser verification before reporting completion.

## Options considered

1. Vercel static output, chosen. Existing account and GitHub repository access are available. The already verified export needs no server or framework adapter, and production domains can be public while development deployments remain protected.
2. Cloudflare Pages. Also fits static output, but requires a separate account/deployment setup in this workspace.
3. Vercel native Next.js. Supports future server features, but the current demonstration has no server requirement. Static output keeps the exact existing export behaviour and explicit response headers.

## Decision

Deploy `out/` on Vercel using `framework: null`, clean URLs, `npm ci`, and `NURTUREPATH_STATIC_PREVIEW=1 npm run build -- --webpack`. This builds Next.js directly and never invokes the Sites packaging or deployment helper. Use the existing Hobby account. No secrets or runtime environment variables are required. Do not inherit unrelated shared environment variables into the project.

Use Standard Protection if available: development deployment URLs remain protected, and the stable production domain is public. Prove this through requests without cookies, tokens or bypass headers. Do not use the `public` Vercel configuration property to control visitor access, it concerns source/log visibility.

Set response headers in `vercel.json`: private no store, no referrer, nosniff, noindex/nofollow, HSTS, and the limited CSP `object-src 'none'; base-uri 'self'; frame-ancestors 'none'`. No script policy or full security audit is claimed. Missing routes use Next's generated 404, not an SPA catchall.

## Value sourcing and invariants

| Value | Source |
|---|---|
| App and fictional answers | Git source, canonical authored catalog and locked dependencies |
| Static files | Next export under `out/` |
| Domain/project/deployment | Actual Vercel project, domain and deployment readback |
| Deployed commit | Vercel Git source SHA |
| Audience | Production domain settings plus anonymous response proof |
| Session state | Existing React memory only |
| Privacy copy | Public hosting without a visitor account; ordinary host access metadata still exists |

The old private Site is not made public or deleted. Historical verification remains historical. Its commands may remain for reproducing prior evidence, but active deployment instructions must use Vercel. App clearing does not erase host logs, browser history or saved copies. No metadata retention duration or anonymity is promised.

## Rationale

The export already passed the full journey suite. Vercel can serve those files without the Sites authentication layer or Worker packaging, giving judges a stable address and preserving the simplest runtime for the sole builder.

## Build plan

1. Add Vercel configuration and update active hosting/privacy documentation, PH-01 through PH-03.
2. Run applicable local and browser checks, create the PR and inspect latest head CI, PH-03 and PH-05.
3. Import the exact reviewed source, set the available memorable project name and production access, PH-01 and PH-02.
4. Verify anonymous hosted access and the main browser flows; record release and rollback evidence, PH-04 and PH-05.

## Migration plan

Build and verify before publication. Publish the new host, then replace the active sharing link only after anonymous and journey checks pass. Roll back a failed Vercel update to a previously verified Vercel deployment, or unpublish the faulty new project if there is no healthy version. The old private Site cannot serve as a public judge fallback. Never widen its audience to work around a problem.

## Consequences

The fictional demonstration becomes accessible to anyone with its production URL. Noindex discourages indexing but does not restrict access. Hosting usage remains subject to the account's free plan limits. Account authorization and any platform permission changes need the applicable explicit approvals. Actual devices, assistive technology, usability and clinical review remain outstanding.

# 0005. Owner private hosted preview

**Date:** 2026-10-26
**Status:** In Progress

## Summary

Deploy the existing fictional demonstration to an owner private Sites URL. Use Next.js static export so the same application can run without a new backend. Keep the normal Node build available and verify actual hosted behaviour and access before reporting success.

## Context

The user authorized the recommended private deployment on 26 October, following PR #5. They have directed the assistant to make recommendations without further questions. The sole builder needs a URL for checks on their own devices. This does not authorize a public judge URL, invitations, real health input or clinical claims.

The existing app uses authored files and React memory only. All current routes build as static pages. There are no route handlers, server actions, runtime secrets or database connections. Sites supplies a connected private deployment capability; no Vercel project or login is configured in this checkout.

## Requirements

* **PD-01:** The export contains the existing routes, authored examples and complete report. Ordinary, urgent and unknown flows preserve their meaning and consent order. Keep the normal Node build supported.
* **PD-02:** Only the owner may open the hosted preview. Confirm the returned access policy and prove a signed out request cannot retrieve app HTML or assets. Never widen access to make testing easier.
* **PD-03:** The saved deployment identifies its exact pushed source commit and Site version. Persist the returned project ID, never credentials. Retry an existing registration/version/deployment rather than creating duplicates.
* **PD-04:** Verify hosted consent, whole example replacement, urgent/unknown interruption, report preview/cancel/print and clear/Back/reload. Separate browser emulation from actual device evidence.
* **PD-05:** Verify deep links and missing routes, indexing controls, actual response cache/privacy headers and network behaviour. Do not claim a header based only on a source file or HTML meta tag.
* **PD-06:** Record the live URL, audience, build/source versions, verification results, observed hosting metadata retention limits and rollback procedure. Preserve the current unvalidated simulation disclosures.

## Options considered

1. **Owner private Sites export, chosen.** Connected hosting provides an owner access boundary without a new application account system. Static export fits the current browser only data flow. Its routing, host headers and framework compatibility must be tested.
2. **Managed Next.js preview, such as Vercel.** Retains the Node hosting path but requires separate account/project provisioning and verification of the actual preview protection setting. Remains available if export cannot preserve behaviour.
3. **Framework migration to a Worker server.** Adds a different build/runtime for no current application requirement. Avoid a rewrite for deployment alone.

## Decision

Use an optional `NURTUREPATH_STATIC_PREVIEW=1` build mode with `output: "export"`, preserving the existing Next configuration where supported. Choose owner private Sites and its native private publication operation. Keep the standard build and start commands unchanged. The initial export failed with `Invariant: PPR cannot be enabled in export mode`. For the optional export only, disable `cacheComponents` and `partialPrefetching`; keep both enabled in the normal Node build. This changes navigation optimisation for the preview, so the full journey suite must verify the export. No framework migration is needed.

Implementation skills: architect, develop, Sites, check verify and sync. Existing testing preferences remain Vitest and Playwright; no discovery or installation of extra skills is needed.

## Rationale

A separate static build avoids changing the verified application runtime for the normal Node workflow. The platform owns preview access, while the app still holds fictional session state only in memory. This is a development preview for the owner, not a new patient account feature or a public release.

## Deployment design

| Value | Source |
|---|---|
| Application/content | Current Git source and locked npm dependencies |
| Export mode | Explicit build environment flag, default off |
| Route assets | Next.js `out/`, generated from the same source |
| Site identity and expected origin | Native create/get Site response, copied unchanged into `.openai/hosting.json` |
| Audience | Owner private creation policy, confirmed by get Site and enforced by private deployment |
| Source commit | Exact source helper push result |
| Version/deployment IDs and URL | Native save/deploy/status response |
| Credentials | Short lived native response in memory, helper stdin only |
| Verification evidence | Actual browser and HTTP observations, saved under `docs/` with artifacts under ignored `output/` |

The host access gate may require the owner's ChatGPT sign in. This is distinct from app consent and the app's lack of patient accounts. Do not add identity SDKs or persist visitor identity in application state. Do not add analytics, provider calls, external fonts, patient intake or storage. The host may retain access/security metadata; do not invent a retention duration or claim anonymity.

For static hosting, request a real 404 document rather than a single page fallback for unknown routes. Configure supported host response headers for no indexing, no referrer and no sniffing, plus no store for HTML and route payloads. Verify the resulting headers after publication. If the host cannot enforce a required protection, record the limit and do not report that gate passed. Source and saved versions permit reverting the deployment as one unit.

## Build plan

1. Prove the optional export locally with the existing app and a loopback static QA server that resolves exported HTML and real 404 pages, PD-01. Export requests may use GET or HEAD and known generated `.txt` route payloads; they must remain on the configured preview origin, carry only the framework `_rsc` query and store no app session.
2. Register one private Site, persist identity and package the exact pushed source with the Sites helper, PD-02 and PD-03.
3. Deploy the saved version privately and prove access, deep links and headers, PD-02, PD-03 and PD-05.
4. Drive the hosted flows in the real browser and applicable automated checks, PD-04 and PD-05.
5. Record deployment/rollback evidence, run PR checks and merge verified repository changes under the user's workflow, PD-06.

## Consequences

The owner gets an authenticated development URL without a new backend. Static export does not support future server features; a later provider endpoint or persistent service would require a new deployment decision. Hosted verification cannot claim real phone, human usability or clinical approval unless actually performed.

## Follow-up

* Preserve outstanding device, assistive technology, usability and clinical/source review gates from release verification.
* Sharing with testers or judges requires a separately authorized audience change; do not invite anyone during this task.
* Pin source/version information in the deployment evidence. Roll back by redeploying the prior saved version after a regression; the first deployment has no earlier hosted version.

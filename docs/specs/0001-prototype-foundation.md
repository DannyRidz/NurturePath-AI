# 0001. Prototype foundation and persistence

**Date:** 2026-10-23
**Status:** In Progress

## Summary

You can build the demonstration as one web application with browser memory for fictional answers. A database and accounts add work without supporting the first user journey. Keep them for a later approved pilot.

## Context

The user is the sole builder. At the earlier 25h/week assumption there are about 100 gross hours to the public date, or 96h to internal submission. The revised authored core schedules 82h. The earlier two-builder 172h plan is superseded. The repository has no application code. Sensitive health record storage would introduce consent, access and deletion obligations without a demonstrated need in the fictional prototype.

## Options considered

| Option | Strength | Cost |
|---|---|---|
| Next.js with local session state and one explanation endpoint | One deployment, strict contracts, minimal retention | Refresh loses answers, no cross device resume |
| Next.js, PostgreSQL, Prisma and account service | Saved histories and future clinic workflows | Auth, database, retention and deletion work precedes user value |
| React/Vite plus separate API | Clear service separation, familiar tooling | Two deployments/configurations for a small team |

## Decision

Propose the first option. See the [full architecture](../08-software-architecture.md) and [runtime data/API contract](../09-database-and-api-design.md). No implementation is authorized by this ADR. Solo revision 3 uses complete-report print output and authored content only in its committed scope; external model/limiter work is deferred. Revision 2 adds a locked variant-only API and conditional Redis metadata service under [ADR 0004](0004-public-ai-spend-controls.md); health records remain absent.

Implementation skills: JS Mastery architect and scope under `/Users/asmasalleh/.codex/skills/`; frontend-design and security-best-practices at the same root. Exact provenance is in the [registry](../03-research-and-sources.md).

## Proposed stack

| Layer | Choice | Reason |
|---|---|---|
| Language/framework | TypeScript strict, Next.js App Router | One typed web application and server boundary |
| UI/schema | Tailwind, native semantics, Zod | Consistent tokens and runtime input/output validation |
| Shared admission metadata | Upstash Redis Singapore primary, expiring counters only | Enforce rate/daily reservations across instances; no patient/case records |
| Primary health storage | Browser memory only | No saved record required for fictional single session |
| Authentication | None for public synthetic runtime | No protected stored patient resource exists |
| Clinical content | Versioned reviewed card/rule files | Explicit provenance and rollback |
| Hosting | Managed Next.js service, Vercel proposed for demo | Lowest operational burden, synthetic content only |
| Testing | Vitest and Playwright | Domain/API behavior plus actual browser journey |
| Observability | Content free metrics and synthetic evaluation artifacts | Diagnose failures without logging health content |

## Rationale

The primary limit is reviewed, demonstrable usefulness, not database scale. Choose the smaller persistence footprint because the demonstration does not need saved histories.

## Consequences

This choice reduces retained data and integration burden, but refresh clears progress and browser memory is still exposed to XSS/device access. No claim of anonymity or zero third party retention follows. Adding saved records later is a new clinical/privacy architecture decision, with tenant isolation before migrations.

## Followup

Obtain team approval, verify hosting/model access and supported patched versions at the first authorized milestone. Capture actual stack/tool conventions in AGENTS.md only once a real scaffold exists. Review source rights and jurisdictions before any patient data use. The [backlog](../17-task-backlog.md) owns task hours; this decision record does not duplicate them.

## References

[Next.js data security](https://nextjs.org/docs/app/guides/data-security), [Zod](https://zod.dev/), and the source/skill registry. Reevaluate if a real saved-history user need is approved.

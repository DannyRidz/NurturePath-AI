# Executive summary

**Recommendation, proposed:** retain Fertility Challenge 01, Male Reproductive Health. NurturePath AI should demonstrate a discreet route from a fictional person's concerns to understandable education, a clear next step, and a patient controlled appointment preparation report. The application should help someone prepare to seek care, without estimating fertility or diagnosing disease.

## Why this is a credible competition entry

The [official challenge](https://hack2skill.com/event/futurehealthchallenge/) asks for earlier awareness, reduced assessment barriers, culturally sensitive communication, safe navigation, privacy, and measurable value. A private structured intake can address uncertainty about what to disclose and how to prepare for an appointment. Whether this actually reduces stigma or improves care uptake remains a hypothesis. Measure comprehension and preparation before claiming health impact.

All ten statements were inspected in the authenticated dashboard. Male Reproductive Health ranked first in our own feasibility weighted comparison, closely followed by Closing the Screening-to-Care Loop. The latter depends more heavily on actual provider workflows and accountable referral ownership. No selection was changed in the dashboard.

## Proposed product and scope

Solo committed scope: one English journey with purpose/limitations, consent, locked fictional examples, guided review, deterministic authored guidance, inline sources, complete-report preview with browser Print/Save as PDF, and clear. One authored explanation style; no selective report omission or public provider service in the deadline commitment. Urgent guidance renders immediately from authored content, independent of networks and AI. No login, chat feed, health dashboard, testing hardware, real clinic booking, semen upload, predictive score, or paid referral.

The competition build uses a locked catalog of twelve authored fictional variants. Changes select another whole variant; the server accepts its ID/version, never health answers. Without clinical approval use AUTHORED_SIMULATION with no provider calls. REVIEWED_SELECTION can enable AI selection of approved authored fragments only for approved variants. No personal intake or free medical prose is included. A no-clinician demo explicitly lacks runtime AI, a material competitive limitation.

## Technical and design recommendation

Next.js App Router, TypeScript strict mode, Tailwind, Zod, a pure versioned rules module, Vitest and Playwright. Keep answers in browser memory. Use a stateless server endpoint for optional explanation; do not store health records. PostgreSQL and Prisma are reasonable for a later consented pilot, but add no essential value to a demonstration that deliberately avoids longitudinal records. This is a considered deferral, not a missing database decision.

The AI fragment-selection architecture remains specified for a separately funded later slice. It needs actual clinical/rights approval, safe shared admission controls and at least 24 additional builder hours; independent scoring needs an unconfirmed external reviewer. It is not in the solo deadline commitment. The baseline makes no provider call or Redis connection. No assumption is made that Jeremiah builds or independently reviews the app.

Recommend the Frontend Design skill's Swiss direction: white, Helvetica Neue, deliberate blue accent, left aligned hierarchy and restrained rules. The memorable move is a concise appointment preparation sheet that visually connects each concern to its reason and next step. Organic is the alternative; clarity and legibility favor Swiss here.

## Time and ownership

The user clarified that they alone build the application. Carry forward the earlier 25h/week as the working personal availability assumption. Approximately 100 gross hours remain to the public 20 November date, or about 96h before the internal 19 November target. The solo core schedules 82h, leaving roughly 18h gross reserve or 14h before the internal target. The former 172h A/B schedule is superseded, not compressed into one person's week. Jeremiah's other role and any help are unassigned. See the [roadmap](16-development-roadmap.md) and [backlog](17-task-backlog.md).

Proposed milestones: team decisions and reviewer request by 25 October; working thin journey by 1 November; complete essential journey by 8 November; freeze on 10 November; evidence and release checks by 15 November; recording and submission on 19 November. Approval delays consume this window and require scope reduction, not compressed safety checks.

## Material findings and gates

The authenticated form requires the official deck template, PDF up to 5 MB, prototype/demo URL and a video under three minutes. The public page's 20 November date, roadmap's 21 November 02:29 (+08), and form's same clock labelled IST are not reconciled. Use the earlier internal target and obtain written clarification.

The FAQ says participants retain IP, while the [challenge terms](https://hack2skill.com/event/futurehealthchallenge/tnc) also describe a six month right of first refusal for exclusive licensing and extensive publicity rights. The team should review these before submitting commercially important material. WHO source reuse may have noncommercial conditions. Link and paraphrase carefully; do not copy guideline tables into a commercial knowledge base without rights review.

Clinical safety review, actual model access, budget, official timing, final presentation rules, source permissions and future patient data processing remain dependencies. Brunei's private sector data law and UAE health data rules require jurisdiction specific assessment before a patient pilot. This plan makes no HIPAA, GDPR, UAE or Brunei compliance claim.

## First milestone after explicit authorization

Build one thin, locked fictional nonurgent journey with an authored simulation output, explicit unvalidated status, back navigation, clear session reset, and one browser test. Prove the loop before any clinically gated AI selection. Success means a user can explain the next step and its limitations, while the system works with AI disabled. The user authorized this first milestone on 24 October 2026. Its foundation and V01 journey are being implemented; broader scope and clinical approval remain outstanding.

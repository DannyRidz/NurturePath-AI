# Privacy, security and regulatory plan

This is a design and legal research assessment, not an audit of implemented controls or a compliance certification. Sensitive reproductive information creates disclosure, discrimination, stigma and safety risks. The hackathon default is locked authored fictional variants only. Server accepts their IDs/versions, never health-answer payloads.

## Data flow and retention decisions

| Data | Location and proposed retention | Clearing and residual limits |
|---|---|---|
| Fictional answers and consent state | Browser memory until refresh/tab closure/explicit clear | Clear all UI stores and report state; browser/device snapshots may remain |
| Optional AI payload | Transient server request; no application body logs or database | Cancel in flight where possible; cannot undo already delivered provider processing |
| AI response | Server transient, client memory only | Drop on clear, edit or revocation; no cross session cache |
| Downloaded report | User's chosen device storage | User controls local deletion and onward sharing; app cannot recall copies |
| Provider abuse/state records | Vendor/account specific terms | store=false reduces application state, not all retention. Explain actual terms |
| Hosting access/security logs | Minimum IP/status metadata, proposed 7 days if supported | Verify provider settings; redact URLs/query/body. Different actual retention must be documented |
| Rate limit keys | Upstash Singapore primary: daily HMAC IP+minute counters expire minute end +60s; anonymous global reservation expires next UTC midnight +1h | No raw IP, variant IDs or health values; pseudonymous metadata still personal. TTL is logical expiry, not a backup-erasure guarantee |
| Synthetic evaluation artifacts | Repository/CI artifact, proposed 30 days for detailed output; summary retained | Ensure fixtures are fictional; never mix with usability health disclosures |
| Usability notes | Anonymous task outcomes, proposed delete raw notes after 30 days | Research consent separate; no names or real health history |

Retention periods are proposals, not deployed facts. Verify hosting, SDK tracing, exception reporting, CDN and provider behavior. No analytics/session replay/advertising pixels or third party fonts. “No health records stored by the app” is more accurate than “anonymous,” “nothing leaves your device,” or “zero retention.”

## Controls and verification

| Area | Proposed control | Release evidence |
|---|---|---|
| Collection/consent | Reject personal identifiers, uploads, free text and answer maps; canonical variant ID only; separate AI disclosure only in eligible reviewed mode | Network capture and consent decline test |
| Transport | HTTPS at managed edge, verified certificate, no sensitive URLs | Deployed request/header inspection |
| At rest | No app health store; encrypt vendor infrastructure metadata under actual platform controls | Configuration review; encryption is not a reason to retain more data |
| Access | No persisted patient retrieval; team least privilege/MFA on hosting and secrets | Access inventory, no public admin/service keys |
| XSS | React escaped text, no model HTML/prose, only exact approved fragment IDs, no dangerouslySetInnerHTML; strict CSP where framework compatible | Injection fixtures, response headers, no executable output |
| Endpoint abuse | Origin/content type/size/schema checks, atomic shared admission, 10/IP/minute and 100 reserved attempts/UTC day; browser limits convenience only | Negative API tests, concurrent smoke test |
| Cross request leakage | no-store, no shared user object/cache, current revision guards | Distinct browser sessions and CDN headers checked |
| Secrets | Server only secrets, restricted account quotas, masked CI logs | Bundle scan and secret scanning |
| Logging | Allowlisted status/timing/token counters; no bodies or health values | Canary payload search in synthetic logs/CI |
| Deletion | Clear memory, revoke consent state, abort calls, ignore late responses | Back/refresh/late response tests, download notice |
| Supply chain | Lockfile, patched stable versions, minimal dependencies, license inventory | Advisory review and build provenance |
| Availability | Static safety/education available on provider failure; kill switch | AI off/429/timeout walkthrough |

No custom authentication is proposed for the synthetic runtime. If saved records are later approved, use a proven auth library/provider, secure HttpOnly cookies, ownership checks in the data access layer, CSRF protection, audit events and tested tenant isolation. Client route guards never provide authorization. Do not design clinical access around guessable URLs or shared unrevocable links.

## Jurisdiction assessment

Brunei's [PDPO 2025](https://www.agc.gov.bn/AGC%20Images/LAWS/Gazette_PDF/2025/EN/S%201_2025%20%5BE%5D.pdf) and [commencement notification](https://www.agc.gov.bn/AGC%20Images/LAWS/Gazette_PDF/2025/EN/S%2011_2025%5BE%5D.pdf) establish that core private sector obligations commenced 1 January 2026. Section 24 concerns overseas transfers. Map controller/processor roles, notices, purpose, safeguards and overseas hosting/API access with local counsel or AITI before collecting real data. Team location alone does not settle every applicable jurisdiction.

UAE [health ICT Law 2/2019](https://uaelegislation.gov.ae/en/legislations/1209/download) contains restrictions on overseas handling of relevant health service data. [Resolution 51/2021](https://uaephl.mohap.gov.ae/admin/Attachment/Download?id=8e6c0280-78fc-4b4f-bdb4-2637c2909b38&response=download) defines conditional exceptions. [PDPL 45/2021](https://uaelegislation.gov.ae/en/legislations/1972/download) excludes health data regulated by other legislation; do not treat it as the sole UAE regime. A cloud region or user consent does not by itself establish compliance.

Abu Dhabi's [Responsible AI Standard](https://www.doh.gov.ae/-/media/Feature/Resources/Standards/2025/Responsible-AI-Standard-V1.ashx) and [HTA guidelines](https://www.doh.gov.ae/-/media/Feature/Resources/Guidelines/2025/Health-Technology-Assessment-Guidelines.ashx) are relevant to licensed healthcare deployment and digital software evaluation. Regulatory classification depends on intended use, actual decision behavior and marketing. Ask qualified local advisers whether personalized navigation, screening, prediction or clinician decision support triggers device, facility or healthcare licensing and DoH approval. “Research” or “education” labels are not a legal exemption.

HIPAA depends on covered entity/business associate context; GDPR depends on relevant territorial and processing scope. Neither is automatically established by building a health app in Brunei. Make no compliance badge claim. A patient pilot requires intended-use review, impact assessment, processing contracts, clinical oversight, source permissions, retention/deletion operations and incident response before enrollment.

## Threat scenarios

A shared-device user may expose answers through a downloaded report or browser history. Use neutral URLs/title, no query values, optional Hide screen and explicit clear; explain remaining device limits. An attacker may extract provider keys or induce excessive cost: server only keys, quotas and no arbitrary prompt endpoint. A model may leak another case through a shared cache: no user content caches and isolation tests. A malicious source or dependency may inject instructions: reviewed content files, no live ingestion and no tool permissions. An operator may accidentally enable request tracing: launch review must inspect all telemetry, not just application logger settings.

Report omission must remove transitive reasons, prompts, source links/titles, variant labels and hidden metadata, as specified in document 09. A limited-summary notice replaces unsupported report action text; full app guidance is unchanged. Test both visible content and PDF/HTML metadata.

Public AI remains disabled until actual review/rights records and ADR 0004 deployed header/counter/token/log checks pass. Vercel and Upstash region choices do not prove provider-wide metadata residency or regulatory compliance. Read actual plans/retention and disclose IP metadata processing before enabling. No account or resource was created.

Source reuse is a security/commercial dependency too: link to WHO/AUA guidance, keep original summaries, retain rights notes, and seek permission where required for commercial adaptations. Do not put copyrighted tables or real patient data into a public repository, deck or model context.

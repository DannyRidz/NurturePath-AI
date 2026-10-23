# Research registry and skill provenance

Verified 23 October 2026. Sources establish guidance and product claims, not validation of NurturePath. Publication dates are shown where established; “current page” does not imply a new publication. Recheck clinical and vendor sources before release and before any pilot. This is a focused planning review, not a systematic review of all literature.

## Clinical sources

| ID | Organization, title and date | Population and planning use | Limits and rights |
|---|---|---|---|
| C1 | WHO, [Infertility guideline](https://www.who.int/publications/i/item/9789240115774), 28 Nov 2025; [recommendation summary](https://www.who.int/publications/i/item/B09599) | Prevention and infertility care; source for low cost information, supportive communication and consultation education | National adaptation intended, not a questionnaire triage algorithm. CC BY-NC-SA 3.0 IGO conditions; commercial reuse needs rights review |
| C2 | WHO guideline, [full text](https://www.ncbi.nlm.nih.gov/books/NBK620412/) and [male factor chapter](https://www.ncbi.nlm.nih.gov/books/NBK620436/), 2025 | Distinguish recommendation strength and certainty; avoid unsupported supplement claims | Treatment recommendations excluded from app logic; uncertainty often substantial. WHO copyright/license applies to hosted text |
| C3 | AUA/ASRM, [Diagnosis and Treatment of Infertility in Men](https://www.auanet.org/documents/Guidelines/PDF/2024%20Guidelines/Male%20Infertility%20Unabridged%20Final.pdf), 2020, amended 2024; [amendment summary](https://www.auanet.org/documents/Guidelines/PDF/2024%20Guidelines/Male%20Infertility%20Amendment%20Summary%202024.pdf) | Specialist evaluation of male infertility; history, examination and concurrent partner evaluation inform care preparation content | Not local Brunei/UAE protocol. Do not embed diagnostic/genetic testing thresholds. Copyright protected, do not assume commercial reproduction rights |
| C4 | WHO, [Semen laboratory manual, sixth edition](https://www.who.int/publications/i/item/9789240030787), 27 Jul 2021 | Laboratory staff, standardization of semen examination | Reference limits are not an individual fertility verdict. No report interpretation feature. Verify copyright page before reproducing tables |
| C5 | WHO, [Infertility fact sheet](https://www.who.int/news-room/fact-sheets/detail/infertility), 28 Nov 2025 | General population; definition, access barriers, social burden | Population figures cannot estimate an individual's risk; no local prevalence inferred |
| C6 | NHS, [Testicle lumps and swellings](https://www.nhs.uk/symptoms/testicle-lumps-and-swellings/), current page | Public urgent symptom education; sudden severe pain requires emergency attention | UK service terminology must be localized. Exact symptom wording and scope need local reviewer approval; verify reuse terms |
| C7 | WHO, [First global infertility guideline announcement](https://www.who.int/news/item/28-11-2025-who-issues-first-global-guideline-on-infertility), 28 Nov 2025 | Access, psychosocial support and stigma context | Announcement is not a substitute for recommendation tables |
| C8 | [Primary study on male infertility experiences](https://pmc.ncbi.nlm.nih.gov/articles/PMC10710112/), 2023; [support seeking study](https://pmc.ncbi.nlm.nih.gov/articles/PMC9621735/), 2022 | Diagnosed/selected participants report disclosure and support barriers; motivate neutral, private language | Small contextual samples, no Brunei/Emirati prevalence or proof our intervention works. Check each article's license before reuse |

C1/C2 recommend accessible fertility information and context appropriate support. Some lifestyle education recommendations are conditional with very low certainty; brief tobacco cessation advice is stronger. Neither source validates our proposed navigation rules. WHO's definition involving 12 months is not permission to tell every user to wait 12 months. Specialist pathways and urgent symptoms can justify earlier assessment. Review source currency with a clinician; no later AUA/ASRM male infertility amendment was established in this research.

## Legal and governance sources

| ID | Official source | Supported planning implication | Boundary |
|---|---|---|---|
| L1 | UAE [Federal Law 2/2019, health ICT](https://uaelegislation.gov.ae/en/legislations/1209/download) | Health data confidentiality and Article 13 restrictions on overseas handling can affect UAE health services | Applicability, exemptions and approvals require local counsel; consent alone is insufficient |
| L2 | UAE [Federal Decree-Law 45/2021](https://uaelegislation.gov.ae/en/legislations/1972/download) | General data protection, health sector exclusions and transfer provisions need scope analysis | Do not apply GDPR/HIPAA as interchangeable local law |
| L3 | MOHAP [Resolution 51/2021](https://uaephl.mohap.gov.ae/admin/Attachment/Download?id=8e6c0280-78fc-4b4f-bdb4-2637c2909b38&response=download) | Exceptions to health data restrictions have conditions | No exception assumed to authorize this app |
| L4 | Abu Dhabi DoH [Responsible AI Standard](https://www.doh.gov.ae/-/media/Feature/Resources/Standards/2025/Responsible-AI-Standard-V1.ashx), 2025; [HTA guidelines](https://www.doh.gov.ae/-/media/Feature/Resources/Guidelines/2025/Health-Technology-Assessment-Guidelines.ashx), 2025 | AI governance and digital software evaluation relevant to licensed clinical partner model | Does not settle this product's medical device or facility status |
| L5 | Brunei AGC [PDPO 2025](https://www.agc.gov.bn/AGC%20Images/LAWS/Gazette_PDF/2025/EN/S%201_2025%20%5BE%5D.pdf), 8 Jan 2025; [commencement notification](https://www.agc.gov.bn/AGC%20Images/LAWS/Gazette_PDF/2025/EN/S%2011_2025%5BE%5D.pdf) | Core private sector duties commenced 1 Jan 2026; section 24 addresses overseas transfer | Confirm controller, processors, exemptions and transfer safeguards with AITI/counsel before patient data use |

Use law texts for analysis, not marketing badges. Government document access does not itself grant rights to logos, endorsements or third party content.

## Data, market and engineering registry

| ID | Source and date/status | What was established | Limits / license |
|---|---|---|---|
| D1 | UCI [Fertility](https://archive.ics.uci.edu/dataset/244/fertility), donated 2013; [original paper](https://www.sciencedirect.com/science/article/pii/S0957417412007269), 2012 | 100 records, nine features, no released missing values; young Alicante volunteer cohort | CC BY 4.0; not representative, not a clinical predictor |
| D2 | [Synthea repository](https://github.com/synthetichealth/synthea), current | Synthetic histories and healthcare export examples | Apache 2.0 software; not validated male reproductive pathways |
| M1 | [ExSeed](https://www.exseedhealth.com/), [privacy](https://shop.exseedhealth.com/pages/data-security-and-privacy-policy), [instructions](https://www.exseedhealth.com/wp-content/uploads/2023/02/Information-For-You-Exseed-Health.pdf) | Smartphone testing, support and limitations; company claims | Current availability must be checked by country; copyrighted site content |
| M2 | [Legacy standard test](https://www.givelegacy.com/sperm-testing/standard-semen-analysis), [privacy](https://www.givelegacy.com/privacy-policy) | Mail in testing, optional storage, company privacy positioning | Price and stock variable, no Brunei/UAE access established |
| M3 | [Fellow kit](https://www.meetfellow.com/kit), [privacy](https://support.meetfellow.com/en/articles/8945494-how-do-you-protect-my-privacy), [availability](https://support.meetfellow.com/en/articles/4009081-where-is-fellow-available) | US mail in testing and private reports | No international service established; vendor claims are not independent audits |
| T1 | Next.js [installation](https://nextjs.org/docs/app/getting-started/installation), [data security](https://nextjs.org/docs/app/guides/data-security), [testing](https://nextjs.org/docs/app/guides/testing), current | App Router, server boundaries, explicit security checks and testing guidance | Installation page displays 16.4.2; recheck patched stable versions when authorized to build |
| T2 | [Zod](https://zod.dev/), current; [Tailwind compatibility](https://tailwindcss.com/docs/compatibility) | Runtime schemas and modern browser requirements | Zod schema validity does not establish clinical truth; browser support must be tested |
| T3 | W3C [WCAG 2.2](https://www.w3.org/TR/WCAG22/), Recommendation 12 Dec 2024 | AA accessibility targets | Automated checking alone cannot establish conformance |
| A1 | OpenAI [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna), [pricing](https://developers.openai.com/api/docs/pricing), [structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs), current | Suitable focused model and schema support; pricing snapshot in document 10 | Account access and actual explanation quality not tested |
| A2 | OpenAI [data controls](https://developers.openai.com/api/docs/guides/your-data), current | API training off by default; separate abuse retention and state storage controls | store=false is not zero retention; approvals and exceptions apply |
| A3 | Google [pricing](https://ai.google.dev/gemini-api/docs/pricing), [structured output](https://ai.google.dev/gemini-api/docs/structured-output), [terms](https://ai.google.dev/gemini-api/terms), [retention](https://ai.google.dev/gemini-api/docs/zdr), current | Paid Flash-Lite candidate; free and paid data terms differ | No sensitive data in free access; limited logging may remain on paid services |
| A4 | Anthropic [Haiku 5.5](https://platform.claude.com/docs/en/models/haiku-5-5/overview), [structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs), [training policy](https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training), current | Small model candidate with schema support and commercial data terms | No clinical reliability established; verify retention exceptions and selected feature terms |

No complete guideline, dataset, source deck, vendor text or copyrighted article was copied into this repository. Evidence cards should contain original concise wording, source links, edition, reviewer and permitted-use record. Publication access and license permission are different checks.

## Skills discovered and applied

The user's clarification identified [jsmastery-pro/skills](https://github.com/jsmastery-pro/skills). Its upstream descriptions match the installed named workflow skills. The collection is installed as individual skill folders, not a folder named JS Mastery Pro. Initial discovery therefore misidentified it as absent; that finding is corrected here. No new skill was installed.

| Skill and installed location | Planning influence and supporting files read |
|---|---|
| JS Mastery `architect`, `/Users/asmasalleh/.codex/skills/architect/SKILL.md` | Proposed ADRs, alternatives and value sourcing; read internal/design-conversation.md, agent-prompt.md, agent-modes/architecture.md and spec-template.md |
| JS Mastery `scope`, `/Users/asmasalleh/.codex/skills/scope/SKILL.md` | Separate coarse living scope from detailed backlog; read modes/plan.md and scope-template.md |
| JS Mastery `check`, `/Users/asmasalleh/.codex/skills/check/SKILL.md` | Runtime behavior verification is distinct from code review; inspected for future QA, not executed without an app |
| JS Mastery `test`, `/Users/asmasalleh/.codex/skills/test/SKILL.md` | Tests should prove caller behavior and trace acceptance criteria; inspected for strategy, no tests created |
| `frontend-design`, `/Users/asmasalleh/.codex/skills/frontend-design/SKILL.md` | Swiss versus Organic directions, exact anchor tokens, authored meaningful copy, no fabricated trust signals |
| `security-best-practices`, `/Users/asmasalleh/.codex/skills/security-best-practices/SKILL.md` | Next.js/React/general frontend references consulted for server boundaries, validation, XSS, caches and storage |
| `openai-docs`, `/Users/asmasalleh/.codex/skills/.system/openai-docs/SKILL.md` | Official docs search/fetch and model-selection.md; model recommendations use current documentation, no API run |
| Google Drive / Slides skills under `/Users/asmasalleh/.codex/plugins/cache/openai-curated-remote/google-drive/0.1.22/skills/` | Read only native official template content via connector; no copying/editing/authoring workflow invoked |

Other installed areas inspected: audit, develop, document, sync, debug, LangChain/LangGraph/Deep Agents, eval engineering and browser tooling. They are not all invoked: no code exists to audit or test, and no agent framework or RAG implementation is proposed. Relevant specialist Next.js/TypeScript planning facts come from official documentation, not an invented JS Mastery Next.js skill.

User instructions govern conflicts: this is a complete proposal for later approval, so architecture interview/installation/scaffolding steps are deferred; recommendations are not recorded as confirmed choices. Clinical safety takes priority over aesthetic rules. Research helpers only fetched sources; the main thread authored all planning documents. No independent clinical, legal or external model spec review has occurred.

## Revision 2 infrastructure and review provenance

The user authorized independent review and all eight planning fixes on 23 October 2026. GPT-6 Astra read all 28 original planning documents in a separate context and returned findings without source edits or new web verification. The main author checked references and revised the plan. Clinical/legal approval and implementation authorization are still absent. The review report preserves the original findings and records their disposition.

New official infrastructure sources checked for IR-07: [Vercel function regions](https://vercel.com/docs/functions/configuring-functions/region), [region list](https://vercel.com/docs/regions), [trusted ingress headers](https://vercel.com/docs/headers/request-headers), [Upstash region support](https://upstash.com/docs/redis/features/globaldatabase), [EVAL scripting](https://upstash.com/docs/redis/sdks/ts/commands/scripts/eval) and [key expiry](https://upstash.com/docs/redis/sdks/ts/commands/generic/expire). They support the chosen Singapore/shared-counter primitives, not actual account access, deployed enforcement, billing or physical erasure guarantees. Region/API/counter limits are team design choices. No account, installation or service was created.

## Staffing clarification, 23 October 2026

The user clarified that they alone build the app; Jeremiah is expected to do other work, with no specific task or availability assigned. Revision 3 carries forward the earlier 25h/week as a personal availability assumption and reduces the committed scope. This is user-provided planning context, not an external research finding.

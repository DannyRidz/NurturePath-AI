# Local coach experiment

* Use specification 0007 and root `design.md`. This workspace reuses canonical root scenario/report/session modules. Never copy or extend the medical catalog here.
* The user authorized the provider integration build on 6 November and ultimately selected Gemini. The credited service is Gemini Developer API through AI Studio. The user approved up to 60 local V01 attempts and USD 1 in reservations after qualification. Default mode remains authored simulation. Real dispatch requires qualified activation evidence under specification 0007; exact billable token bounds remain unresolved, so no activation record or real call has been made. No provider SDK or public activation is included. Never label the fixture as generated AI.
* Run commands from repository root: `npm run coach:init`, `npm run dev:coach`, `npm run build:coach`, `npm run start:coach`, `npm run typecheck:coach`, `npm run test:coach`, `npm run test:e2e:coach`.
* Launcher binds to 127.0.0.1:3000 and prompts for a masked local token. Only one runner may own the ignored metadata ledger. Preserve counters across restart, fail closed on stale/corrupt state and reconcile after a crash. No session facts, prompts, outputs or credentials may enter the ledger.
* Draft/token/consent stay in browser memory. Clear, Hide, withdrawal, dismissal, replacement and navigation invalidate requests. Root report content stays authored.
* Root build and Vercel must never include this workspace. CI builds/tests both separately and checks the root export through `scripts/check-coach-isolation.mjs`.
* Browser configuration uses temporary synthetic tokens and a separate ledger, never a real provider secret. It starts the optimized local server.

* Gemini launch uses separate counters and masked key input. `npm run test:e2e:coach:gemini` exercises provider UI with dispatch disabled. `lib/gemini.ts` binds expiring operator evidence to the exact request hash. Evidence assertions cannot substitute for authoritative cost bounds.

* The public coach now shares prompt and Gemini transport code under `src/lib/coach`. Keep this local workspace isolated from the public endpoint and preserve its own token and ledger behavior. Public authorization and spending controls are governed by the production continuation of specification 0007; no public route may use this workspace's filesystem ledger.

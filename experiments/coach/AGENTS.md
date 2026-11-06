# Local coach experiment

* Use specification 0007 and root `design.md`. This workspace reuses canonical root scenario/report/session modules. Never copy or extend the medical catalog here.
* Current adapter is authored simulation only. No fetch to a provider, provider SDK, API key or billing activation is authorized. Never label the fixture as generated AI.
* Run commands from repository root: `npm run coach:init`, `npm run dev:coach`, `npm run build:coach`, `npm run start:coach`, `npm run typecheck:coach`, `npm run test:coach`, `npm run test:e2e:coach`.
* Launcher binds to 127.0.0.1:3000 and prompts for a masked local token. Only one runner may own the ignored metadata ledger. Preserve counters across restart, fail closed on stale/corrupt state and reconcile after a crash. No session facts, prompts, outputs or credentials may enter the ledger.
* Draft/token/consent stay in browser memory. Clear, Hide, withdrawal, dismissal, replacement and navigation invalidate requests. Root report content stays authored.
* Root build and Vercel must never include this workspace. CI builds/tests both separately and checks the root export through `scripts/check-coach-isolation.mjs`.
* Browser configuration uses temporary synthetic tokens and a separate ledger, never a real provider secret. It starts the optimized local server.

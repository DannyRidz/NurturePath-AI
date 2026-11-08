# Local rehearsal simulation

Read [the implementation and verification record](../../docs/rehearsal-implementation.md) and [specification 0009](../../docs/specs/0009-conversation-rehearsal/index.md).

Commands use the root lockfile: `npm run build:rehearsal`, `npm run typecheck:rehearsal`, `npm run dev:rehearsal`, `npm run start:rehearsal`, `npm run test:e2e:rehearsal`. The launcher requires a local `REHEARSAL_LOCAL_TOKEN`, strips service credentials and binds 127.0.0.1:3002. Use invented text only. No provider transport, production endpoint, real allowance or personal intake is enabled.

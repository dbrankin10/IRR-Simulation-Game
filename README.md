# Imperium

Persistent alternate-history strategy PWA. The foundation build contains a responsive Next.js shell, draft world editor, Cloudflare API and Supabase owner-scoped draft persistence. It is not yet a playable simulation.

Use Node 24 or later. Run `npm ci`, `npm run typecheck`, `npm test`, then `npm run build`. `npm run preview` serves the exported app and API in the local Cloudflare runtime. Stop the preview before rebuilding on Windows because it holds the output directory open.

The tests cover Postgres ownership, idempotency, draft version conflicts, private schema access, cross-campaign references, stock constraints and observer-aware emergency timing. `docs/IMPLEMENTATION_STATUS.md` records implemented features and remaining scope. Full rules engines, causal retrieval, AI and Begin Reign are not yet connected.

Cloud targets supplied by the owner:

- Supabase project: `ztiasprnzbplewechvxj`
- Cloudflare account: `526a156954ae5456fdd161914d2c26e1`

No service credentials or AI keys are committed. Paid AI integration requires a provider and testing budget first. Existing Supabase schema must be inspected before migrations are applied.

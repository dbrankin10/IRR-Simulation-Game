# Implementation status

## Completed foundation

- Live deployment: https://imperium.dbrankin10.workers.dev (Cloudflare Worker `imperium`, static assets plus API). Source pushed to `dbrankin10/IRR-Simulation-Game` on `main`.
- Deployment uses a dedicated account-scoped user token with Workers Scripts edit and Account Settings read. No unrelated project's build token is used. Cloudflare Git-triggered builds are not yet connected; the initial deployment was made directly with Wrangler.
- Next.js static React PWA shell, responsive five-tab navigation and world-creation notes editor.
- Cloudflare Worker API with Supabase token verification, typed draft validation and versioned/idempotent save calls.
- Supabase migration applied through the authenticated project SQL editor: 17 application tables in private schemas, all with RLS enabled. Three authenticated owner-scoped RPC functions expose only draft metadata/content. No service-role key is used.
- Local Postgres-compatible integration tests pass for migration execution, ownership, direct-table denial, conflicting versions, idempotency and cross-campaign foreign keys.
- Domain tests cover hard inventory conservation and awareness-based interrupt boundaries.
- Production smoke checks: health/config and PWA load; unauthenticated campaigns return 401. Owner login and versioned Supabase draft saving are verified. Fifteen tests, TypeScript/build checks and a real workerd/SQLite mocked-provider integration test pass.

## Architectural decisions made during implementation

The frontend uses Next.js static export hosted by Cloudflare Worker assets. Interactive data remains in the API, so no Next runtime adapter is required for this phase. This preserves React/Next/Cloudflare choices while keeping simulation out of UI rendering.

For this initial private build, Supabase's browser client manages its session; the Worker independently validates tokens. This differs from the planning preference for server-managed cookies. Tokens are never placed in campaign content or logs. No AI or imported Markdown is rendered as HTML. Moving to server-managed cookies remains a security-hardening task before broad public release.

The publishable Supabase key is intentionally public client configuration. No secret Supabase or AI key belongs in the repository. SQL tables contain no public read grants. The dashboard account login is separate from a game-user Auth account.

## Not yet implemented

This is not a playable simulation. Full structured creation forms/validation, Begin Reign, turn orchestration, causal retrieval/embeddings, economic/political/military reducers, AI council/actors, map layers, correction editor and God Mode remain on the accepted plan. Current domain screens are explicitly labeled as in development; they do not display invented campaign outcomes.

Optional owner-only AI draft review is implemented with a pinned OpenAI adapter, server-only credential, atomic non-resetting $9 spending ledger within the approved $10 total, bounded requests and duplicate protection. See `AI_TESTING.md` for accounting and uncertain-outcome semantics. Full AI council/actor orchestration remains unimplemented. The accepted scope remains in the companion specifications; this milestone does not redefine completion.

## AI live verification — 2026-09-14

Deployed Worker version `af3dba83-f045-4457-afa7-2ab1e8eb8731`. The owner-authenticated development-only smoke draft saved as versions 1 and 2. Version 1 failed because native fetch had an invalid receiver in workerd; its $0.10 reservation remains held conservatively. A real workerd regression test reproduces the failure before the wrapper fix and passes afterward, including SQLite settlement and duplicate suppression, without paid traffic.

Version 2 returned a validated structured review: pinned model `gpt-5.4-mini-2026-03-17`, 601 input and 799 output tokens, 4,047 microdollars ($0.004047) conservatively accounted. The response preserved 1,032 total / 700 proposed / 332 available, identified missing domains, and made no draft changes or time advance. Reopening the same version returned the same result with unchanged ledger: $0.0040 displayed accounted, $0.1000 held, $8.8960 available. Held funds are reservations, not confirmed charges. No automated retries or paid background loops are enabled.

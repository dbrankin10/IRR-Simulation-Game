# Implementation status

## Completed foundation

- Next.js static React PWA shell, responsive five-tab navigation and world-creation notes editor.
- Cloudflare Worker API with Supabase token verification, typed draft validation and versioned/idempotent save calls.
- Supabase migration applied through the authenticated project SQL editor: 17 application tables in private schemas, all with RLS enabled. Three authenticated owner-scoped RPC functions expose only draft metadata/content. No service-role key is used.
- Local Postgres-compatible integration tests pass for migration execution, ownership, direct-table denial, conflicting versions, idempotency and cross-campaign foreign keys.
- Domain tests cover hard inventory conservation and awareness-based interrupt boundaries.

## Architectural decisions made during implementation

The frontend uses Next.js static export hosted by Cloudflare Worker assets. Interactive data remains in the API, so no Next runtime adapter is required for this phase. This preserves React/Next/Cloudflare choices while keeping simulation out of UI rendering.

For this initial private build, Supabase's browser client manages its session; the Worker independently validates tokens. This differs from the planning preference for server-managed cookies. Tokens are never placed in campaign content or logs. No AI or imported Markdown is rendered as HTML. Moving to server-managed cookies remains a security-hardening task before broad public release.

The publishable Supabase key is intentionally public client configuration. No secret Supabase or AI key belongs in the repository. SQL tables contain no public read grants. The dashboard account login is separate from a game-user Auth account.

## Not yet implemented

This is not a playable simulation. Full structured creation forms/validation, Begin Reign, turn orchestration, causal retrieval/embeddings, economic/political/military reducers, AI council/actors, map layers, correction editor and God Mode remain on the accepted plan. Current domain screens are explicitly labeled as in development; they do not display invented campaign outcomes.

No paid AI calls are enabled. Provider selection, a testing budget and credentials are required before live AI integration. The accepted scope remains in the companion specifications; this milestone does not redefine completion.

# AI draft review and lifetime spending guard

## Scope

The owner authorized USD 10 total for testing. Optional AI review is limited to the owner's verified Supabase user ID, an owned saved campaign draft and its exact version. It does not change the draft, create canonical state, advance time, generate sealed actor secrets, or query other campaigns. Suggestions are displayed as plain React text, not executable HTML. The feature is not the turn engine, historical grounding, or a replacement for structured world creation.

The first adapter uses `gpt-5.4-mini-2026-03-17`, the standard Responses endpoint/tier, no reasoning, no tools, `store:false`, strict JSON output and a 2,400 output-token ceiling. The entire saved draft must fit 24,000 UTF-8 bytes; oversized drafts are rejected without truncation or provider calls. The full draft remains in Supabase unchanged. The model has no web research capability in this flow and must label unknowns/assumptions honestly.

## Accounting and failure semantics

- One SQLite-backed Cloudflare Durable Object, using the fixed name `imperium-testing-lifetime-v1`, owns the spending ledger. This is operational billing state, not canonical game state; Postgres remains the canonical simulation database.
- The ledger enforces USD 9 total, reserving USD 1 of the approved budget as a safety margin. It never resets on dates, campaigns, reloads, deployments or user sign-in. Do not rename/delete this object or its namespace to reset spending.
- Before any provider dispatch, an atomic transaction reserves USD 0.10 and records an owner/campaign/version key and content fingerprint. Parallel requests cannot spend the same remaining funds.
- One dispatch per saved version. Duplicate requests return the stored result without another paid call. A conflicting fingerprint fails closed. Derived review results remain owner/campaign-scoped in the operational store.
- New requests are throttled to one per 15 seconds. There are no automatic provider retries, paid tools, autonomous loops, or background model calls.
- Verified usage replaces the reservation, rounded up to integer microdollars. Input tokens are accounted at the uncached rate, including cached inputs, deliberately overstating rather than understating cost. Pricing checked September 14, 2026: $0.75 / million input and $4.50 / million output tokens.
- Timeout, lost response, model mismatch or unverifiable usage retains the entire reservation. A dispatched request that crashes before settlement remains pending and cannot be redispatched. Retained holds need explicit operator reconciliation against provider usage, not automatic refunds.
- Refusal, incomplete output and invalid JSON still account for valid reported usage. An amount above the reservation records actual usage and disables new requests pending review.
- New requests stop automatically on October 14, 2026 pending pricing/credential review. This is a fixed safety cutoff, not a recurring authorization.
- Provider hard limits are secondary protection: the Default project has a $10 monthly hard limit, auto-reload is OFF, and initial prepaid credit was $10. Provider enforcement may lag and the monthly limit resets; it is not the lifetime app ledger.

## Secrets and access

`OPENAI_API_KEY` is stored only as a Cloudflare secret. It expires October 14, 2026 and has restricted Responses permissions. No service-role Supabase key is required. The browser cannot choose a model, provide a prompt or alter the budget; it sends only the saved version number. The server retrieves the owned draft itself, validates it, checks exact origin and authenticated owner, and calls the private Durable Object binding. Public config never includes the OpenAI credential.

Cloudflare deployment costs are distinct from this AI budget. No paid Cloudflare plan upgrade was requested. The guard uses SQLite Durable Objects supported by the deployed runtime; if deployment requires additional billing or permissions, stop for review.

## Verification

Automated tests cover owner authentication, wrong-origin rejection, stale-version rejection, unowned drafts, forbidden client model overrides, oversized bodies, atomic concurrent reservations, replay, cross-campaign result isolation, shared budget, retained uncertain charges, refusals, rate limiting, expiry and cost anomalies. Provider tests use a deterministic fake transport and make no paid calls.

Live authenticated testing is recorded separately in the delivery checkpoint. Do not infer a paid smoke test succeeded from unit-test success or from an uploaded secret.

Sources:

- https://developers.openai.com/api/docs/models/gpt-5.4-mini
- https://developers.openai.com/api/docs/guides/structured-outputs
- https://developers.openai.com/api/docs/guides/spend-limits
- https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/

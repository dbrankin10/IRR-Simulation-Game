# IMPERIUM — Build Specification

Status: planning package updated with accepted Q01–Q18 review decisions on 2026-09-14; full application implementation remains paused.

Authoritative source: `C:\Users\Daniel Brankin\IRR Simulation Game\Build Instructions\IMPERIUM_REQUIREMENTS_v0.3.md`, all 79 sections, 2,395 lines. SHA-256: `9A8506AAFD6A7E2B5E96D8B1B4F4488156CA4AE7EF936E3880B354D0EB93D470`. Prepared 2026-09-14.

This package translates v0.3 into an engineering proposal. The source and subsequent explicit user review decisions govern; the latter refine the initial proposal. Requirements described there as possible, recommended, or examples retain that status; examples are fixtures, not mandatory world history. Q01–Q18 product directions are accepted; unquantified engineering parameters remain to be specified and tested. Decisions are recorded in [UNRESOLVED_QUESTIONS.md](UNRESOLVED_QUESTIONS.md).

Companion documents: [architecture](ARCHITECTURE.md), [database schema and ERD](DATABASE_SCHEMA.md), [phases and verification](IMPLEMENTATION_PLAN.md).

## 1. Product contract

Accepted review refinements (2026-09-14): discussions and decisions occur at a fixed simulated date; ending the turn requests elapsed time. Normal dossiers are generally accurate assessments, compensating for absent interpersonal cues while preserving possible evidence-based deception. Important figures and political blocs receive detailed political modeling. Minor world actors use lightweight background simulation and become detailed when relevant; this does not erase their canonical state, resource constraints or causal history. The complete accepted decision register remains in `UNRESOLVED_QUESTIONS.md` for link continuity.

Imperium is a persistent, single-player, mobile-first geopolitical simulation in which the player governs through a configurable office and institutions. IRR is a scenario, never an application constant. The loop is briefing, questions, meetings, decisions, requested time advance, simulation, new briefing. Real-world inactivity advances no simulated time. Other actors act independently, including outside the player's immediate sphere.

Realistic difficulty means interests, constraints, incomplete information, failure, and consequences; no plot armor, crisis quota, predetermined war, or forced recovery. The scope excludes tactical RTS control, tile civilization building, multiplayer, routine low-level tax management, and fixed branching stories. These exclusions do not remove detailed military or economic state.

### Non-negotiable invariants

| ID | Contract | Enforcement |
|---|---|---|
| I01 | Database state is authoritative; prose is never state | Typed commands, validated reducers, transactional commits |
| I02 | Quantities cannot be invented or double-spent | Resource/manpower ledgers, reservations, units, capacity and conservation checks |
| I03 | Campaigns share no mutable state or memory | Composite campaign foreign keys, authorization, retrieval and storage scoping |
| I04 | Normal play never receives hidden truth | Separate observer projections, retrieval principals and response schemas |
| I05 | Actors possess objectives, beliefs and constraints independent of the player | Persistent actor plans and scheduled evaluation, no player-only activation rule |
| I06 | Consequences survive years and transcript pruning | Immutable events/decisions, causal graph and indexed Strategic Threads |
| I07 | No simulation advances because wall-clock time passes | Only an accepted advance request permits simulation execution |
| I08 | Emergency stops at its simulated occurrence/detection boundary | Chronological checkpoints; no post-boundary effects committed |
| I09 | Authority, appropriations and release rules constrain actions | Shared policy interpreter at order confirmation and execution |
| I10 | Baseline corrections are not in-world acquisitions | Distinct correction ledger, effective-time semantics and impact review |
| I11 | AI provider changes do not change domain contracts | Provider adapters, capability negotiation and versioned structured proposals |
| I12 | Military control is strategic/high operational | Intent, COAs, restrictions and commander execution; no tactical movement UI |
| I13 | Original history survives summaries | Immutable source records; summaries are replaceable derivatives |
| I14 | External grounding cannot overwrite campaign reality | Import provenance plus explicit draft/correction commands only |

## 2. World creation and validation

One persisted draft supports forms, guided questionnaires and AI conversation; all edit the same typed draft. Every inferred/generated field carries provenance and review status. Save/resume includes unresolved questions. Show the source's message: “The more detail you provide during World Creation, the more consistent and realistic the simulation can be.”

Creation screens:

1. Campaign basics: name, start date, world type, divergence, technology era, realism, default duration, role, game-over rules, grounding toggle.
2. Baseline: date-qualified sources, coverage, uncertain/missing data, alternate-history overrides. A snapshot of the selected period is not a live news feed.
3. Nation and geography: common/official names, symbols/flag, territories and modern equivalents, administrative hierarchy, capital/cities, population/demographics, languages/religions/culture, identity/history/constitution.
4. Governance & Authority: offices, powers, unilateral/approval/prohibited/emergency/ratification paths for every category in source §8, including nuclear two-person and delegation rules.
5. Government and politics: institutions, succession, elections/appointments, legislation, courts, provinces, parties/factions, civil service, coalitions and tensions.
6. Cabinet and people: create ministers or generate materially different candidates; capture the complete §14 profile, including doctrine, biography, relationships, competence, ambition, biases and private concerns.
7. Military: configurable administrative and operational chains, unit tree, bases, personnel, stocks, procurement, readiness, logistics, doctrine and strategic release rules. Optional nuclear setup includes delivery systems, warheads, survivability, second strike and command/control.
8. Economy: every §21 field, budgets/debt, resources, supply chains, industries, infrastructure and strategic dependencies.
9. Intelligence: organizations, foreign/domestic/military/cyber/space/SIGINT/HUMINT/counterintelligence capabilities, legal powers and knowledge baselines.
10. Other actors and international relations: nations, leaders, agencies, firms, commands, insurgencies, institutions, treaties, wars and hidden strategies. Generation policy for secrets is Q04.
11. Review World: structural errors, inconsistencies, unknown critical quantities, authorities without procedures, formations without bases, undefined cabinet posts, missing supply chains and implausibility warnings. AI adds semantic findings; deterministic checks cannot be waived by AI.
12. Begin Reign: atomically freeze baseline revision 1, create canonical World State v1, player knowledge and initial briefing, initialize Turn 1, and lock launch against duplicate submissions. No interval is advanced by launch itself (accepted Q15).

Fatal structural errors block launch. Plausibility concerns can be accepted explicitly as campaign assumptions; missing mechanics that would make orders unenforceable require resolution. No numerical blanks silently become zero.

## 3. Gameplay systems

### Discussion, meetings and directives

Home supports routine/emergency briefings, follow-ups, pending decisions, directives and cross-domain intelligence. Council, security, war, economic, energy, private, diplomatic and custom meetings use persistent participants. Each participant reasons from their own knowledge and character profile. Disagreement, persuasion, resignations, leaks, errors and bureaucratic alliances have structured causes and effects.

Exploratory text creates a discussion record. An apparent instruction creates a directive proposal with interpreted scope, resources, timing, restrictions and required approvals. Player confirmation creates the decision/order record; conversation alone does not deploy forces or appropriate money. Rejection and modification are preserved. Ambiguous language cannot silently authorize an irreversible in-world effect. Under accepted Q02, meetings and political/diplomatic interactions consume no simulated time. The decision phase stays at the current date until the player ends the turn; elapsed-time effects then resolve during the requested advance. Dialogue/commitment state can change at the fixed timestamp. No meeting time charge or action-point budget is introduced, and repetition alone cannot generate repeated persuasion gains or intelligence.

### Domestic politics

Candidate cards and normal dossiers expose assessments only, including competence and loyalty. They should generally give a dependable picture rather than routinely mislead the player. Descriptive reporting can convey observable hesitation, inconsistency or other relevant interpersonal indicators when supported by the encounter. Confidence, uncertainty and justified deception remain possible; this does not expose private plans or exact true traits. Repeatedly reopening or rephrasing a query must not reroll a dossier.

Politics updates at every simulation interval, not only votes. Canonical state includes public/elite/faction/regional support, institutional resistance, coalitions, ambitions, agendas, scandals, unrest, war fatigue and dissatisfaction. Individual and bloc actors have private intentions. Player dossiers hold separately sourced factual and assessed fields with confidence and observation dates; known public roll-call votes differ from estimated future votes.

Legislation progresses through configured introduction, committee, debate, amendments, votes, assent, review and implementation procedures. Quorum, thresholds, veto, ratification, emergency expiry and appropriations authority are rules, not model suggestions. Political bargaining modifies objectives, relationships and support through validated actions. Elections, succession, appointments, removal and government collapse are scheduled/triggered political processes. Use important individual figures plus political blocs (accepted Q07), with disjoint seat accounting and exact vote totals. Coefficients are engineering calibration, not another approval of this product direction.

### Military

Store nation/service/theater/formation/unit hierarchy through battalion, ship and aircraft unit where configured, plus distinct operational command relationships. Unit records include authorized/actual personnel, commander, home/current location, readiness, morale, training, fuel/ammunition/equipment, logistics, status and mission. Higher totals are computed from disjoint holdings rather than independently editable duplicates.

A directive expresses objectives and constraints. Commanders propose COAs including concept, forces, timeline, logistics, risk, escalation, intelligence assumptions, expected enemy response and readiness impact. Approval binds a COA version; material changes require reauthorization. Execution checks homeland/third-country strikes, mobilization, nuclear release and other configured sensitive actions at the point of use. Authorizing a plan is not permission to exceed its restrictions.

Combat is a proposed aggregate operational model using geography, force capability, logistics, readiness, doctrine, commander competence, intelligence, duration and seeded uncertainty. Rules allocate expenditure, casualties, equipment losses and movement. No free reinforcements; production, import, transfers and contracts require real capacity, inputs and lead times. Aggregate operational resolution with detailed organization/inventories is accepted under Q08; numerical calibration remains documented, tested engineering work.

### Economy, finance and diplomacy

Economy covers macro indicators, population, labor, energy, resources, industrial capacity, transport infrastructure, trade, dependencies and simulated markets. Finance tracks revenues, appropriations, commitments, spending, debt issuance/service and multi-year programs. Monetary stocks and flows have explicit currency, units and period. Market movements derive from simulated conditions and bounded calibrated rules; no live feed rewrites alternate history.

Diplomatic contacts support calls, summits, notes, private/back-channel and multilateral meetings. Nations and leaders pursue their interests and domestic constraints. A promise is not a ratified treaty. Treaty obligations, sanctions, recognition, war state and breaches are structured, legally gated and causally linked. Foreign actors can refuse, mislead or abandon a strategy.

### Intelligence and world events

Distinguish truth, each actor's beliefs and the player's government's beliefs. Intelligence collection creates observations, sources, reports and assessments with confidence, alternatives, staleness and uncertainty. Actors may hold false beliefs; collection capabilities and institutional access control what they can learn.

Events may be political, military, natural, industrial, health or infrastructure events, including ones unrelated to the player. Source §34 severity is 0–5; accepted Q03 uses default 4–5 plus player awareness and decision relevance. Hidden events do not interrupt before detection, and unrelated foreign crises do not automatically interrupt. World-event markers include observed location, severity, casualties, outages, damage, strategic effects and confidence, when known.

### Strategic Threads and causal memory

Threads represent persistent vulnerabilities, resilience, resentments, commitments and other causal conditions. Store all §40 fields, including origin, resources, participants, conditions, activation rules, mitigations and amplifiers. Lifecycle supports Dormant, Growing, Declining, Active, Critical, Resolved and Neutralized. Dormant threads are retained and dependency-indexed; semantic similarity is not their only activation mechanism.

Every material outcome links to its factual contributing events/decisions and evaluated conditions. Keep true causal relations separate from an actor's causal hypotheses. A recorded strategy rejection such as “embargo has insufficient leverage” is a meaningful hidden result even if no attack follows. Positive resilience receives the same treatment as threats.

### Editing and termination

World Editor exposes draft editing, Baseline Correction and explicit God Mode as distinct modes. God Mode reveal/edit/force-event actions are audited and never cached in normal screens. Baseline corrections use effective historical dates and never appear as deliveries or discoveries. Accepted Q01 requires a non-destructive impact preview and logged historically effective correction while preserving original resolved events/decisions. Update current corrected facts and affected projections without replaying past outcomes or inventing deliveries; future simulation uses the corrected state.

Game-over rules are campaign data. Intended default is removal as Emperor ends the campaign; defeat alone does not. Death, succession, government collapse, national extinction and campaign terminal events are evaluated through configured rules. Accepted Q11 preserves readable history after termination and permits continuation only through campaign-configured rules.

## 4. Mobile information architecture

| Navigation | Screens and components |
|---|---|
| Home | Briefing feed, speaker cards, council transcript, meeting composer/participants, decision queue, directive confirmation, authority status, advance preview, progress/resume and emergency council |
| Map & Intelligence | MapLibre map, layer selector for political/military/diplomatic/economic/trade/energy/alliance/conflict/intelligence/events; observed event markers; nation profile drawer; intelligence evidence/confidence |
| Military | Overview, force organization tree, disposition, inventory tables, formation readiness, operations and restrictions, COA comparison, release authorization, procurement |
| Government | Stability/support dashboard, legislature/committees, parties/factions, political intelligence, people/dossiers, legislation/votes and concessions |
| Finance & Economy | Macro dashboard, treasury and ministry budgets, appropriations, projections, strengths/weaknesses, markets, industries, resources and trade/chokepoints |
| Secondary menu | Archives/causal history, campaigns, creation/resume, settings, World Editor and separately gated God Mode |

Shared components: campaign/date header; quantity with units; estimate/range/confidence display; source/evidence drawer; entity picker; timeline; causal-link viewer; responsive data table; accessible bottom sheet; empty/loading/error/stale states; offline banner; version conflict dialog; change-impact preview. Archive browsing supports structured filters and conversational retrieval, preserving access to original records.

Visual direction: imperial red/burgundy/purple, muted gold, charcoal, restrained stone/parchment accents, Roman serif display type with readable body text, subtle classical iconography. Serious, restrained and sophisticated; campaign office names remain data. Accessibility includes contrast, readable scaling, keyboard/focus behavior, reduced motion and non-color status signals.

PWA target is iPhone Safari and Add to Home Screen: portrait-first, safe areas, touch controls, persistent session, quick reopen, manifest/icons, cached shell and graceful offline behavior. Recommended offline scope is shell plus explicitly cached player-known read views and local draft text; confirmed directives, turns and edits require a live version check. Accepted Q12 excludes an executable offline action queue from initial scope. Future push registration is a reserved interface, not simulation advancement.

## 5. Domain and API contracts

All external endpoints are `/api/v1`; campaign endpoints begin `/campaigns/{campaignId}`. Auth determines owner and observer; clients cannot select arbitrary observer IDs. JSON schemas reject unknown mutation fields. UUID identifiers, ISO date-time strings and decimal strings for exact quantities are used. Accepted Q10 sets initial scope to Gregorian Earth geography with editable political boundaries and future adapters.

Read envelope: `{data, campaignId, revision, simTime, knowledgeAsOf, requestId}`. Unknown information is explicit as unknown/estimated/range, not a fabricated scalar. Paginated collections use opaque cursors tied to a revision. Errors use `{code, message, requestId, retryable, details}` with no secret facts in details.

Every mutation carries `Idempotency-Key` and `expectedRevision`; reuse with a different request body fails. Stale revision yields 409. Invalid command yields 422; forbidden/non-owned resource is consistently 404 or 403 according to endpoint policy without revealing existence. Long jobs return 202 with job ID and status URL.

| Method / campaign-relative path | Contract |
|---|---|
| `POST /campaigns` (root) | Create owned draft from explicit basics; returns draft ID/version |
| `GET /campaigns`, `GET /` | List owned campaigns; campaign metadata only |
| `GET/PATCH /draft` | Typed draft/field provenance; PATCH requires draft version |
| `POST /draft/generate`, `/draft/import` | Generation/import jobs; stage suggestions and source metadata |
| `POST /draft/validate`, `/begin-reign` | Validation report; atomic launch using approved draft hash |
| `GET /home`, `/nations/{id}`, `/military`, `/government`, `/economy` | Observer-safe projections at one revision |
| `GET /map` | Bounding box/layer/revision; known geometry and events only |
| `POST /meetings`; `POST /meetings/{id}/messages` | Participants/type; discussion text and validated response job |
| `POST /directives/preview` | Text or structured intent; returns proposal, authority requirements and known costs |
| `POST /directives/{id}/confirm` | Confirms exact proposal hash; creates decision and executable/pending order |
| `POST /directives/{id}/cancel` | Validated cancellation, preserving prior irreversible effects |
| `POST /operations/{id}/coas`; `POST /coas/{id}/decision` | Request alternatives; approve/reject/modify exact plan version |
| `POST /authorizations/{id}/decision` | Approve/reject with current authority and scope checks |
| `POST /legislation`; `POST /legislation/{id}/actions` | Propose/amend/submit/bargain according to institutional procedure |
| `POST /diplomacy/contacts`; `POST /treaties/{id}/actions` | Contact request or negotiate/sign/ratify according to authority |
| `POST /turns/preview` | Requested duration; returns target and observer-safe unresolved warnings |
| `POST /turns` | Start authorized advance; warnings acknowledged, target, expected revision |
| `GET /turns/{id}` | State, committed date, target, safe progress, interruption and briefing status |
| `POST /turns/{id}/resume` | Explicit continuation after emergency with retained or revised target |
| `GET /archives`; `POST /archives/query` | Scoped filters or bounded retrieval with source references |
| `POST /edits/baseline/preview`, `/apply` | Impact report then exact correction proposal; preserve original resolved history under accepted Q01 |
| `POST /god-mode/session`; `GET /god-mode/entities/{id}` | Explicit mode entry and audited truth read; separate DTO and cache policy |
| `POST /god-mode/edits/preview`, `/apply` | Versioned truth alteration/forced event and audit |
| `POST /assets/upload-intent`, `/assets/finalize` | Campaign-scoped signed upload then validation/hash confirmation |
| `GET /jobs/{id}` | Owner-safe status; no hidden step names or model reasoning |

No generic client endpoint accepts arbitrary SQL, state patches or AI-supplied table names.

### Required structured records (schema design, not application code)

`Event`: schemaVersion, id, campaignId, revision, simTime, recordedAt, eventType, actor/region references, severity 0–5, typed truePayload, causalNodeId, turnStepId, provenance. Separate `EventObservation`: eventId, observerId, observedAt, knownPayload, confidence, evidence and alternatives. The §59 combined example is split physically to enforce secrecy.

`Decision`: schemaVersion, id, campaignId, issuerActorId, simTime, title, objectives, confirmedProposalHash, authorityEvidence, relatedEntities, expectedEffects, executionStatus, causalNodeId. Actual effects are separate linked outcome events; anticipated consequences are not marked as accomplished facts.

`StrategicThread`: schemaVersion, id, campaignId, title, type, createdSimTime, lifecycle, accessPolicy, originNodeId, severity, probability, direction, conditions, activationRules, mitigation/amplifier references, notes. Links relate decisions, actors and resources; evaluations record input revision, eligibility, current exposure, result and reasons. Probability is explicitly conditional, not a hidden command to force an event.

`ActionProposal`: schemaVersion, proposalId, campaignId, actorId, baseRevision, actionType, typedParameters, evidenceRefs, requiredApprovals, expectedCosts and bounded rationale. Allowed variants include diplomatic_offer, introduce_legislation, request_deployment, production_order, collect_intelligence and relationship_adjustment. Each has a registered validator; AI cannot submit arbitrary row modifications.

`PoliticalProcess`: procedureId/version, institutionId, subject/legislationId, stage, deadlines, participants, quorum/threshold rules, approvals and result. `VoteEstimate` is observer-specific; `VoteOutcome` is canonical and only published if known.

`MilitaryIntent`: objective, theater, constraints, forbiddenTargets, escalationCeiling, requestedDeadline and authorizations. `COA`: version, intentId, assignedForces, concept, logistics, timeline, risks, assumptions, expectedEnemyResponse and readinessImplications. `ResourceDelta`: resourceId, holderId, quantity, unit, reason, pairedTransfer/production/loss evidence and ledger idempotency key.

Full machine-readable schemas and executable SQL are phase P1 deliverables, after review; this package specifies their fields, relationships and constraints without beginning application implementation.

## 6. Requirement traceability

This index covers every source section. “Phase” identifies delivery, not permission to omit the item from later scope.

| Source sections | Design home | Phase / acceptance |
|---|---|---|
| 1–3 | Product contract, invariants, architecture | All / I01–I14 |
| 4–9 | World creation, governance schema | P2 / creation and authority fixtures |
| 10–15 | Domestic politics, character knowledge/meetings | P4 / political scenario and character tests |
| 16–20 | Military intent, hierarchy, inventory rules | P1/P5 / inventory and release tests |
| 21–22 | Economy/finance model and schema | P3 / accounting and capacity tests |
| 23–26 | Diplomacy, actors, knowledge isolation | P3/P4 / independent agency and fog tests |
| 27–28 | Editing modes, temporal history | P2/P7 / Q01 and editor tests |
| 29–31 | Nuclear structures, collection/reports | P2/P5 / release and uncertainty tests |
| 32–34 | Turn request/interrupt state machine | P3 / interruption and no-clock tests |
| 35–38 | PWA navigation, meetings/directives | P2/P4/P6 / browser interaction tests |
| 39–44 | Decision ledger, threads, graph, political causality | P1/P3/P4 / energy and war-fatigue chains |
| 45–48 | Seven memory layers, archives/summaries | P3/P6 / five-year bounded retrieval |
| 49–51 | Map, profiles, independent world events | P6 / hurricane scenario |
| 52–55 | Military/government/finance screens; cross-cutting intelligence | P4/P5/P6 / domain screen coverage |
| 56–60 | Rules, AI proposal validation, chronological engine | P1/P3 / transaction and canonical integrity tests |
| 61–62 | Database catalog, composite keys/security | P1 / migration and isolation tests |
| 63–66 | Provider adapters, routing, proposal/narrative checks | P3 / provider conformance and contradiction tests |
| 67–68 | World review, launch and terminal predicates | P2/P4 / validation and game-over tests |
| 69–70 | Design system, iPhone PWA lifecycle | P2/P6 / real-device verification |
| 71–74 | Architecture/deployment and non-goals | P0–P7 / integration gates |
| 75–78 | Three acceptance scenarios, long-term standard | P3–P7 / scenario suite |
| 79 | This package plus approved implementation artifacts | P0/P1 / review then schemas/migrations |

## 7. Definition of completion

An architecture prototype must pass the energy causal-memory scenario with bounded context, hard quantities, actor-private planning, player-safe intelligence and repeatable commits. It is not the full product. A complete first release must additionally deliver the politics and world-event scenarios, all required creation/domestic/military/economic/diplomatic systems, editor distinctions, archives and iPhone PWA behaviors. Optional/example content is supported by extensible data structures rather than forced into every campaign. No phase can relabel a required missing system as complete.

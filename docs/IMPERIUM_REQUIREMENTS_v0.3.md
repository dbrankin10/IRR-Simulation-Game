# IMPERIUM
## AI Grand-Strategy / Alternate-History Simulation PWA
### Consolidated Product & Technical Requirements — v0.3

---

## 1. Product Vision

Imperium is a mobile-first, installable Progressive Web App (PWA) for running persistent, AI-driven grand-strategy and alternate-history geopolitical simulations.

The player governs a nation as its head of state. The initial flagship use case is the **Imperial Roman Republic (IRR)** in a modern alternate-history world, but the application must **not** be hard-coded around the IRR. A player must be able to create multiple independent campaign worlds with different nations, histories, governments, militaries, economies, alliances, leaders, political systems, and geopolitical conditions.

The desired experience is a blend of:

- grand strategy
- geopolitical simulation
- intelligence briefing
- cabinet / council roleplay
- political strategy
- military command at the head-of-state level
- economic and budget management
- emergent alternate history

The overall feel should evoke the seriousness and atmosphere of **Rome: Total War** and **Medieval II: Total War**, but Imperium is **not** intended to be a tactical RTS or Total War clone.

The central fantasy is:

> **“I am actually governing this country, while the rest of the world has its own objectives, capabilities, secrets, fears, plans, and constraints.”**

---

## 2. Core Design Pillars

### 2.1 Persistent world, turn-based time

The world is persistent, but it does **not** advance in real-world time.

If the player does not open the app for two months in real life, zero simulated time passes.

Time advances only when the player advances the game or when an in-turn emergency interrupts an already-requested time advance.

A campaign defines a default turn duration during World Creation, such as:

- 3 days
- 1 week
- 2 weeks
- 1 month
- 3 months
- 6 months

The player may use shorter or longer intervals when appropriate.

### 2.2 The world has independent agency

Other countries, leaders, political factions, corporations, military commands, insurgent groups, intelligence services, and other relevant actors have their own persistent goals and strategies.

They do not exist merely to react to the player.

Major actors should maintain:

- long-term objectives
- current priorities
- fears
- red lines
- capabilities
- political constraints
- economic interests
- military plans
- intelligence assessments
- active operations
- relationships
- hidden initiatives
- misperceptions

### 2.3 Long-tail causality

Decisions made today can matter years later.

Example:

The IRR adopts an aggressive nuclear / renewable / storage energy strategy.

This may:

- reduce fossil-fuel exposure
- increase uranium demand
- increase lithium demand
- increase reliance on foreign processing
- create domestic industrial opportunities
- create strategic vulnerabilities

Years later, China may attempt to exploit those dependencies during a geopolitical crisis.

However, if the player previously built domestic refining, allied mineral supply chains, recycling capacity, or non-Chinese manufacturing, that strategy may fail.

The system must remember **structured causal relationships**, not merely old conversation text.

### 2.4 No railroading

There is no predetermined World War III.

There is no predetermined collapse.

There is no fixed story arc.

Competent diplomacy may prevent wars.

Poor decisions may create them.

Adversaries may abandon plans because the player quietly neutralized them.

The simulation should produce plausible emergent outcomes rather than force drama.

### 2.5 Realistic difficulty

Default difficulty philosophy:

# REALISTIC

The world must not bend in the player's favor.

There is:

- no plot armor
- no guaranteed victory
- no guaranteed crisis
- no hidden balancing mechanism
- no guaranteed happy ending

Countries act according to their interests.

Allies can refuse requests.

Intelligence can be wrong.

Generals can fail.

Programs can overrun.

Wars can be lost.

Political coalitions can collapse.

---

## 3. Primary Gameplay Loop

The core gameplay loop is:

**Briefing → Questions → Meetings → Decisions → Advance Time → Simulation → New Briefing**

The **Home** screen is the primary command interface and should feel like entering the ruler's briefing room / cabinet room / imperial council chamber.

---

## 4. First Launch and Campaign Creation

World Creation is one of the most important parts of the application.

It is not merely onboarding.

It defines the canonical rules, baseline state, political system, military structure, economy, and simulation assumptions.

The player begins by selecting:

# CREATE NEW WORLD

The setup process should support:

- traditional forms
- guided questionnaires
- an AI conversational setup assistant
- save and resume
- deep follow-up questioning
- validation before launch

The app should explicitly tell the player:

> The more detail you provide during World Creation, the more consistent and realistic the simulation can be.

---

## 5. Campaign Basics

World Creation should capture:

- campaign name
- simulation start date
- world type
- historical divergence
- technology era
- realism level
- default turn duration
- player role
- campaign-specific game-over rules
- real-world grounding enabled / disabled

World types may include:

- real-world divergence
- historical divergence
- mostly fictional
- fully custom

---

## 6. Real-World Baseline Initialization

If enabled, Imperium should initialize the world using a snapshot corresponding to the selected start date.

Possible baseline data:

- national borders
- major political leaders
- alliances
- current wars
- geopolitical tensions
- broad military capabilities
- macroeconomic indicators
- trade relationships
- major international organizations
- major political conditions

The player can override any of it.

Example:

> The United States is broadly identical to real-world 2026, except the president is a fictional character named Michael Bennett.

From that point onward:

**Michael Bennett is the canonical president in that campaign.**

External real-world data must never override campaign reality.

Campaign truth always wins.

---

## 7. Player Nation Setup

World Creation should allow detailed definition of the player's nation.

Fields should include:

- common name
- official name
- symbols
- flag
- territories
- modern-day countries included
- provinces / states / administrative divisions
- capital
- major cities
- population
- demographics
- languages
- religions
- culture
- national identity
- historical narrative
- constitutional identity

---

## 8. Governance and Player Authority

World Creation must contain a dedicated:

# GOVERNANCE & AUTHORITY

section.

This defines exactly what the player can and cannot do.

The player may be:

- Emperor
- President
- Prime Minister
- King
- Supreme Leader
- another custom office

For each major authority category, define:

- unilateral authority
- requires approval
- prohibited / unavailable
- emergency authority
- review or ratification requirement

Areas include:

### Military
- direct deployments
- mobilization
- reserve activation
- strategic objectives
- operational approvals
- declaration of war

### Diplomacy
- treaty negotiation
- treaty ratification
- diplomatic recognition
- sanctions

### Government
- appointing ministers
- firing ministers
- appointing judges
- dissolving government bodies
- emergency powers

### Finance
- budget proposal
- appropriations
- borrowing
- major tax changes

### Intelligence and covert action
- covert action authorization
- cyber operations
- surveillance
- classified programs

### Nuclear authority
- release authority
- two-person requirements
- council approval requirements
- delegated authorities if any

These rules are canonical simulation rules and must be enforced during gameplay.

---

## 9. Government Structure

The app should support arbitrary government systems.

Possible structures include:

- executive
- legislature
- judiciary
- monarchy
- senate
- council
- federal / provincial structures
- religious institutions
- military councils
- party committees

World Creation should define:

- institutions
- legal powers
- succession
- election / appointment systems
- legislative procedures
- judiciary
- provincial authority
- political parties
- factions
- civil service
- internal tensions

For IRR, this may include institutions such as the Emperor, Pro Consul, Senate, Imperial Court, and provinces, but those must remain campaign data rather than hard-coded assumptions.

---

## 10. Politics as a First-Class Simulation System

Politics must matter continuously, not only when a bill reaches the legislature.

Imperium must include a dedicated **Domestic Politics Engine**.

The system should model:

- public support
- elite support
- party / faction support
- legislative support
- regional sentiment
- unrest
- political coalitions
- leadership ambitions
- legislative agendas
- scandals
- war fatigue
- economic dissatisfaction
- institutional resistance

Political state should constrain player options.

Example:

The military recommends a five-year naval expansion.

Finance says it is affordable only with additional borrowing.

Government says the Senate does not have the votes.

The player must solve the political problem rather than simply press “Build Navy.”

---

## 11. Political Parties and Factions

Each political party or faction may contain:

- name
- ideology
- leadership
- legislative seats
- public support
- regional support
- policy priorities
- red lines
- stance toward the player
- internal factions
- current strategy
- alliances
- rivalries

The system must support:

- modern political parties
- aristocratic factions
- military blocs
- ideological coalitions
- religious parties
- provincial blocs
- fictional political structures

---

## 12. Political Intelligence

The player should **not** automatically know what every senator, legislator, judge, governor, or political actor thinks.

Political intelligence may come from:

- legislative whips
- staff reporting
- political advisers
- public statements
- polling
- trusted contacts
- lobbying activity
- intelligence sources when legally / institutionally appropriate
- rumors

Political assessments should include uncertainty.

Example:

> Senate Defense Committee appears 65% likely to support the new naval appropriation.

> Senator Valerius has privately expressed concern over the cost of North African basing.

These assessments can be incomplete or wrong.

---

## 13. Political Dossiers

Important government and political actors should have persistent dossiers.

Possible dossier fields:

- identity
- office
- biography
- ideology
- voting history
- known policy positions
- personal relationships
- allies
- rivals
- ambitions
- personality assessment
- risk tolerance
- competence
- loyalty
- public base
- likely vote
- confidence in assessment

Some fields may be factual.

Some may be analytical.

Some may be unknown.

---

## 14. Cabinet / Imperial Council Creation

Senior officials are persistent characters.

For each important minister / council member, store:

- name
- age
- office
- background
- education
- career history
- biography
- personality
- ideology / worldview
- professional doctrine
- expertise
- competence
- risk tolerance
- loyalty
- ambition
- relationship with player
- relationships with other officials
- known biases
- private concerns
- confidence
- health / status where relevant

World Creation should support:

# CREATE MINISTER

or

# GENERATE CANDIDATES

Generated candidates should genuinely differ in:

- philosophy
- doctrine
- competence
- risk appetite
- personality
- political support
- likely behavior

---

## 15. Council Character Behavior

Officials should be able to:

- disagree
- argue
- persuade
- be persuaded
- challenge assumptions
- resign
- be fired
- lose credibility
- gain influence
- leak information
- form alliances
- compete bureaucratically
- make mistakes
- correctly oppose the player
- develop relationships over time

They should not be cartoon characters.

Disagreement should arise from doctrine, incentives, beliefs, expertise, relationships, and available information.

---

## 16. Military Chain of Command

The military chain of command is configured during World Creation.

Example:

Emperor / Commander in Chief  
↓  
Minister of War  
↓  
Chief of Imperial General Staff  
↓  
Theater Commanders  
↓  
Service Commands  
↓  
Operational Units

During peacetime, briefings might feature:

- Minister of War
- Chief of Staff

During wartime, a relevant combatant / theater commander may directly participate.

The app must support different command structures in different campaigns.

---

## 17. Strategic Military Gameplay

The player operates at strategic and high operational levels.

The player does **not** manually move battalions around a Total War-style map.

The player may issue intent such as:

> Prevent Russian forces from crossing the Danube while avoiding attacks on Russian sovereign territory.

Military leadership may respond with multiple Courses of Action.

Each COA may contain:

- objective
- concept
- required forces
- estimated timeline
- logistics
- risk
- escalation potential
- intelligence assumptions
- likely enemy response
- readiness implications

The player may:

- approve
- reject
- modify
- request alternatives

Commanders then execute.

---

## 18. Strategic Release Authority

Certain actions should require explicit authorization.

Examples:

- nuclear use
- strikes on enemy homeland
- attacks likely to escalate a conflict
- attacks inside third-party countries
- reserve mobilization
- use of highly sensitive capabilities
- expansion of a war
- certain covert operations
- strategically significant strikes

Example UI:

# IMPERIAL AUTHORIZATION REQUIRED

Target package includes military installations inside Russian sovereign territory.

Potential consequence: expansion of conflict.

Authorize / Modify / Reject

---

## 19. Military Data Depth

The underlying military model should support substantial detail even though the player is not tactically micromanaging.

Recommended hierarchy:

Nation  
→ Service  
→ Theater  
→ Corps / Fleet / Air Command  
→ Division / Task Force / Wing  
→ Brigade / Squadron / Group  
→ Battalion / Ship / Aircraft Unit

Unit fields may include:

- authorized manpower
- actual manpower
- commander
- home station
- current location
- readiness
- morale
- training
- fuel
- ammunition
- equipment
- logistics
- operational status
- parent formation
- current mission

---

## 20. Hard Inventory Rules

Certain values must be canonical and quantitative.

Examples:

- missile stocks
- aircraft
- ships
- tanks
- artillery ammunition
- fuel reserves
- spare parts
- manpower
- production capacity

If the IRR has 1,032 PAC-3-class interceptors and fires 700:

**1,032 → 332**

The AI cannot invent a warehouse containing 1,000 more.

Replenishment requires plausible mechanisms:

- domestic production
- imports
- allied transfers
- emergency procurement
- existing contracts
- production expansion

---

## 21. Economy Setup

World Creation should support detailed economic definition.

Possible fields:

- GDP
- GDP per capita
- government revenue
- government spending
- debt
- deficit
- currency
- central bank
- inflation
- unemployment
- interest rates
- major industries
- trade partners
- imports
- exports
- energy production
- energy consumption
- natural resources
- critical mineral dependencies
- manufacturing
- agriculture
- infrastructure
- ports
- rail
- roads
- airports
- defense industrial base
- stock market / capital markets

---

## 22. Economic Gameplay Philosophy

Economic gameplay is strategic by default with optional deep dives.

The player primarily focuses on:

- budget
- deficit
- debt
- high-level appropriations
- industrial strategy
- energy strategy
- trade strategy
- defense spending
- infrastructure
- strategic resources
- major taxation debates
- major economic reforms

The player should not routinely micromanage individual tax rates unless the political situation makes that issue relevant.

---

## 23. Diplomacy

Diplomacy should support direct interaction with foreign leaders.

The player may request:

- phone calls
- summits
- private meetings
- diplomatic notes
- back-channel contacts
- multilateral conferences

Foreign leaders must behave according to:

- national interests
- political pressures
- strategic goals
- personality
- available intelligence
- relationship history
- domestic constraints

They should not simply agree with the player.

---

## 24. Actor Model

Important non-player actors may include:

- countries
- leaders
- agencies
- corporations
- military commands
- political factions
- insurgent groups
- terrorist organizations
- international institutions

Major actors should maintain persistent state such as:

- strategic objectives
- secondary objectives
- fears
- red lines
- capabilities
- known information
- suspected information
- misperceptions
- relationships
- active strategies
- long-term plans
- current operations

---

## 25. Hidden Actor Strategy

Some actor state must remain hidden.

Example:

China may secretly pursue:

> Increase IRR dependence on Chinese battery supply chains.

The player does not see this directly.

Instead, clues may appear:

- unusually favorable investment offers
- subsidized battery factories
- lobbying
- intelligence reporting
- economic anomalies

The player must interpret those signals.

---

## 26. Fog of War

Normal gameplay must never reveal hidden world truth.

A major fact may have multiple layers:

### True state
What is actually happening.

### Player-known state
What the player's government believes.

### Other actor-known states
What other governments believe.

Example:

True location of Chinese submarine: Arabian Sea.

IRR assessment:

> Possible Indian Ocean patrol — 42% confidence.

The normal map displays the assessment, not the true location.

---

## 27. God Mode

God Mode is the only place where the player may expose hidden simulation truth.

God Mode may allow:

- reveal true actor strategy
- reveal actual military positions
- reveal hidden political intentions
- edit foreign military inventories
- edit economic state
- force events
- alter relationships
- modify campaign state

All God Mode changes should be logged.

---

## 28. Baseline Correction Mode

Baseline Correction is separate from God Mode.

It is for correcting world-building omissions.

Example:

The IRR was always intended to be a nuclear power, but the player forgot to define its nuclear forces.

The player can retroactively add:

- warheads
- ICBMs
- SLBMs
- bombers
- command structure
- doctrine

The system records this as:

**Baseline correction — not an in-world event.**

The simulation treats the corrected capability as having always existed.

---

## 29. Nuclear Forces

If applicable, campaigns should support:

- warhead inventory
- ICBMs
- SLBMs
- bombers
- bases
- readiness
- doctrine
- command and control
- launch authority
- survivability
- second-strike capability

---

## 30. Intelligence Services

World Creation should define intelligence capabilities, such as:

- foreign intelligence
- domestic intelligence
- military intelligence
- cyber
- space reconnaissance
- SIGINT
- HUMINT
- counterintelligence

These capabilities should influence what the player can plausibly know.

---

## 31. Intelligence Reports

Intelligence reporting should use uncertainty.

Example:

# CLASSIFIED INTELLIGENCE ASSESSMENT

**Assessment:** Russia may move two mechanized brigades toward Bulgaria within 14 days.

**Confidence:** Moderate

Supporting evidence:

- rail movement
- fuel activity
- intercepted communications

Alternative explanation:

- annual readiness exercise

The system must distinguish analysis from fact.

---

## 32. Time Advancement

Time advances only when the player advances it.

Possible controls:

- Advance 3 Days
- Advance 1 Week
- Advance 2 Weeks
- Advance 1 Month
- Custom

Before advancing, show important unresolved items:

- pending decisions
- active operations
- unanswered diplomatic requests
- political deadlines
- budget deadlines
- critical intelligence warnings

The player may still choose to proceed.

---

## 33. Emergency Interrupts

The default turn cadence may be interrupted by major events.

Example:

Campaign default turn: 1 month.

Turn starts June 1.

A crisis occurs June 12.

The simulation pauses on June 12.

The next time the player opens the app:

# EMERGENCY IMPERIAL COUNCIL

The player handles the crisis before time advances further.

---

## 34. Event Severity

Events may use a severity scale such as:

- Level 0 — Background
- Level 1 — Routine
- Level 2 — Significant
- Level 3 — Major
- Level 4 — Crisis
- Level 5 — National Emergency

Campaign settings define which levels interrupt normal turns.

A reasonable default:

Levels 4–5 automatically interrupt.

Levels 1–3 normally wait for the scheduled briefing.

---

## 35. Main Navigation

Primary iPhone bottom navigation:

1. **Home**
2. **Map & Intelligence**
3. **Military**
4. **Government**
5. **Finance & Economy**

Other functions such as Archives, Campaign Management, Settings, and World Editor may live under secondary navigation.

---

## 36. Home

Home is the Imperial Council / Cabinet / Situation Room.

It is the primary gameplay screen.

The Home tab should contain:

- scheduled briefings
- emergency briefings
- council dialogue
- pending decisions
- directives
- meeting controls
- time advancement
- major alerts
- important cross-domain intelligence

Example:

**Minister of War**  
Russian naval activity has increased in the eastern Mediterranean.

**Minister of Finance**  
Industrial production declined 0.8% this quarter.

**Director of Intelligence**  
Chinese diplomats appear to be privately pressuring Algeria over its energy relationship with the Empire.

The player can ask follow-ups naturally.

---

## 37. Meetings

The player can initiate meetings such as:

- Imperial Council
- National Security Council
- War Council
- Economic Council
- Energy Strategy Meeting
- private minister meeting
- diplomatic meeting
- custom meeting

Example:

> Create a meeting with the Minister of War, Chief of Staff, Foreign Minister, and Commander Eastern Theater.

The system should determine what each participant plausibly knows and how each would advise the player.

---

## 38. Orders vs Discussion

The application must distinguish exploratory conversation from actual directives.

Example:

> What would happen if we moved another carrier group to Crete?

This is discussion.

Example:

> Deploy the Second Carrier Strike Group to Crete.

This is a possible order.

The system may prompt:

# ISSUE THIS AS AN IMPERIAL DIRECTIVE?

Confirmed directives become canonical records.

---

## 39. Decision Ledger

Every meaningful decision should create a structured record.

Example:

### Decision 00482

**Title:** Expand domestic nuclear generation  
**Date:** March 12, 2027

**Objectives:**
- reduce energy imports
- reduce electricity costs

**Immediate effects:**
- construction spending rises
- uranium demand rises

**Dependencies:**
- uranium suppliers
- construction capacity

**Related actors:**
- Energy Ministry
- mining sector
- Canada
- Kazakhstan
- China

The decision record should link into later consequences.

---

## 40. Strategic Threads

Strategic Threads are persistent causal variables created or modified by decisions and events.

Possible fields:

- id
- campaign_id
- title
- type
- created_date
- status
- visibility
- origin_event
- related_decisions
- related_actors
- related_resources
- severity
- probability
- direction
- conditions
- activation_rules
- mitigations
- amplifiers
- notes

Example threads:

- Chinese lithium dependence
- Russian resentment over Balkan expansion
- US confidence in IRR reliability
- North African energy dependence
- naval maintenance backlog
- public fatigue with foreign wars

---

## 41. Strategic Thread Lifecycle

Possible states:

- Dormant
- Growing
- Declining
- Active
- Critical
- Resolved
- Neutralized

Threads may remain dormant for years.

They may become relevant only when conditions align.

---

## 42. Positive Long-Term Consequences

Strategic Threads must model resilience as well as vulnerability.

Example:

2026: IRR signs Australian lithium partnership.  
2027: Domestic refining begins.  
2029: Battery recycling reaches industrial scale.  
2031: China considers mineral export restrictions.

The system evaluates the actual exposure.

Result:

> Chinese coercive strategy abandoned because expected impact is insufficient.

The player may later discover this through intelligence.

---

## 43. Decision / Consequence Graph

Major decisions and events should be linked causally rather than stored only in chronological order.

Example:

Energy Policy 2026  
↓  
Lithium Demand Increase  
↓  
Chinese Import Dependence  
↓  
Australia Agreement 2028  
↓  
Domestic Refinery 2029  
↓  
China Crisis 2031

This supports long-term causal reasoning.

---

## 44. Politics and Strategic Threads

Politics must participate in the same long-term causal system.

Example:

War casualties increase  
↓  
Public support declines  
↓  
Anti-war faction gains influence  
↓  
Senate support for military appropriations falls  
↓  
Procurement slows  
↓  
Ammunition inventories tighten  
↓  
Future readiness declines

Political consequences should be capable of unfolding over multiple years.

---

## 45. Memory Architecture

The app must **never** send the entire campaign history to the AI.

A campaign may last many simulated years and contain thousands of events, conversations, meetings, and decisions.

Use layered memory.

### Layer 1 — Canonical State
Current structured world truth in the database.

### Layer 2 — Recent Context
Recent interactions and current-session conversation.

### Layer 3 — Topic Summaries
Examples:
- IRR–China relations
- Senate politics
- Eastern Mediterranean conflict
- energy strategy

### Layer 4 — Event Archive
All meaningful events.

### Layer 5 — Decision / Consequence Graph
Structured causal relationships.

### Layer 6 — Semantic Retrieval
Embeddings / indexed search for older relevant material.

### Layer 7 — Character Memory
What individual characters know or remember.

---

## 46. Context Assembly

When the player asks:

> Why is China threatening us over lithium?

The system should retrieve only relevant context, such as:

- current China relationship
- current lithium exposure
- active strategic threads
- 2026 energy policy
- 2028 Australia agreement
- current intelligence
- relevant Chinese objectives
- recent council discussion

It should **not** load five years of transcript.

---

## 47. Imperial Archives

Historical information must remain searchable.

The player should be able to ask:

- everything involving Algeria since campaign start
- why relations with China deteriorated
- all decisions affecting uranium security
- history of the Balkan conflict
- major Senate votes on defense

Archives should preserve original events even when summaries are generated.

---

## 48. Historical Summaries

The app may periodically generate:

- monthly summaries
- annual summaries
- conflict summaries
- administration summaries
- diplomatic relationship summaries

These summaries are used both for the player and for efficient memory retrieval.

They do not replace the underlying history.

---

## 49. Map & Intelligence

Map & Intelligence is the global situational-awareness interface.

It should display a real-world-style interactive world map.

Possible map layers:

- political
- military
- diplomatic
- economic
- trade
- energy
- alliance
- conflict
- intelligence
- world events

The player can click / tap a nation or event.

---

## 50. Nation Profiles

Tapping a country should open a structured country profile.

Possible sections:

### Overview
- population
- GDP
- government
- leadership
- alliances
- relationship with player nation

### Government
- head of state
- key ministers
- major institutions

### Military
- estimated active personnel
- army
- navy
- air force
- nuclear forces
- known deployments
- readiness estimates

### Economy
- trade
- industry
- energy
- critical resources
- dependencies

### Intelligence Assessment
- strategic objectives
- current intentions
- threats
- covert activity
- leadership stability
- confidence levels

### Relationship History
- treaties
- crises
- meetings
- sanctions
- wars
- major decisions

All information should reflect what the player's government knows, not omniscient truth.

---

## 51. World Events on the Map

World events should appear as interactive map markers.

Examples:

- hurricanes
- earthquakes
- coups
- protests
- elections
- wars
- terrorist attacks
- industrial accidents
- pandemics
- major infrastructure failures

Example:

A Category 5 hurricane strikes Florida.

A hurricane icon appears over Florida.

Tapping it might show:

# HURRICANE ADRIANA

- landfall location
- estimated fatalities
- power outages
- economic damage
- transportation disruption
- military / strategic relevance
- confidence in estimates

Not every world event must directly affect the player.

The world should feel alive beyond the player's immediate story.

---

## 52. Military Tab

The Military tab is an information and strategic command interface, not an RTS.

Sections may include:

### Overview
- active manpower
- reserve manpower
- readiness
- active operations
- major deployments
- defense spending
- shortages

### Organization
Interactive force org chart.

### Disposition
Current force locations.

### Equipment
Detailed tables of inventories.

### Readiness
Formation-by-formation readiness.

### Operations
Current campaigns, objectives, commanders, restrictions, logistics, casualties, and assessments.

### Procurement
Production, orders, replacement rates, and future inventory.

---

## 53. Government Tab

The Government tab should be a full political operating picture.

Top-level metrics may include:

- government stability
- emperor / leader approval
- public support
- Senate support
- coalition support
- elite confidence
- civil unrest risk
- regional political tension
- current legislative agenda

Subsections:

### Political Dashboard
High-level health of the regime.

### Senate / Legislature
- composition
- leadership
- committees
- pending bills
- upcoming votes
- estimated vote counts

### Parties & Factions
- support
- ideology
- leaders
- internal divisions
- trends

### Political Intelligence
What advisers believe key political actors are planning.

### People
Searchable political dossiers.

### Legislation
Pending legislation, support estimates, undecided actors, potential compromises.

---

## 54. Finance & Economy Tab

This should feel partly like a sovereign finance ministry dashboard and partly like a strategic Bloomberg-style terminal.

### Macro Dashboard
- GDP
- GDP growth
- GDP per capita
- inflation
- unemployment
- interest rates
- debt
- deficit
- currency
- trade balance

### Government Finance
- revenue
- spending
- debt service
- ministry budgets
- appropriations
- multi-year projections

### Economic Strengths / Weaknesses
Examples:
- advanced manufacturing
- nuclear engineering
- shipbuilding
- tourism
- foreign mineral dependence
- semiconductor dependence
- aging infrastructure

### Markets
Possible ticker:
- national stock index
- defense index
- energy index
- bond yields
- currency
- strategic commodities

Markets should react to wars, policy changes, crises, peace agreements, recessions, and major announcements.

### Strategic Industries
- energy
- steel
- shipbuilding
- semiconductors
- defense
- automotive
- agriculture
- pharmaceuticals

### Resources
- oil
- natural gas
- uranium
- lithium
- copper
- rare earths
- food reserves

### Trade
- major partners
- imports
- exports
- dependencies
- chokepoints

---

## 55. Intelligence as a Cross-Cutting System

There should not be a separate permanent Intelligence tab.

Instead:

- foreign intelligence lives primarily in **Map & Intelligence**
- military intelligence appears in **Military**
- political intelligence appears in **Government**
- economic intelligence appears in **Finance & Economy**
- highest-priority intelligence appears on **Home**

This better matches how a real government consumes intelligence.

---

## 56. Hybrid Simulation Architecture

Imperium should combine deterministic / rules-based simulation with AI reasoning.

### Hard simulation is best for:
- inventories
- budgets
- debt
- GDP
- population
- casualties
- force counts
- production
- energy capacity
- logistics
- project timelines
- trade volumes
- physical resources
- readiness metrics

### AI reasoning is best for:
- diplomacy
- political behavior
- adversary strategy
- minister advice
- leadership personalities
- intelligence interpretation
- deception
- escalation
- strategic planning
- public reaction
- emergent consequences
- narrative briefings

The AI may interpret hard data.

The AI may not casually overwrite hard data.

---

## 57. Simulation Processing

A turn should approximately perform:

1. Load canonical world state.
2. Load unresolved player orders.
3. Determine target end date.
4. Process scheduled events chronologically.
5. Update economic state.
6. Update government finance.
7. Update projects.
8. Update production.
9. Update inventories.
10. Update military readiness.
11. Update domestic politics.
12. Update diplomacy.
13. Evaluate actor objectives.
14. Evaluate actor strategies.
15. Evaluate Strategic Threads.
16. Resolve actor interactions.
17. Resolve military operations.
18. Resolve stochastic events where appropriate.
19. Update true world state.
20. Run intelligence collection.
21. Determine what the player's government learns.
22. Check emergency interrupt conditions.
23. Generate briefing.
24. Store state changes.
25. Store events.
26. Store Strategic Thread updates.
27. Store summaries and archive links.

---

## 58. Conceptual Turn Engine

```text
START TURN

Load canonical state
Load unresolved directives
Load active operations
Load active political processes
Determine requested end date

Process timeline chronologically

Update:
    economy
    budget
    projects
    production
    inventories
    readiness
    domestic politics
    diplomacy
    public sentiment

For each major actor:
    evaluate objectives
    retrieve relevant context
    choose potential actions

Evaluate Strategic Threads
Resolve actor interactions
Resolve military operations
Resolve stochastic outcomes

Update true world state

Run intelligence collection
Build player-known state

Check emergency interrupt threshold

IF emergency:
    stop timeline
    generate emergency council briefing
ELSE:
    reach target date
    generate normal council briefing

Store all changes
Update summaries
Update decision graph

END TURN
```

---

## 59. Event Structure

Every meaningful event should be structured.

Example:

```json
{
  "type": "military_deployment",
  "date": "2030-05-12",
  "actor": "Russia",
  "target_region": "Black Sea",
  "true_details": {},
  "player_known_details": {},
  "severity": 3,
  "related_threads": [],
  "related_decisions": []
}
```

Narrative prose is generated from structured state.

Narrative prose is not itself canonical state.

---

## 60. Canonical Data Rule

All game-critical state must have a canonical source in the database.

Bad:

> The model remembers the Army has 460,000 troops because it was mentioned several chats ago.

Good:

```text
active_army_manpower = 460000
```

The AI retrieves the value.

It does not reinvent it.

---

## 61. Proposed Database Domains

Supabase / Postgres should likely contain domains / tables for:

- campaigns
- campaign_settings
- nations
- regions
- provinces
- characters
- governments
- institutions
- government_powers
- political_parties
- political_factions
- political_positions
- legislative_bodies
- legislation
- vote_estimates
- public_opinion
- relationships
- treaties
- economic_indicators
- budgets
- appropriations
- resources
- trade_flows
- markets
- strategic_industries
- projects
- military_organizations
- military_units
- equipment_types
- equipment_inventory
- bases
- military_orders
- operations
- nuclear_forces
- intelligence_reports
- intelligence_assessments
- events
- decisions
- strategic_threads
- actor_strategies
- meetings
- messages
- topic_summaries
- archives
- turns
- campaign_edits

---

## 62. Campaign Isolation

Multiple campaign worlds must be completely isolated.

Examples:

- Imperial Roman Republic — Main Campaign
- IRR — Cold War Variant
- Kingdom of Olympia
- Alternate United States

Each campaign has separate:

- world state
- history
- characters
- government
- political system
- military
- economy
- intelligence
- strategic threads
- archives
- AI memories

---

## 63. AI Provider Architecture

The app should be provider-agnostic.

Create an abstraction such as:

```text
AIProvider

generate()
generateStructured()
reason()
embed()
```

Possible providers:

- OpenAI
- Anthropic
- Google
- future providers

The architecture should permit changing or mixing providers without rebuilding the application.

---

## 64. Model Routing

Different tasks should use different model classes.

### Low-cost model
- summaries
- rewriting
- archive labeling
- routine dialogue

### Mid-tier model
- council conversations
- intelligence analysis
- diplomatic dialogue

### High-reasoning model
- turn simulation
- major strategic decisions
- actor planning
- military planning
- crisis resolution
- long-tail causality

This helps control API cost without sacrificing quality where it matters.

---

## 65. AI State Change Validation

AI output should not directly mutate arbitrary database state.

Recommended pattern:

AI proposes a structured action:

```json
{
  "action": "modify_relationship",
  "actor_a": "IRR",
  "actor_b": "United States",
  "trust_delta": -3,
  "reason": "IRR rejected basing request"
}
```

The simulation engine validates it before commit.

This reduces hallucinated world-state changes.

---

## 66. Campaign Integrity

When AI output conflicts with canonical state:

# CANONICAL STATE WINS

Example:

AI narrative says:

> The Empire has six active carriers.

Database says:

> 4 active carriers.

The response should be rejected, repaired, or regenerated before presentation.

---

## 67. World Validation Before Start

Before campaign launch, the player should run:

# REVIEW WORLD

The AI should identify:

- missing information
- contradictions
- implausible assumptions
- undefined authorities
- military formations without bases
- economic inconsistencies
- undefined cabinet positions
- missing supply chains
- government procedures that lack rules
- strategic dependencies that need clarification

Then the player can correct the world.

Finally:

# BEGIN REIGN

This creates **World State v1** and starts Turn 1.

---

## 68. Game-Over Rules

Possible campaign-ending conditions:

- player overthrown
- player constitutionally removed
- player killed without continuation
- government collapses
- nation ceases to exist
- civilization / world-ending event
- campaign-specific terminal event

For the intended default:

**Removal as Emperor = campaign over.**

Losing a battle is not game over.

Losing a war is not necessarily game over.

If the government remains intact, play continues.

---

## 69. Visual Identity

Imperium should look like a modern Roman imperial command interface rather than a fantasy RPG.

Inspirations:

- Rome: Total War
- Medieval II: Total War
- SPQR / Roman senatorial iconography
- classical architecture
- modern military / intelligence dashboards

Primary palette:

- deep imperial red
- burgundy
- dark purple
- muted gold
- black / charcoal
- stone / parchment accents

Possible visual elements:

- laurel wreaths
- SPQR-style symbols
- Roman eagles
- classical borders
- subtle marble / stone textures
- Roman-inspired serif display typography

The look should be:

**masculine, serious, powerful, historical, restrained, sophisticated.**

Avoid gaudy fantasy styling.

---

## 70. PWA Requirements

Primary target:

**iPhone Safari / Add to Home Screen**

Requirements:

- installable PWA
- portrait-first
- responsive
- iPhone safe-area support
- touch-friendly controls
- persistent login
- fast app reopen
- cached UI shell
- graceful network failure
- native-feeling bottom navigation
- offline-tolerant shell where practical
- future push-notification support

---

## 71. Recommended Technical Stack

### Frontend
- Next.js / React
- TypeScript
- Tailwind CSS or equivalent
- PWA manifest
- service worker

### Database
- Supabase Postgres

### Authentication
- Supabase Auth

### Backend
- Cloudflare Workers

### Storage
- Supabase Storage or Cloudflare R2

### Retrieval
- pgvector

### Mapping
- MapLibre or similar provider-independent map library

### Deployment
- Cloudflare

### Source Control
- GitHub

---

## 72. Suggested Backend Service Boundaries

Conceptual service boundaries:

- Campaign Service
- Turn Engine
- AI Orchestrator
- Retrieval Service
- Simulation Rules Engine
- Politics Engine
- Military Service
- Economic Service
- Diplomacy Service
- Intelligence Service
- Archive Service
- Map / Event Service

These do not need to be separate deployed microservices in the initial version.

They are conceptual boundaries to keep the codebase maintainable.

---

## 73. Most Important Architectural Rule

> **The LLM is not the database, and the LLM is not the game engine.**

The LLM is an intelligence and reasoning layer operating on top of structured simulation state.

This rule is essential for long-term campaign coherence.

---

## 74. Explicit Non-Goals

At least initially, Imperium is not:

- a Total War clone
- an RTS
- a tactical battle simulator
- a tile-based civilization builder
- a multiplayer strategy game
- a low-level tax micromanagement simulator
- a fixed branching narrative
- a generic AI chat wrapper

---

## 75. Core Acceptance Scenario

A prototype has captured the intended architecture if the following works:

In 2026, the player adopts an aggressive nuclear / renewable energy policy.

The decision is stored.

It increases uranium and lithium demand.

The player later signs an Australian mineral agreement.

Domestic refining is built.

Years pass.

Relations with China deteriorate.

China considers economic coercion.

The simulation recognizes the old energy decision.

It evaluates current Chinese leverage.

It recognizes that the Australian agreement and domestic refining reduced vulnerability.

China decides that a mineral embargo would be ineffective and chooses another strategy.

The player may later learn through intelligence:

> Beijing considered restricting mineral exports but assessed the measure would no longer inflict sufficient damage on the Empire.

This chain must occur **without sending the entire campaign transcript to the AI**.

---

## 76. Politics Acceptance Scenario

The military recommends a major naval expansion.

Finance determines it is affordable only with increased borrowing.

The Government tab shows insufficient Senate support.

Several influential senators are undecided.

The player:

- meets party leaders
- modifies the program
- offers concessions
- gives a public address
- pressures key senators

Public support shifts.

Senate estimates change.

A final vote succeeds narrowly.

The appropriations then affect:

- debt
- shipbuilding
- industrial capacity
- military readiness
- future political support

The simulation should preserve those causal links over subsequent years.

---

## 77. World Event Acceptance Scenario

A major hurricane strikes Florida.

The event appears automatically on the Map & Intelligence tab.

The player can tap the event and inspect:

- location
- severity
- casualties
- outages
- damage estimates
- strategic effects
- confidence in reporting

The event may affect:

- US politics
- military basing
- trade
- energy markets
- diplomacy

Or it may have no meaningful effect on the player's strategy.

The point is that the world exists beyond the immediate player storyline.

---

## 78. Final Product Standard

After playing a campaign for five simulated years, the player should be able to make a seemingly ordinary decision and later discover that something they did three years earlier materially changed the outcome.

The desired reaction is:

> **“Holy shit. It remembered that.”**

Not because years of transcript were stuffed into a prompt, but because the simulation actually preserved the causal structure of the world.

---

## 79. Next Engineering Phase

The next implementation-oriented version should convert this specification into a coding-agent-ready build plan containing:

- exact Supabase schema
- table relationships
- SQL migrations
- JSON schemas
- event schema
- decision schema
- Strategic Thread schema
- political simulation schema
- military hierarchy schema
- AI prompts
- context assembly logic
- model routing
- API endpoints
- turn-engine execution order
- world creation screens
- mobile screen hierarchy
- component inventory
- MVP boundaries
- development phases
- test cases
- acceptance tests
- seed campaign data

That version should be suitable for direct handoff to Codex or Claude Code as **BUILD_SPEC.md**.

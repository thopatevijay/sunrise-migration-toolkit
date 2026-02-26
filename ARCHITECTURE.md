# Architecture — Tideshift

## System Overview

Tideshift covers the full token migration lifecycle with seven integrated products sharing a common data layer:

1. **Token Discovery** — scans top 500 tokens by market cap and surfaces ~300 without a native Solana contract address
2. **Demand Discovery Dashboard** — dynamically scores the top 50 non-Solana tokens using 5 real-time signal categories
3. **Community Demand Signals** — persistent upvote system (Upstash Redis) so users can signal migration demand
4. **On-Demand MDS Scoring** — score any Discovery token's migration demand in real time via API
5. **Migration Health Monitor** — tracks post-migration health of tokens already brought to Solana
6. **Enhanced Proposal Builder** — auto-generates migration proposals with bridge recommendations, liquidity estimates, and risk assessment
7. **AI Integration** — GPT-4o-mini streaming proposals (3 tones) + Ask Tideshift conversational chat with tool-calling
8. **Community Onboarding Flow** — white-label onboarding for migrated token communities (RENDER, HNT, POWR, GEOD)

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (DM Sans + JetBrains Mono, ThemeProvider)
│   ├── page.tsx                      # Landing page
│   ├── error.tsx                     # Error boundary
│   ├── not-found.tsx                 # 404 page
│   ├── globals.css                   # Dark theme, glassmorphism, gradients
│   ├── (dashboard)/                  # Demand Discovery Dashboard
│   │   ├── layout.tsx                # Sidebar + header + data status banner
│   │   ├── loading.tsx               # Skeleton loading state
│   │   ├── page.tsx                  # Main dashboard (stats, table, charts, funnel)
│   │   ├── tokens/[id]/page.tsx      # Token detail (radar, signals, proposal)
│   │   ├── discovery/
│   │   │   ├── page.tsx              # Token Discovery (non-Solana tokens)
│   │   │   └── loading.tsx           # Skeleton loading state
│   │   ├── migrations/
│   │   │   ├── page.tsx              # Migration Health Monitor
│   │   │   └── loading.tsx           # Skeleton loading state
│   │   └── proposals/page.tsx        # Saved migration proposals
│   ├── (onboarding)/onboard/[token]/ # Community Onboarding Flow
│   │   ├── layout.tsx                # Full-width branded layout
│   │   ├── loading.tsx               # Loading state
│   │   └── page.tsx                  # 5-step stepper (single page, not multi-route)
│   └── api/
│       ├── tokens/
│       │   ├── route.ts              # GET /api/tokens (all candidates + stats, 3-min cache)
│       │   ├── [id]/route.ts         # GET /api/tokens/:id (single token detail)
│       │   └── score/route.ts        # POST /api/tokens/score (on-demand MDS scoring)
│       ├── migrations/
│       │   └── route.ts              # GET /api/migrations (health data for migrated tokens)
│       ├── discovery/
│       │   └── no-solana/route.ts    # GET /api/discovery/no-solana (non-Solana tokens)
│       ├── votes/
│       │   ├── route.ts              # GET/POST /api/votes (community demand votes via Upstash Redis)
│       │   └── user/route.ts         # GET /api/votes/user (per-user vote history)
│       ├── ai/
│       │   ├── proposal/route.ts     # POST /api/ai/proposal (streaming AI proposal, 3 tones)
│       │   ├── chat/route.ts         # POST /api/ai/chat (chat with tool-calling)
│       │   ├── quick-summary/route.ts # POST /api/ai/quick-summary (non-streaming 2-3 sentence assessment)
│       │   └── scout/route.ts        # POST /api/ai/scout (streaming Migration Scout agent brief)
│       ├── analytics/
│       │   └── onboarding/route.ts   # GET/POST /api/analytics/onboarding (Redis-backed funnel)
│       └── yields/
│           └── route.ts              # GET /api/yields (live DeFi APYs from DefiLlama)
├── components/
│   ├── dashboard/
│   │   ├── stats-bar.tsx             # 4 KPI cards with animated counters
│   │   ├── token-table.tsx           # Ranked, sortable, filterable token table
│   │   ├── demand-chart.tsx          # Tabbed charts (bridge outflows, search, MDS)
│   │   ├── discovery-table.tsx        # Non-Solana token table (pagination, CSV, votes, MDS scoring, AI summaries, tooltips)
│   │   ├── migration-scout.tsx       # Migration Scout agent dialog (streaming markdown brief)
│   │   ├── migration-health-card.tsx # Per-token health card (score ring, sparkline, metrics)
│   │   ├── migrated-banner.tsx       # Horizontal scroll of migrated tokens + health link
│   │   ├── sparkline.tsx             # Tiny inline trend chart
│   │   ├── token-detail/
│   │   │   ├── token-header.tsx      # Hero with MDS score ring
│   │   │   ├── score-breakdown.tsx   # Radar chart + signal bars
│   │   │   ├── signal-cards.tsx      # 5 expandable signal detail cards
│   │   │   ├── price-chart.tsx       # 30-day price area chart
│   │   │   ├── migration-readiness.tsx # NTT/team/bridge checklist
│   │   │   └── similar-tokens.tsx    # Related token cards
│   │   └── proposal-builder/
│   │       └── proposal-form.tsx     # AI streaming proposal (3 tones) + classic rule-based fallback
│   ├── token-detail/
│   │   └── ask-tideshift.tsx         # Floating chat panel with tool-calling AI assistant
│   ├── onboarding/
│   │   ├── onboarding-stepper.tsx    # 5-step progress bar
│   │   ├── onboarding-analytics.tsx  # Funnel visualization component
│   │   └── steps/
│   │       ├── welcome-step.tsx      # Welcome + "Get Started"
│   │       ├── wallet-step.tsx       # Phantom/Backpack/Solflare wallet setup
│   │       ├── bridge-step.tsx       # Bridge via Sunrise link
│   │       ├── trade-step.tsx        # Jupiter swap link
│   │       └── defi-step.tsx         # DeFi opportunities + live APYs from DefiLlama
│   ├── shared/
│   │   ├── chain-badge.tsx           # Chain logo + name
│   │   ├── data-status-banner.tsx     # Data source indicator (live/partial)
│   │   ├── mds-badge.tsx             # Score-colored badge
│   │   ├── motion.tsx                # Framer Motion animation wrappers
│   │   ├── score-ring.tsx            # Circular SVG MDS progress
│   │   └── trend-indicator.tsx       # Up/down/flat arrow
│   ├── sidebar/
│   │   └── api-health-board.tsx      # Real-time API provider status panel
│   ├── app-header.tsx                # Page title + data freshness + network badge
│   ├── app-sidebar.tsx               # Navigation sidebar
│   ├── theme-provider.tsx            # next-themes dark mode
│   └── ui/                           # shadcn/ui primitives
├── hooks/
│   ├── use-mobile.tsx                # Responsive breakpoint hook
│   ├── use-discovery.ts              # SWR hook for non-Solana token discovery (60min refresh)
│   ├── use-migrations.ts             # SWR hook for migration health data (5min refresh)
│   └── use-tokens.ts                 # SWR hooks (5min dashboard, 1min detail refresh)
├── lib/
│   ├── data/
│   │   ├── index.ts                  # Data facade — batch processing (5/batch), partial data approach
│   │   ├── token-discovery.ts        # Dynamic token registry (async, top 50 from Discovery API)
│   │   ├── discovery-no-solana.ts    # Non-Solana token discovery (2 CoinGecko calls, cross-ref)
│   │   ├── migration-health.ts       # Post-migration health metrics (CoinGecko + WormholeScan)
│   │   ├── demand-votes.ts           # Community demand voting client (Upstash Redis via API)
│   │   ├── providers/                # Live API provider clients
│   │   │   ├── cache.ts              # TTL-based in-memory cache (500 entries)
│   │   │   ├── http.ts               # Shared fetch helper (timeout + retry)
│   │   │   ├── health.ts             # API health tracker (trackedFetch + status snapshot)
│   │   │   ├── coingecko.ts          # Market data + real community/social data + platform lookups
│   │   │   ├── dexscreener.ts        # DEX trading activity (volume, pairs, liquidity, boosts)
│   │   │   ├── helius.ts             # Real SPL token holder counts (DAS getTokenAccounts)
│   │   │   ├── wormhole.ts           # Bridge outflow data (WormholeScan)
│   │   │   ├── defillama.ts          # TVL, protocol data, bridge volumes, Solana TVL ratios
│   │   │   ├── defillama-yields.ts   # Live DeFi APYs (Kamino, MarginFi, Raydium, Orca, etc.)
│   │   │   ├── jupiter.ts            # Jupiter listing verification + prices + bridged token map + liquidity
│   │   │   ├── wallet-heuristic.ts   # Wallet overlap estimation (chain proximity + TVL ratios)
│   │   │   └── index.ts              # Re-exports all providers
│   │   └── (no demo folder — all data from live APIs)
│   ├── scoring/
│   │   ├── mds.ts                    # calculateMDS() — normalize, weight, sum
│   │   ├── normalizers.ts            # 5 signal normalizers (0-100)
│   │   ├── weights.ts                # Signal weights + labels
│   │   └── migration-analysis.ts     # Auto-analysis: bridge recommendation, liquidity, risk, competitive
│   ├── ai/
│   │   ├── serialize.ts              # serializeTokenForAI() — structured text for LLM context
│   │   └── prompts.ts                # System prompts: 3 proposal tones + chat scope rules
│   ├── analytics/
│   │   └── onboarding.ts             # Step tracking via API (fire-and-forget POST to Redis)
│   ├── types/
│   │   ├── scoring.ts                # MDS interfaces + score utilities
│   │   ├── signals.ts                # Signal type definitions (bridge, search, social, market, wallet)
│   │   ├── discovery.ts              # DiscoveryToken, DiscoveryResponse, SolanaStatus
│   │   └── proposals.ts              # Proposal storage (localStorage)
│   ├── config/
│   │   ├── tokens.ts                 # Token registry (static fallback + 4 migrated) + chain map
│   │   ├── chains.ts                 # 15 chain definitions (incl. sui, near, tron, fantom, aptos)
│   │   └── onboarding.ts             # Per-token onboarding configs (RENDER, HNT, POWR, GEOD)
│   └── utils.ts                      # formatUSD, formatNumber, cn, etc.
```

## Data Flow

```
Live APIs (8 providers — zero hardcoded data)
  ↓ trackedFetch() → records provider health + try/catch → null on failure
Provider Clients (src/lib/data/providers/)
  ↓ TTL-cached, partial data approach
  │
  ├── Dynamic Token Registry (token-discovery.ts)
  │     ↓ fetchNoSolanaTokens() → top 50 by market cap → TokenCandidate[]
  │     ↓ Falls back to 12 static tokens if Discovery API fails
  │
  ├── Data Facade (src/lib/data/index.ts)
  │     ↓ Batch processing: 5 tokens/batch, 2s delay (respects CoinGecko 30/min)
  │     ↓ MDS scoring with weight redistribution for missing signals
  │     ↓ Helius holder count enrichment for detail pages (if Solana mint exists)
  │     API Routes:
  │       /api/tokens         → GET all candidates + stats (3-min response cache)
  │       /api/tokens/:id     → GET single token detail (enriched with Helius holders)
  │       /api/tokens/score   → POST on-demand scoring for any token
  │     ↓ JSON response + provider health snapshot
  │     SWR Hooks (auto-refresh: 5min dashboard, 1min detail)
  │
  ├── Migration Health (migration-health.ts)
  │     ↓ CoinGecko market + WormholeScan bridge → health score composite
  │     API Route: /api/migrations
  │     SWR Hook (auto-refresh: 5min)
  │
  ├── Discovery (discovery-no-solana.ts)
  │     ↓ 2 CoinGecko calls → cross-reference → filter non-Solana
  │     ↓ Jupiter verified token list → detect bridged tokens + liquidity
  │     API Route: /api/discovery/no-solana
  │     SWR Hook (auto-refresh: 60min)
  │
  ├── Demand Votes (demand-votes.ts → Upstash Redis)
  │     ↓ Persistent voting via /api/votes (anonymous user IDs, one vote per token)
  │     API Routes:
  │       /api/votes          → GET all counts, POST toggle vote
  │       /api/votes/user     → GET per-user voted token IDs
  │
  └── DeFi Yields (defillama-yields.ts)
        ↓ Live APYs from DefiLlama Yields API for onboarding DeFi step
        API Route: /api/yields?protocols=Kamino+Finance,MarginFi,Raydium
  ↓
React Components + API Health Board (sidebar)
```

## Migration Demand Score (MDS)

The scoring engine aggregates five signal categories into a single score per token:

### Signal Categories

**1. Bridge Outflow Volume (weight: 0.30)**
- Source: WormholeScan `top-assets-by-volume` API
- Metric: Cross-chain bridge volume for this token (7d + 30d)
- Estimation fallback: When WormholeScan lacks data, uses market cap × volume ratio (marked `dataSource: "estimated"`)
- Estimated bridge data receives 50% confidence discount (effective weight: 15% instead of 30%)
- Higher outflow = active cross-chain demand for this asset

**2. Search Intent (weight: 0.25)**
- Source: DexScreener search API + boost/trending API + Jupiter listing check
- Metrics: 24h DEX volume, transaction count, liquidity, pair count, Solana pair count, boost score
- Normalization: 35% volume ($1M+ = max) + 25% txn count (10K+ = max) + 15% liquidity ($5M+ = max) + unmet demand bonus + boost bonus
- Unmet demand: Tokens NOT on Jupiter get +15 bonus (not on Solana = higher demand signal)

**3. Social Demand (weight: 0.20)**
- Source: CoinGecko community data (real API fields, not fabricated)
- Metrics: Twitter followers, Reddit subscribers, Reddit active users (48h), sentiment votes
- Community score: Weighted composite (40% twitter + 20% reddit subs + 20% reddit active + 20% sentiment)
- Normalization: 60% community score + 25% sentiment + 15% reddit engagement ratio

**4. Origin Chain Health (weight: 0.15)**
- Source: CoinGecko market data + DefiLlama protocols
- Metrics: Market cap, 24h volume, TVL, holder count
- Holder count: Real on-chain data from Helius DAS API (for tokens with Solana mint), otherwise CoinGecko estimate marked as `(est.)`
- Normalization: 30% mcap ($5B+ = max) + 25% volume ($500M+ = max) + 25% TVL ($5B+ = max) + 20% holders (500K+ = max)

**5. Ecosystem Wallet Overlap (weight: 0.10)**
- Source: Heuristic model using bridge volume, chain proximity, category affinity, DefiLlama Solana TVL ratios
- Metric: Estimated percentage of token holders with active Solana wallets
- Chain proximity scores: Arbitrum (18%) > Optimism (16%) > Ethereum (15%) > Base (14%)
- Enhanced with real DefiLlama protocol TVL data for cross-chain presence estimation

### Score Calculation (Partial Data Approach)

```
available_weight = Σ(weight_i for signals that returned data)
scale = 1 / available_weight
MDS = Σ(normalized_signal_i × weight_i) × scale   (clamped 0-100)
confidence = available_signals / 5                  (0.0 to 1.0)

Score ranges:
  90-100: Extremely high demand — immediate migration candidate
  70-89:  Strong demand — worth prioritizing
  50-69:  Moderate demand — monitor trends
  30-49:  Emerging demand — early signal
  0-29:   Low/no demand — not ready
```

Missing signals are excluded from the score (weight redistributed to available signals).
A token with 3/5 signals gets `confidence: 0.6`. Tokens with 0 signals are excluded entirely.

## API Provider Architecture

### Tier 1: Free, No Auth Required

| API | Base URL | Data | Rate Limit |
|-----|----------|------|------------|
| WormholeScan | `api.wormholescan.io/api/v1` | Bridge volumes, scorecards | 1000/min |
| DefiLlama | `api.llama.fi` / `bridges.llama.fi` / `yields.llama.fi` | TVL, protocols, bridge volumes, DeFi APYs | ~100/min |
| DexScreener | `api.dexscreener.com` | DEX trading pairs, volume, liquidity, trending boosts | 300/min |
| Jupiter (Lite) | `lite-api.jup.ag` | Token listing verification, prices | 60/min |

### Tier 2: Free with API Key (optional)

| API | Base URL | Data | Rate Limit |
|-----|----------|------|------------|
| CoinGecko | `api.coingecko.com/api/v3` | Market data, community/social data, platforms | 10-30/min (30 with key) |
| Jupiter | `api.jup.ag` | Verified token list, bridged token detection, liquidity data | Key required |
| Helius | `mainnet.helius-rpc.com` | Real SPL token holder counts (DAS API) | 10 rps with key |
| OpenAI | `api.openai.com/v1` | GPT-4o-mini: streaming proposals + chat with tool-calling | Pay-per-use |

### Tier 3: Persistent Storage

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Upstash Redis | Community demand votes (anonymous, persistent) | 10K commands/day |

### Caching Strategy

| Data Type | TTL | Reason |
|-----------|-----|--------|
| Market data | 2 min | Prices change frequently |
| Bridge data | 5 min | Volume updates regularly |
| Search/DEX data | 10 min | Trading activity is moderately stable |
| Social data | 15 min | Community metrics change slowly |
| Wallet overlap | 30 min | Heuristic, infrequent change |
| Holder counts (Helius) | 30 min | On-chain data, changes slowly |
| Protocol list | 1 hour | Protocols don't change often |
| Token discovery | 1 hour | Top-500 list changes slowly |
| API response (/api/tokens) | 3 min | Full dashboard response cache |
| On-demand score | 5 min | Per-token MDS score cache |

### Error Handling

Every provider follows the same pattern:
1. Check in-memory cache → return if valid
2. Call live API with timeout (10s) + 1 retry on 5xx
3. On success → cache result → return
4. On failure → return `null` (data facade scores token with available signals only)

## Token Discovery (Non-Solana Assets)

Surfaces tokens from the top 500 by market cap that lack a native Solana contract address — actionable data for the Sunrise BD team.

### How It Works (3 API Sources)

```
CoinGecko /coins/markets (page 1 + page 2 = 500 tokens)
  ↓
CoinGecko /coins/list?include_platform=true (all coins with chain data)
  ↓
Cross-reference: for each top-500 token, check if "solana" key exists in platforms
  ↓
Filter out: tokens WITH Solana CA, stablecoins, tokens < $5M market cap
  ↓
Jupiter /tokens/v2/tag?query=verified (4500+ verified Solana tokens)
  ↓
Cross-reference by symbol + name similarity → detect bridged/wrapped tokens
  ↓
Result: ~300 tokens ranked by market cap, with Solana status + liquidity, cached 60 min
```

### Filtering Criteria

- **Solana presence**: Token excluded if CoinGecko `platforms` object contains a non-empty `solana` key
- **Stablecoins excluded**: USDT, USDC, DAI, BUSD, TUSD, FRAX, LUSD, PYUSD, FDUSD, USDE, and others
- **Market cap floor**: Tokens under $5M excluded
- **Origin chains**: Extracted from platform keys, mapped to display names (e.g., `binance-smart-chain` → `BSC`)

### Bridged Token Detection (Jupiter Cross-Reference)

After filtering non-Solana tokens, Discovery cross-references with Jupiter's verified token list to detect wrapped/bridged presence on Solana:

1. Fetch all verified tokens from `api.jup.ag/tokens/v2/tag?query=verified` (requires `JUPITER_API_KEY`)
2. Build a map keyed by uppercase symbol → `{ mint, name, liquidity }`
3. For each discovery token, check if a Jupiter token exists with the same symbol
4. **Name similarity matching** (`isLikelyBridgedMatch`) prevents false positives:
   - Bridge tags: tokens with "(Portal)", "(Wormhole)", "(Allbridge)", "(Celer)" in Jupiter name → trusted match
   - Name containment: one name contains the other (e.g., "Uniswap" in "Uniswap (Portal)")
   - First word match: first word of both names match and is 3+ chars (e.g., "Chainlink" == "Chainlink")
5. Matched tokens get `solanaStatus: "wrapped"`, `solanaMint`, and `solanaLiquidity` from Jupiter

**UI integration:**
- "Bridged" badge links to [Orb Markets](https://orbmarkets.io/token/{mint}) for analytics
- Liquidity number links to [Jupiter](https://jup.ag/tokens/{mint}) for source verification
- Filter pills: All / Bridged / Not on Solana

### Client Features

- Page size selector: 25 / 50 / 100 / 200 / All
- Client-side pagination with prev/next controls
- Sortable columns: rank, market cap, 24h volume, 7d change, demand votes, MDS score
- Search by token name, symbol, or chain
- CSV export (full filtered dataset, includes CoinGecko URLs)
- Clickable rows → CoinGecko token page (external link)
- **Demand upvotes** — persistent via Upstash Redis (anonymous user IDs, one vote per token)
- **On-demand MDS scoring** — "Score" button fetches all 5 signals and displays MdsBadge inline

## Dynamic Token Registry

The dashboard no longer uses a hardcoded 12-token list. Instead:

1. `discoverMigrationCandidates()` calls `fetchNoSolanaTokens()` (Discovery API)
2. Takes the top 50 tokens by market cap
3. Converts `DiscoveryToken` → `TokenCandidate` (maps origin chains via `DISCOVERY_CHAIN_MAP`)
4. Falls back to 12 static tokens (`STATIC_TOKEN_CANDIDATES`) if Discovery API fails
5. Batch processing: 5 tokens per batch with 2-second delay between batches
6. Response cached for 3 minutes on `/api/tokens` route

## On-Demand MDS Scoring

`POST /api/tokens/score` accepts `{ coingeckoId, symbol, name, originChain }` and:
1. Checks Jupiter listing status (used for unmet demand signal)
2. Fetches all 5 signal categories in parallel (market via CoinGecko, DEX activity via DexScreener, social via CoinGecko, bridge via WormholeScan, wallet overlap via heuristic)
3. Runs `calculateMDS()` on the signals
4. Returns `{ mds, marketCap, volume24h, bridgeVolume7d }`
5. Cached per token for 5 minutes

## Migration Health Monitor

Tracks post-migration health of tokens already on Solana (RENDER, HNT, POWR, GEOD):

### Health Score Calculation

```
healthScore = volumeScore × 0.30      (volume/marketCap ratio, normalized)
            + stabilityScore × 0.30   (30d price change stability)
            + bridgeScore × 0.20      (bridge activity volume, log-scaled)
            + momentumScore × 0.20    (7d price momentum)
```

Status thresholds: healthy (70+), moderate (40-69), concerning (<40)

### Data Sources

- **CoinGecko**: price, market cap, volume, 30d price history
- **WormholeScan**: 7d and 30d bridge volumes, bridge trend

## Enhanced Proposal Builder

Auto-generates structured migration analysis from token data:

### Bridge Recommendation Logic
- Ethereum/L2s with Wormhole support → NTT (Sunrise's preferred framework)
- Other chains → CCIP or LayerZero OFT
- Uses `CHAINS` config to check `bridgeSupport.wormhole`

### Liquidity Estimates
- Minimum: `volume24h × 0.1`
- Recommended: `volume24h × 0.3`
- Target pools: Jupiter (40%), Raydium (30%), Orca (20%), Kamino (10%)

### Risk Assessment
- Supply concentration: high if ratio > 3
- Low wallet overlap: medium if < 15%
- Declining bridge trend: medium if falling
- Negative sentiment: medium if < 0
- Overall level: high (any high factor), medium (2+ medium), low (default)

## AI Integration

Tideshift uses the Vercel AI SDK (`ai` + `@ai-sdk/openai`) with GPT-4o-mini for four features:

### AI Proposal Generation

`POST /api/ai/proposal` accepts `{ tokenId, tone }` and:
1. Fetches `TokenDetail` server-side via `getTokenDetail(tokenId)`
2. Serializes token data via `serializeTokenForAI()` — structured text covering all 5 MDS signals, market data, bridge activity, social metrics, wallet overlap
3. Selects system prompt based on tone (executive / technical / community)
4. Streams response via `streamText()` with `toTextStreamResponse()`
5. Client renders with `useCompletion()` + `react-markdown`

**Tones:**
- **Executive** — Board-ready brief: verdict first, ROI-focused, strategic language
- **Technical** — Protocol-aware: bridge mechanics, pool math, integration complexity
- **Community** — Holder-friendly: plain language, "what this means for you"

**Fallback:** If OpenAI is unavailable, the classic rule-based `generateMigrationAnalysis()` runs automatically.

### Ask Tideshift Chat

`POST /api/ai/chat` accepts `{ messages, tokenId, tokenData }` and:
1. Converts UIMessages to ModelMessages via `convertToModelMessages()`
2. Injects token context into system prompt (so "this token" resolves correctly)
3. If `tokenData` is provided (pre-serialized from client), injects it directly into the system prompt — the AI answers immediately without tool calls (~2-7s vs ~60s)
4. Streams response with `stopWhen: stepCountIs(3)` for multi-step tool execution
5. Returns `toUIMessageStreamResponse()` for `useChat` compatibility

**Tools available to the AI:**
| Tool | Description |
|------|-------------|
| `getTokenData(tokenId)` | Fetch full migration data for any token |
| `compareTokens(tokenIdA, tokenIdB)` | Side-by-side MDS comparison |
| `explainSignal(tokenId, signal)` | Deep-dive into a specific MDS signal |
| `getTopCandidates(limit)` | Fetch top migration candidates ranked by MDS score |

**Scope enforcement:** The system prompt restricts responses to migration analysis and Solana ecosystem topics. Off-topic questions (general knowledge, math, etc.) are politely declined.

### Quick AI Summary

`POST /api/ai/quick-summary` accepts `{ coingeckoId }` and:
1. Fetches `TokenDetail` server-side via `getTokenDetail()`
2. Serializes via `serializeTokenForAI()`
3. Uses `generateText()` (non-streaming) with `maxOutputTokens: 150`, temperature 0.3
4. Returns `{ summary: string }` — a 2-3 sentence migration assessment
5. Results cached in-memory for 10 minutes per token

**UI:** Sparkle button in the AI column of the Discovery table. Shows a popover with the summary below the button.

### Migration Scout Agent

`POST /api/ai/scout` accepts `{ tokens }` (top 15 `DiscoveryToken[]` from client) and:
1. Serializes each token with a lightweight `serializeDiscoveryToken()` (rank, market cap, volume, 7d change, chains, Solana status)
2. Streams response via `streamText()` with `toTextStreamResponse()`
3. System prompt structures output as: Executive Summary → Top 5 Recommendations → Surging Demand → Risk Flags → This Week's Priority

**UI:** "Run Scout" gradient button on Discovery page → opens a dialog modal with streaming markdown output. Uses `useCompletion` with `streamProtocol: "text"`.

**Client-side data passing:** Scout receives token data from the client POST body (same data already fetched for the Discovery table), avoiding redundant API calls. Response time: ~18s.

## API Health Board

Real-time sidebar panel showing the status of all API providers (CoinGecko, WormholeScan, DefiLlama, Jupiter, DexScreener).

### How It Works

- `trackedFetch()` wraps every API call, recording status, latency, and failure count per provider
- No extra API calls — piggybacks on existing data fetches
- Status derived from response: 2xx = healthy, 4xx/5xx = degraded, 3+ consecutive failures = down
- Sidebar shows colored status dots, provider names, and relative timestamps
- Collapsed sidebar shows a single composite status icon

## Onboarding Flow Architecture

### Single-Page Stepper (not multi-route)

The onboarding flow is a single page with 5 steps managed via React state:
1. Welcome → 2. Wallet → 3. Bridge → 4. Trade → 5. DeFi

### Live DeFi APYs

The DeFi step fetches real yield data from DefiLlama Yields API:
- `/api/yields?protocols=Kamino+Finance,MarginFi,Raydium` returns live APYs
- Protocol slugs mapped to DefiLlama project names (e.g., Kamino → `kamino-lend`, MarginFi → `save`)
- Displays "Live" badge with real APY percentages and TVL data

### Analytics Funnel

Step completion tracked via Upstash Redis (same instance as demand votes):
- `POST /api/analytics/onboarding` records `{ token, step, sessionId }` → Redis SET per step (auto-deduplicates)
- `GET /api/analytics/onboarding?token=render` reads unique visitor counts per step via `SCARD`
- `GET /api/analytics/onboarding` (no token param) aggregates across all 4 tokens
- Dashboard funnel component uses SWR with 30s auto-refresh
- Shows "No onboarding sessions recorded yet" when no real data exists (no demo/fake data)

### White-Label Configuration

Per-token configs in `lib/config/onboarding.ts` define:
- Branding colors and gradients
- Bridge routes and configurations
- Trading venue links (Jupiter, etc.)
- DeFi opportunities with live APYs

Supported tokens: RENDER, HNT (Helium), POWR (Powerledger), GEOD (GEODNET)

## Data Integrity

All MDS signals trace to real APIs — no hardcoded, fabricated, or simulated data:

| Signal | Provider | What's Real |
|--------|----------|------------|
| Bridge outflow | WormholeScan | Actual cross-chain bridge volumes (7d + 30d) |
| Search intent | DexScreener | Real 24h DEX volume, pair counts, liquidity, trending data |
| Social demand | CoinGecko | Real twitter followers, reddit subscribers, sentiment votes |
| Chain health | CoinGecko + DefiLlama | Real market cap, volume, TVL, price history |
| Holder counts | Helius DAS API | Real on-chain SPL token holder counts (paginated scan) |
| Wallet overlap | Heuristic + DefiLlama | Chain proximity model enhanced with real protocol TVL ratios |
| DeFi yields | DefiLlama Yields | Real APYs for Kamino, MarginFi, Raydium, etc. |
| Onboarding analytics | Upstash Redis | Real funnel conversion data (Redis SETs, auto-deduplicated) |
| AI analysis | OpenAI GPT-4o-mini | Streaming proposals (3 tones) + chat with tool-calling |
| Demand votes | Upstash Redis | Persistent community votes (not localStorage) |

### Missing Data Handling

When API providers are rate-limited or unavailable, the UI shows "—" instead of misleading `$0.00` values:
- `hasMarketData` flag on `TokenWithScore` / `TokenDetail` — controls price, market cap, volume, TVL, holders, ATH display
- `hasSocialData` flag on `TokenDetail` — controls community score, sentiment, Twitter/Reddit display
- Scoring engine still uses `?? 0` numeric fallbacks (needed for math), but UI distinguishes real zeros from missing data

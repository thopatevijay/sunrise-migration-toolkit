# Architecture — Tideshift

## System Overview

Tideshift consists of three main products sharing a common data layer:

1. **Demand Discovery Dashboard** — identifies and ranks token migration candidates using real API data
2. **Token Discovery** — scans top 500 tokens by market cap and surfaces those without a native Solana contract address
3. **Community Onboarding Flow** — white-label onboarding for migrated token communities

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
│   │   ├── layout.tsx                # Sidebar + header + demo banner
│   │   ├── loading.tsx               # Skeleton loading state
│   │   ├── page.tsx                  # Main dashboard (stats, table, charts, funnel)
│   │   ├── tokens/[id]/page.tsx      # Token detail (radar, signals, proposal)
│   │   ├── discovery/
│   │   │   ├── page.tsx              # Token Discovery (non-Solana tokens)
│   │   │   └── loading.tsx           # Skeleton loading state
│   │   └── proposals/page.tsx        # Saved migration proposals
│   ├── (onboarding)/onboard/[token]/ # Community Onboarding Flow
│   │   ├── layout.tsx                # Full-width branded layout
│   │   ├── loading.tsx               # Loading state
│   │   └── page.tsx                  # 5-step stepper (single page, not multi-route)
│   └── api/
│       ├── tokens/
│       │   ├── route.ts              # GET /api/tokens (all candidates + stats)
│       │   └── [id]/route.ts         # GET /api/tokens/:id (single token detail)
│       └── discovery/
│           └── no-solana/route.ts    # GET /api/discovery/no-solana (non-Solana tokens)
├── components/
│   ├── dashboard/
│   │   ├── stats-bar.tsx             # 4 KPI cards with animated counters
│   │   ├── token-table.tsx           # Ranked, sortable, filterable token table
│   │   ├── demand-chart.tsx          # Tabbed charts (bridge outflows, search, MDS)
│   │   ├── discovery-table.tsx        # Non-Solana token table (pagination, CSV, CoinGecko links)
│   │   ├── migrated-banner.tsx       # Horizontal scroll of migrated tokens
│   │   ├── sparkline.tsx             # Tiny inline trend chart
│   │   ├── token-detail/
│   │   │   ├── token-header.tsx      # Hero with MDS score ring
│   │   │   ├── score-breakdown.tsx   # Radar chart + signal bars
│   │   │   ├── signal-cards.tsx      # 5 expandable signal detail cards
│   │   │   ├── price-chart.tsx       # 30-day price area chart
│   │   │   ├── migration-readiness.tsx # NTT/team/bridge checklist
│   │   │   └── similar-tokens.tsx    # Related token cards
│   │   └── proposal-builder/
│   │       └── proposal-form.tsx     # Proposal dialog + preview + clipboard
│   ├── onboarding/
│   │   ├── onboarding-stepper.tsx    # 5-step progress bar
│   │   ├── onboarding-analytics.tsx  # Funnel visualization component
│   │   └── steps/
│   │       ├── welcome-step.tsx      # Welcome + "Get Started"
│   │       ├── wallet-step.tsx       # Phantom/Backpack/Solflare wallet setup
│   │       ├── bridge-step.tsx       # Bridge via Sunrise link
│   │       ├── trade-step.tsx        # Jupiter swap link
│   │       └── defi-step.tsx         # DeFi opportunities + completion
│   ├── shared/
│   │   ├── chain-badge.tsx           # Chain logo + name
│   │   ├── demo-banner.tsx           # Data source indicator (live/partial)
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
│   └── use-tokens.ts                 # SWR hooks (5min dashboard, 1min detail refresh)
├── lib/
│   ├── data/
│   │   ├── index.ts                  # Data facade — partial data approach, no demo fallback
│   │   ├── token-discovery.ts        # Curated token registry (sync)
│   │   ├── discovery-no-solana.ts    # Non-Solana token discovery (2 CoinGecko calls, cross-ref)
│   │   ├── providers/                # Live API provider clients
│   │   │   ├── cache.ts              # TTL-based in-memory cache (500 entries)
│   │   │   ├── http.ts              # Shared fetch helper (timeout + retry)
│   │   │   ├── health.ts             # API health tracker (trackedFetch + status snapshot)
│   │   │   ├── coingecko.ts          # Market data + social proxy
│   │   │   ├── wormhole.ts           # Bridge outflow data (WormholeScan)
│   │   │   ├── defillama.ts          # TVL, protocol data, bridge volumes
│   │   │   ├── jupiter.ts            # Search intent proxy + prices
│   │   │   ├── debridge.ts           # Supplemental bridge data
│   │   │   ├── wallet-heuristic.ts   # Wallet overlap estimation
│   │   │   └── index.ts              # Re-exports all providers
│   │   └── (no demo folder — all data from live APIs)
│   ├── scoring/
│   │   ├── mds.ts                    # calculateMDS() — normalize, weight, sum
│   │   ├── normalizers.ts            # 5 signal normalizers (0-100)
│   │   └── weights.ts               # Signal weights + labels
│   ├── analytics/
│   │   └── onboarding.ts            # Step tracking + funnel (localStorage)
│   ├── types/
│   │   ├── scoring.ts                # MDS interfaces + score utilities
│   │   ├── signals.ts                # Signal type definitions (bridge, search, social, market, wallet)
│   │   ├── discovery.ts              # DiscoveryToken, DiscoveryResponse, SolanaStatus
│   │   └── proposals.ts              # Proposal storage (localStorage)
│   ├── config/
│   │   ├── tokens.ts                 # Token registry (12 candidates + 4 migrated) + types
│   │   ├── chains.ts                 # 9 chain definitions
│   │   └── onboarding.ts            # Per-token onboarding configs (HYPE, MON)
│   └── utils.ts                      # formatUSD, formatNumber, cn, etc.
```

## Data Flow

```
Live APIs (CoinGecko, WormholeScan, DefiLlama, Jupiter, deBridge)
  ↓ trackedFetch() → records provider health + try/catch → null on failure
Provider Clients (src/lib/data/providers/)
  ↓ TTL-cached, partial data approach
  ├── Data Facade (src/lib/data/index.ts)
  │     ↓ MDS scoring with weight redistribution for missing signals
  │     API Routes (/api/tokens, /api/tokens/:id)
  │     ↓ JSON response + provider health snapshot
  │     SWR Hooks (auto-refresh: 5min dashboard, 1min detail)
  │
  └── Discovery (src/lib/data/discovery-no-solana.ts)
        ↓ 2 CoinGecko calls → cross-reference → filter non-Solana
        API Route (/api/discovery/no-solana)
        ↓ JSON response
        SWR Hook (auto-refresh: 60min)
  ↓
React Components + API Health Board (sidebar)
```

## Migration Demand Score (MDS)

The scoring engine aggregates five signal categories into a single score per token:

### Signal Categories

**1. Bridge Outflow Volume (weight: 0.30)**
- Source: WormholeScan `top-assets-by-volume` API
- Metric: Cross-chain bridge volume for this token (7d + 30d)
- Higher outflow = active cross-chain demand for this asset

**2. Search Intent (weight: 0.25)**
- Source: Jupiter Lite `token/v2/search` API
- Metric: Whether token exists on Solana/Jupiter — absence = unmet demand
- Market cap rank modulates estimated search volume

**3. Social Demand (weight: 0.20)**
- Source: CoinGecko community data (twitter followers, sentiment votes, reddit)
- Metric: Community size and sentiment as proxy for migration demand
- Sentiment normalization: CoinGecko % → -1 to +1 scale

**4. Origin Chain Health (weight: 0.15)**
- Source: CoinGecko market data + DefiLlama protocols
- Metrics: Market cap, 24h volume, TVL, holder count
- Filters out dead/dying tokens — only surface healthy candidates

**5. Ecosystem Wallet Overlap (weight: 0.10)**
- Source: Heuristic model using bridge volume, chain proximity, category affinity
- Metric: Estimated percentage of token holders with active Solana wallets
- Chain proximity scores: Arbitrum (18%) > Optimism (16%) > Ethereum (15%) > Base (14%)

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
| DefiLlama | `api.llama.fi` / `bridges.llama.fi` | TVL, protocols, bridge volumes | ~100/min |
| Jupiter Lite | `lite-api.jup.ag` | Token search, prices | 60/min |
| deBridge | `dln.debridge.finance/v1.0` | Supported chains, orders | Generous |

### Tier 2: Free with API Key (optional)

| API | Base URL | Data | Rate Limit |
|-----|----------|------|------------|
| CoinGecko | `api.coingecko.com/api/v3` | Market data, social proxy | 10-30/min (30 with key) |
| Helius | `mainnet.helius-rpc.com` | Wallet analysis (DAS) | 10 rps with key |

### Caching Strategy

| Data Type | TTL | Reason |
|-----------|-----|--------|
| Market data | 2 min | Prices change frequently |
| Bridge data | 5 min | Volume updates regularly |
| Search data | 10 min | Search intent is stable |
| Social data | 15 min | Community metrics change slowly |
| Wallet overlap | 30 min | Heuristic, infrequent change |
| Protocol list | 1 hour | Protocols don't change often |
| Token discovery | 1 hour | Top-500 list changes slowly |

### Error Handling

Every provider follows the same pattern:
1. Check in-memory cache → return if valid
2. Call live API with timeout (10s) + 1 retry on 5xx
3. On success → cache result → return
4. On failure → return `null` (data facade scores token with available signals only)

## Token Discovery (Non-Solana Assets)

Surfaces tokens from the top 500 by market cap that lack a native Solana contract address — actionable data for the Sunrise BD team.

### How It Works (2 API Calls)

```
CoinGecko /coins/markets (page 1 + page 2 = 500 tokens)
  ↓
CoinGecko /coins/list?include_platform=true (all coins with chain data)
  ↓
Cross-reference: for each top-500 token, check if "solana" key exists in platforms
  ↓
Filter out: tokens WITH Solana CA, stablecoins, tokens < $5M market cap
  ↓
Result: ~300 tokens ranked by market cap, cached 60 minutes
```

### Filtering Criteria

- **Solana presence**: Token excluded if CoinGecko `platforms` object contains a non-empty `solana` key
- **Stablecoins excluded**: USDT, USDC, DAI, BUSD, TUSD, FRAX, LUSD, PYUSD, FDUSD, USDE, and others
- **Market cap floor**: Tokens under $5M excluded
- **Origin chains**: Extracted from platform keys, mapped to display names (e.g., `binance-smart-chain` → `BSC`)

### Client Features

- Page size selector: 25 / 50 / 100 / 200 / All
- Client-side pagination with prev/next controls
- Sortable columns: rank, market cap, 24h volume, 7d change
- Search by token name, symbol, or chain
- CSV export (full filtered dataset, includes CoinGecko URLs)
- Clickable rows → CoinGecko token page (external link)

## API Health Board

Real-time sidebar panel showing the status of all 5 API providers (CoinGecko, WormholeScan, DefiLlama, Jupiter, deBridge).

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

### Analytics Funnel

Step completion tracked via localStorage:
- Each step records: `{ token, step, stepName, timestamp, sessionId }`
- Funnel visualization on dashboard shows conversion rates
- Demo funnel data shown when no real sessions exist yet

### White-Label Configuration

Per-token configs in `lib/config/onboarding.ts` define:
- Branding colors and gradients
- Bridge routes and configurations
- Trading venue links (Jupiter, etc.)
- DeFi opportunities with APYs

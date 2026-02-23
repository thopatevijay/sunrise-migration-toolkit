# Architecture — Tideshift

## System Overview

Tideshift consists of two main products sharing a common data layer:

1. **Demand Discovery Dashboard** — identifies and ranks token migration candidates using real API data
2. **Community Onboarding Flow** — white-label onboarding for migrated token communities

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
│   │   └── proposals/page.tsx        # Saved migration proposals
│   ├── (onboarding)/onboard/[token]/ # Community Onboarding Flow
│   │   ├── layout.tsx                # Full-width branded layout
│   │   ├── loading.tsx               # Loading state
│   │   └── page.tsx                  # 5-step stepper (single page, not multi-route)
│   └── api/tokens/
│       ├── route.ts                  # GET /api/tokens (all candidates + stats)
│       └── [id]/route.ts             # GET /api/tokens/:id (single token detail)
├── components/
│   ├── dashboard/
│   │   ├── stats-bar.tsx             # 4 KPI cards with animated counters
│   │   ├── token-table.tsx           # Ranked, sortable, filterable token table
│   │   ├── demand-chart.tsx          # Tabbed charts (bridge outflows, search, MDS)
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
│   ├── app-header.tsx                # Page title + data freshness + network badge
│   ├── app-sidebar.tsx               # Navigation sidebar
│   ├── theme-provider.tsx            # next-themes dark mode
│   └── ui/                           # shadcn/ui primitives
├── hooks/
│   ├── use-mobile.tsx                # Responsive breakpoint hook
│   └── use-tokens.ts                 # SWR hooks (5min dashboard, 1min detail refresh)
├── lib/
│   ├── data/
│   │   ├── index.ts                  # Data facade — partial data approach, no demo fallback
│   │   ├── token-discovery.ts        # Curated token registry (sync)
│   │   ├── providers/                # Live API provider clients
│   │   │   ├── cache.ts              # TTL-based in-memory cache (500 entries)
│   │   │   ├── http.ts              # Shared fetch helper (timeout + retry)
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
  ↓ try/catch → null on failure (no demo fallback)
Provider Clients (src/lib/data/providers/)
  ↓ TTL-cached, partial data approach
Data Facade (src/lib/data/index.ts)
  ↓ MDS scoring with weight redistribution for missing signals
API Routes (/api/tokens, /api/tokens/:id)
  ↓ JSON response
SWR Hooks (auto-refresh: 5min dashboard, 1min detail)
  ↓
React Components
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

### Error Handling

Every provider follows the same pattern:
1. Check in-memory cache → return if valid
2. Call live API with timeout (10s) + 1 retry on 5xx
3. On success → cache result → return
4. On failure → return `null` (data facade scores token with available signals only)

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

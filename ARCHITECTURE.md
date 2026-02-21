# Architecture — Sunrise Migration Toolkit

## System Overview

The toolkit consists of two main products sharing a common data layer:

1. **Demand Discovery Dashboard** — identifies and ranks token migration candidates
2. **Community Onboarding Flow** — white-label onboarding for migrated token communities

## Directory Structure

```
sunrise-migration-toolkit/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── (dashboard)/             # Demand Discovery Dashboard
│   │   ├── page.tsx             # Main dashboard view
│   │   ├── tokens/
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Individual token detail
│   │   └── proposals/
│   │       └── page.tsx         # Migration proposal builder
│   └── (onboarding)/            # Community Onboarding Flow
│       └── [token]/
│           ├── page.tsx         # Onboarding landing
│           ├── wallet/
│           │   └── page.tsx     # Wallet setup step
│           ├── bridge/
│           │   └── page.tsx     # Bridge flow step
│           ├── trade/
│           │   └── page.tsx     # Trading venues step
│           └── defi/
│               └── page.tsx     # DeFi opportunities step
├── lib/
│   ├── scoring/
│   │   ├── mds.ts               # Migration Demand Score calculator
│   │   ├── weights.ts           # Signal weight configuration
│   │   └── types.ts             # Scoring types
│   ├── data/
│   │   ├── bridge.ts            # Bridge volume data (Wormhole, deBridge)
│   │   ├── dex.ts               # DEX search intent (Jupiter, Birdeye)
│   │   ├── social.ts            # Social signal aggregation
│   │   ├── onchain.ts           # On-chain analytics (Helius)
│   │   └── market.ts            # Market data (CoinGecko, DefiLlama)
│   ├── analytics/
│   │   ├── onboarding.ts        # Onboarding funnel tracking
│   │   └── migration-health.ts  # Post-migration metrics
│   └── config/
│       ├── tokens.ts            # Token registry & configurations
│       └── chains.ts            # Supported chain configurations
├── components/
│   ├── dashboard/               # Dashboard-specific components
│   ├── onboarding/              # Onboarding flow components
│   └── shared/                  # Shared UI components
├── public/                      # Static assets
├── .env.example                 # Required environment variables
└── .dev-refs.md                 # Deployed addresses, endpoints
```

## Migration Demand Score (MDS)

The scoring engine aggregates five signal categories into a single score per token:

### Signal Categories

**1. Bridge Outflow Volume (weight: 0.30)**
- Source: Wormhole Explorer API, deBridge API
- Metric: SOL-denominated value leaving Solana to buy this token on other chains
- Higher outflow = Solana users want this token but can't get it locally

**2. Search Intent (weight: 0.25)**
- Source: Jupiter terminal search data, Birdeye search trends
- Metric: Frequency of searches for a token that doesn't exist on Solana
- Direct signal of user demand

**3. Social Demand (weight: 0.20)**
- Source: X/Twitter API, filtered by Solana community accounts
- Metric: Mentions requesting/discussing a token's availability on Solana
- Sentiment analysis to separate demand from general discussion

**4. Origin Chain Health (weight: 0.15)**
- Source: CoinGecko, DefiLlama
- Metrics: 24h volume, TVL, holder count, market cap, age
- Filters out dead/dying tokens — only surface healthy candidates

**5. Ecosystem Wallet Overlap (weight: 0.10)**
- Source: Helius, origin chain explorers
- Metric: Percentage of the token's holders who also have active Solana wallets
- Higher overlap = easier community migration

### Score Calculation

```
MDS = Σ(normalized_signal_i × weight_i) × 100

Score ranges:
  90-100: Extremely high demand — immediate migration candidate
  70-89:  Strong demand — worth prioritizing
  50-69:  Moderate demand — monitor trends
  30-49:  Emerging demand — early signal
  0-29:   Low/no demand — not ready
```

## Onboarding Flow Architecture

### White-Label Configuration

Each token onboarding is configured via a JSON spec:

```typescript
interface OnboardingConfig {
  token: {
    symbol: string;
    name: string;
    originChain: string;
    solanaAddress: string;
    logo: string;
  };
  branding: {
    primaryColor: string;
    accentColor: string;
    heroImage?: string;
  };
  bridges: {
    sunrise: boolean; // primary
    fallback?: string[]; // alternative bridges
  };
  tradingVenues: string[]; // jupiter, raydium, orca, etc.
  defiOpportunities: {
    protocol: string;
    type: 'lending' | 'lp' | 'staking';
    url: string;
  }[];
}
```

### Funnel Analytics

Track conversion at each step:

```
Landing → Wallet Setup → Bridge → First Trade → DeFi
  100%      65%           40%       30%           15%
```

Each step logs anonymized events to measure:
- Drop-off rate per step
- Average time per step
- Most common wallet choice
- Bridge completion rate
- First trade venue preference

## API Dependencies

| API | Purpose | Rate Limit | Auth |
|-----|---------|-----------|------|
| Jupiter API | Search intent, swap routes | 60 req/min | API key |
| Birdeye API | Token discovery, market data | 100 req/min | API key |
| Helius RPC | On-chain data, wallet analysis | Based on plan | API key |
| CoinGecko API | Market data, token metadata | 30 req/min | Free tier |
| DefiLlama API | TVL, protocol data | No limit | None |
| Wormhole Explorer | Bridge volume data | TBD | None |
| X/Twitter API | Social signals | Based on plan | OAuth |

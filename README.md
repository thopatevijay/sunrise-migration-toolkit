# Tideshift

**Full-lifecycle infrastructure for token migrations to Solana — from demand discovery to community onboarding.**

Built for the [Sunrise](https://sunrisedefi.com) Migrations track at the [Solana Graveyard Hackathon](https://solana.com/graveyard-hack).

**[Live Demo](https://tideshift.vercel.app)** | Powered by live data from 8 API providers — zero hardcoded or fabricated data.

---

## Problem

Sunrise brings tokens to Solana with day-one liquidity and distribution. But two critical gaps remain in the migration lifecycle:

### Upstream: Which tokens should come next?

Today, identifying migration candidates is manual. Someone at Sunrise has to spot demand through anecdotal signals — tweets, DMs, community chatter. There's no systematic way to answer: **"Which tokens do Solana users actually want, and how badly?"**

Meanwhile, real demand goes unnoticed. Solana users are bridging to other chains to buy tokens that should already be on Solana. They're searching for tokens on Jupiter that don't exist yet. They're asking in Discord servers. All of this demand data is scattered and invisible.

### Downstream: Communities don't migrate with their tokens

A token arriving on Solana is only half the migration. The token's community — the people who actually trade it, hold it, and build around it — are still on the origin chain. They need to:

- Set up a Solana wallet (many have never used Solana)
- Understand how to bridge their tokens
- Find where to trade on Solana
- Discover DeFi opportunities (lending, LPing, staking)

This onboarding journey is undocumented and different for every token. Most community members never complete it. The result: tokens arrive on Solana but without the users who give them life.

**Sunrise handles the hardest parts — canonical asset arrival, liquidity, and venue distribution. Tideshift handles everything around it.**

---

## Solution

Tideshift covers the **full migration lifecycle** — from demand discovery to post-migration monitoring — designed to serve Sunrise's pipeline end to end:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                       SUNRISE MIGRATION LIFECYCLE                            │
│                                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ DISCOVER │─>│  SCORE   │─>│ MIGRATE  │─>│ MONITOR  │─>│ ONBOARD  │       │
│  │          │  │          │  │          │  │          │  │          │       │
│  │ ~300     │  │ Top 50   │  │ Sunrise  │  │ Health   │  │ 4 token  │       │
│  │ non-     │  │ dynamic  │  │ handles  │  │ tracking │  │ flows    │       │
│  │ Solana   │  │ MDS      │  │ asset    │  │ for      │  │ wallet → │       │
│  │ tokens   │  │ scoring  │  │ arrival  │  │ migrated │  │ bridge → │       │
│  │          │  │ + voting │  │          │  │ tokens   │  │ trade →  │       │
│  │          │  │ + on-    │  │          │  │          │  │ DeFi     │       │
│  │          │  │ demand   │  │          │  │          │  │          │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│   Tideshift    Tideshift      SUNRISE      Tideshift     Tideshift          │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Part 1: Token Discovery

Scans the top 500 tokens by market cap on CoinGecko and cross-references platform data to identify tokens without a native Solana contract address. Surfaces ~300 migration opportunities with market data, origin chains, and CoinGecko links.

- **Client-side pagination** — view 25, 50, 100, 200, or all tokens at once
- **Search and sort** — filter by token name, symbol, or chain; sort by market cap, volume, or 7d change
- **CSV export** — download the full filtered dataset with CoinGecko URLs for Sunrise BD team analysis
- **Community demand voting** — persistent upvotes via Upstash Redis (anonymous, one vote per token per user)
- **On-demand MDS scoring** — score any token in real time from the table
- **Methodology banner** — transparent explanation of filtering criteria

### Part 2: Demand Discovery Dashboard

Dynamically scores the **top 50 non-Solana tokens** (by market cap) using 5 real-time signal categories. No hardcoded token lists — the dashboard pulls from the Discovery API and scores automatically.

**Data signals we aggregate:**

| Signal | Weight | Source | What it tells us |
|--------|--------|--------|-----------------|
| Bridge outflows | 30% | WormholeScan, deBridge | Solana users leaving to buy tokens elsewhere |
| Search intent | 25% | DexScreener (DEX trading activity) | Real trading volume, liquidity, and pair counts across DEXs |
| Social demand | 20% | CoinGecko community data | Twitter followers, Reddit activity, sentiment votes |
| Origin-chain health | 15% | CoinGecko, DefiLlama | Token health: volume, TVL, holder count, market cap |
| Wallet overlap | 10% | Heuristic model + DefiLlama TVL ratios | How many Solana wallets also hold the origin token |

**Key features:**
- **50 dynamically scored tokens** — refreshes from live data, cached 3 minutes
- **Demand trends** — is interest growing or fading?
- **Community demand voting** — persistent via Upstash Redis
- **On-demand MDS scoring** — score any Discovery token in real time from the table
- **Auto-generated proposals** — bridge recommendation, liquidity estimates, risk assessment, competitive landscape

**Who uses this:** Sunrise team, to prioritize which tokens to bring next. Token teams, to see if demand exists before applying.

### Part 3: Migration Health Monitor

Tracks post-migration health of tokens already on Solana. Completes the lifecycle: Discovery → Score → Migrate → **Monitor**.

- **Health score** (0-100): composite of volume trend, market cap stability, bridge activity, price momentum
- **30-day price sparklines** for each migrated token
- **Bridge activity tracking** from WormholeScan
- **Status badges**: healthy / moderate / concerning

Currently monitoring: RENDER, HNT, POWR, GEOD

### Part 4: Community Onboarding Flow

A white-label, per-token onboarding experience that Sunrise deploys for each migration. When a token arrives on Solana, its community gets a guided path to become Solana users.

**The flow:**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Step 1: "Your token is now on Solana"                  │
│  ├── What happened (canonical listing via Sunrise)      │
│  ├── What this means for holders                        │
│  └── Why Solana (speed, cost, DeFi ecosystem)           │
│                                                         │
│  Step 2: Set up your Solana wallet                      │
│  ├── Phantom / Backpack / Solflare guides               │
│  ├── Video walkthrough                                  │
│  └── "I already have a wallet" skip option              │
│                                                         │
│  Step 3: Bridge your tokens                             │
│  ├── Pre-configured Sunrise bridge flow                 │
│  ├── Origin chain auto-detected                         │
│  └── Estimated time and fees shown upfront              │
│                                                         │
│  Step 4: Start trading on Solana                        │
│  ├── Where to trade (Jupiter, Raydium, Orca)            │
│  ├── Current price and liquidity depth                  │
│  └── Direct swap link                                   │
│                                                         │
│  Step 5: Explore DeFi opportunities                     │
│  ├── Live APYs from DefiLlama (Kamino, MarginFi, etc.) │
│  ├── Liquidity provision with real yield data           │
│  └── Staking (if applicable)                            │
│                                                         │
│  Analytics: Track conversion at each step               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key features:**
- **White-label** — customizable per token (colors, branding, messaging)
- **Origin-chain aware** — detects which chain the user is coming from
- **Live DeFi APYs** — real yield data from DefiLlama (Kamino, Raydium, MarginFi, etc.)
- **Progress tracking** — users see where they are in the onboarding journey
- **Analytics dashboard** — real-time conversion funnel backed by Upstash Redis 
- **Shareable** — token communities can share the onboarding link on their Discord/Twitter

**Who uses this:** Token communities migrating to Solana. Sunrise team, to measure migration success.

Currently live for: RENDER, HNT, POWR, GEOD

---

## Data Integrity

**Every data point in Tideshift traces to a real API call. There is zero hardcoded, fabricated, or simulated data.**

| Signal | Data Source | What We Fetch |
|--------|-----------|--------------|
| Market data | CoinGecko | Price, market cap, volume, TVL, ATH, 30d price history |
| Social data | CoinGecko | Twitter followers, Reddit subscribers, Reddit active users, sentiment votes |
| Search intent | DexScreener | 24h DEX volume, pair counts, Solana pairs, liquidity, trending/boost scores |
| Bridge outflows | WormholeScan + deBridge | 7d/30d bridge volumes, timeseries, transaction counts |
| TVL & protocols | DefiLlama | Protocol TVL, Solana TVL ratios, chain bridge volumes |
| DeFi yields | DefiLlama Yields | Live APYs for Kamino, MarginFi, Raydium, Orca, Drift, Sanctum, Jupiter |
| Token listing | Jupiter | Whether token exists on Jupiter (verified listing check) |
| Holder counts | Helius DAS API | Real SPL token holder counts for Solana-listed tokens |
| Wallet overlap | Heuristic + DefiLlama | Chain proximity + bridge data + protocol TVL ratios |
| Onboarding analytics | Upstash Redis | Real funnel conversion tracking (Redis SETs, auto-deduplicated) |
| Demand votes | Upstash Redis | Persistent community voting (anonymous, one per user per token) |

---

## User Stories

### Sunrise Team — Finding the Next Migration

> **As a Sunrise team member**, I open the Demand Dashboard on Monday morning. The top-ranked token is ONDO (Ondo Finance) with an MDS of 87. The dashboard shows: real bridge outflows from WormholeScan, $29M in 24h DEX trading volume from DexScreener, and strong community sentiment from CoinGecko. I click "Generate Proposal" and get a structured brief — token health metrics, community size, liquidity requirements — ready to share with the team and start the migration conversation with Ondo's team.

### Token Team — Deciding to Come to Solana

> **As a token project founder on Ethereum**, I'm considering expanding to Solana but unsure if real demand exists. Someone shares the Tideshift link. I search for my token and see a demand score of 72, with data showing real DEX trading activity, bridge outflows, and community sentiment. I see a "Request Migration via Sunrise" button, click it, and get connected with the Sunrise team — with all my demand data pre-filled in the application.

### Community Member — Onboarding After Migration

> **As a RENDER holder on Ethereum**, I see a tweet that RENDER is now live on Solana via Sunrise. The tweet links to `tideshift.app/onboard/render`. I land on a branded page explaining what happened. I don't have a Solana wallet, so I follow the guided Phantom setup (takes 2 minutes). Next step pre-configures the bridge — I enter the amount, approve, and my RENDER arrives on Solana in under a minute. The final step shows me where to trade (Jupiter, with a direct swap link) and where to earn yield (Kamino lending at 4.2% APY — real-time from DefiLlama). I went from "what is Solana?" to actively using Solana DeFi in 10 minutes.

### Solana Power User — Signaling Demand

> **As an active Solana trader**, I keep bridging to Arbitrum to trade tokens that aren't on Solana yet. I visit the Discovery page, see ~300 non-Solana tokens ranked, and upvote the ones I want most. My votes are persisted via Upstash Redis. When one of my upvoted tokens finally migrates via Sunrise, I get notified and the onboarding page is ready for me to share with my community.

---

## Why This Matters for Sunrise

| Without Tideshift | With Tideshift |
|----------------|-------------|
| Manual demand discovery | Token Discovery: ~300 non-Solana tokens surfaced automatically |
| Anecdotal signals | Quantified demand with MDS scoring across 5 real-time signal categories |
| No visibility into migration landscape | Full list of top-500 tokens without Solana CA, exportable as CSV |
| No community input | Persistent community demand voting via Upstash Redis |
| Manual proposal writing | Auto-generated proposals with bridge, liquidity, and risk analysis |
| No post-migration tracking | Migration Health Monitor with health scores and trend data |
| Community left to figure it out | Guided onboarding for 4 tokens with live DeFi APYs |
| No post-migration metrics | Conversion analytics at every step |
| Each migration starts from scratch | Repeatable, scalable process |

Tideshift turns Sunrise's migration pipeline from a series of one-off efforts into a **systematic, measurable operation**.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (Next.js)                              │
│                                                                          │
│  ┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐  │
│  │  Discovery   │ │Dashboard │ │Migration │ │ Proposal  │ │Onboarding│  │
│  │  Table       │ │ (MDS)   │ │ Health   │ │ Builder   │ │  Flow    │  │
│  │             │ │          │ │ Monitor  │ │           │ │          │  │
│  │ ~300 tokens │ │ Top 50   │ │ RENDER,  │ │ Auto-gen  │ │ 4 tokens │  │
│  │ Demand vote │ │ dynamic  │ │ HNT,     │ │ bridge +  │ │ 5 steps  │  │
│  │ MDS scoring │ │ scoring  │ │ POWR,    │ │ liquidity │ │ each     │  │
│  │ CSV export  │ │          │ │ GEOD     │ │           │ │          │  │
│  └──────┬──────┘ └────┬─────┘ └────┬─────┘ └─────┬─────┘ └────┬─────┘  │
│          └─────────────┼───────────┼──────────────┼────────────┘         │
└────────────────────────┼───────────┼──────────────┼──────────────────────┘
                         ▼           ▼              ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                     │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Scoring Engine (MDS) — 5 weighted signals, partial data aware  │    │
│  │  Migration Analysis — bridge, liquidity, risk, competitive      │    │
│  │  Health Monitor — volume, stability, bridge, momentum           │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │CoinGecko │ │Wormhole  │ │DefiLlama │ │DexScreen │ │ Helius   │     │
│  │Market +  │ │Bridge    │ │TVL +     │ │DEX Data  │ │ Holder   │     │
│  │Social    │ │Data      │ │Yields    │ │+ Trends  │ │ Counts   │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                               │
│  │ Jupiter  │ │ deBridge │ │ Upstash  │                               │
│  │ Listing  │ │ Bridge   │ │ Redis    │                               │
│  │ Check    │ │ Data     │ │ Votes    │                               │
│  └──────────┘ └──────────┘ └──────────┘                               │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Batch Processing (5/batch, 2s delay) + TTL Cache + Health Board│    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, Tailwind CSS, Recharts, shadcn/ui, Framer Motion |
| Data Fetching | SWR (auto-refresh), server-side TTL cache |
| APIs (Free, no auth) | WormholeScan, DefiLlama, DexScreener, Jupiter, deBridge |
| APIs (Free, key required) | CoinGecko (market + social), Helius (holder counts) |
| Persistent Storage | Upstash Redis (community demand votes + onboarding analytics) |
| Monitoring | API Health Board (real-time provider status in sidebar) |
| Deployment | Vercel |

---

## Future Vision

Tideshift is designed to grow with Sunrise — not as a hackathon demo, but as permanent infrastructure.

**Current (Hackathon):**
- Dynamic demand dashboard scoring top 50 tokens from live data (8 API providers)
- Community demand voting with persistent Upstash Redis storage
- On-demand MDS scoring with real DexScreener + CoinGecko + Helius data
- Auto-generated migration proposals with bridge, liquidity, and risk analysis
- Post-migration health monitoring for 4 tokens (RENDER, HNT, POWR, GEOD)
- White-label onboarding flows with live DeFi APYs from DefiLlama

**Next (Post-Hackathon):**
- Integrate directly with Sunrise's internal pipeline via API
- On-chain demand staking — users lock tokens to signal demand (skin in the game)
- Automated onboarding flow generation — Sunrise lists a token, onboarding page spins up automatically
- Real-time bridge monitoring with alerts for abnormal activity
- Token team self-serve portal: apply, see demand score, get a readiness checklist

**Long-term:**
- Demand prediction model using historical migration data
- Cross-ecosystem partnerships: connect with token teams on other chains proactively
- RWA and institutional asset onboarding flows
- Governance integration: community votes directly influence Sunrise's migration queue

**The goal:** Every token that arrives on Solana through Sunrise comes with a data-backed demand thesis, an auto-generated migration plan, health monitoring from day one, and a ready-made path for its community to follow.

---

## How to Run

```bash
# Clone the repository
git clone https://github.com/thopatevijay/tideshift.git
cd tideshift

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys (see .env.example for required keys)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `COINGECKO_API_KEY` | Optional | Increases rate limit from 10/min to 30/min ([free key](https://www.coingecko.com/en/api)) |
| `HELIUS_API_KEY` | Optional | Real on-chain holder counts via DAS API ([free tier](https://helius.dev): 1M credits/mo) |
| `UPSTASH_REDIS_REST_URL` | Optional | Persistent community demand votes ([free tier](https://upstash.com): 10K cmds/day) |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Redis auth token for Upstash |

> **Note:** All Tier 1 APIs (WormholeScan, DefiLlama, DexScreener, Jupiter, deBridge) require no API keys. The app works without any env variables — keys unlock higher rate limits and additional features.

---

## Demo

**[Live Demo: tideshift.vercel.app](https://tideshift.vercel.app)**

The app runs entirely on live API data from 8 providers. The Discovery page surfaces ~300 tokens without Solana presence. The Dashboard dynamically scores the top 50 non-Solana tokens. API health status is visible in the sidebar.

### Key Pages

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | [/](https://tideshift.vercel.app/) | 50 dynamically scored tokens, MDS rankings, bridge outflow charts |
| Discovery | [/discovery](https://tideshift.vercel.app/discovery) | ~300 tokens, demand voting, on-demand MDS scoring, CSV export |
| Token Detail | [/tokens/tether-gold](https://tideshift.vercel.app/tokens/tether-gold) | Radar chart, signal analysis, price chart, auto-proposal builder |
| Migrations | [/migrations](https://tideshift.vercel.app/migrations) | Post-migration health monitor for RENDER, HNT, POWR, GEOD |
| Proposals | [/proposals](https://tideshift.vercel.app/proposals) | Saved migration proposals with copy/share |
| Onboarding (RENDER) | [/onboard/render](https://tideshift.vercel.app/onboard/render) | 5-step guided migration: wallet → bridge → trade → DeFi |
| Onboarding (HNT) | [/onboard/hnt](https://tideshift.vercel.app/onboard/hnt) | Same flow, Helium branding |
| Onboarding (POWR) | [/onboard/powr](https://tideshift.vercel.app/onboard/powr) | Same flow, Powerledger branding |
| Onboarding (GEOD) | [/onboard/geod](https://tideshift.vercel.app/onboard/geod) | Same flow, GEODNET branding |

---

## Team

- **Vijay Thopate** — Full-stack developer specializing in Solana, TypeScript, and DeFi applications

---

## Links

- [Live Demo](https://tideshift.vercel.app)
- [Sunrise](https://sunrisedefi.com)
- [Solana Graveyard Hackathon](https://solana.com/graveyard-hack)
- [Wormhole NTT Documentation](https://wormhole.com/docs/products/token-transfers/native-token-transfers/)

---

*Built for the Sunrise Migrations track at the Solana Graveyard Hackathon (Feb 12-27, 2026)*

# Tideshift

**Full-lifecycle infrastructure for token migrations to Solana — from demand discovery to community onboarding.**

Built for the [Sunrise](https://sunrisedefi.com) Migrations track at the [Solana Graveyard Hackathon](https://solana.com/graveyard-hack).

**[Live Demo](https://tideshift.vercel.app)** | Powered by live data from CoinGecko, WormholeScan, DefiLlama, Jupiter, and deBridge.

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

The Tideshift is two products in one, designed to serve Sunrise's migration pipeline from end to end:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SUNRISE MIGRATION LIFECYCLE                      │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────┐  │
│  │   DISCOVER   │─>│    SCORE     │─>│   MIGRATE    │─>│ ONBOARD │  │
│  │              │  │              │  │              │  │         │  │
│  │  Which tokens│  │  How strong  │  │  Sunrise     │  │ Convert │  │
│  │  lack Solana │  │  is the      │  │  handles     │  │ users   │  │
│  │  presence?   │  │  demand?     │  │  this        │  │ into    │  │
│  │              │  │              │  │              │  │ Solana  │  │
│  │  Token       │  │  MDS scoring │  │  Asset       │  │ users   │  │
│  │  Discovery   │  │  Dashboard   │  │  arrival,    │  │         │  │
│  │  (Tideshift) │  │  (Tideshift) │  │  liquidity   │  │(Tideshift)│
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────┘  │
│                                                                     │
│     YOU ARE HERE    YOU ARE HERE        SUNRISE       YOU ARE HERE   │
└─────────────────────────────────────────────────────────────────────┘
```

### Part 1: Token Discovery

Scans the top 500 tokens by market cap on CoinGecko and cross-references platform data to identify tokens without a native Solana contract address. Surfaces ~300 migration opportunities with market data, origin chains, and CoinGecko links.

- **Client-side pagination** — view 25, 50, 100, 200, or all tokens at once
- **Search and sort** — filter by token name, symbol, or chain; sort by market cap, volume, or 7d change
- **CSV export** — download the full filtered dataset with CoinGecko URLs for Sunrise BD team analysis
- **Methodology banner** — transparent explanation of filtering criteria

### Part 2: Demand Discovery Dashboard

A data-driven dashboard that surfaces which tokens Solana users want migrated — ranked, scored, and ready for Sunrise to act on.

**Data signals we aggregate:**

| Signal | Source | What it tells us |
|--------|--------|-----------------|
| Bridge outflows | Wormhole, deBridge, Mayan | Solana users leaving to buy tokens elsewhere |
| Search intent | Jupiter, Birdeye | Tokens users search for but can't find on Solana |
| Social demand | X/Twitter, Discord | Community sentiment and migration requests |
| Origin-chain metrics | CoinGecko, DefiLlama | Token health: volume, TVL, holder count, market cap |
| Ecosystem overlap | On-chain analysis | How many Solana wallets also hold the origin token |

**Each token gets a Migration Demand Score (MDS):**

```
MDS = w1(bridge_outflow_volume)
    + w2(search_intent_frequency)
    + w3(social_demand_signals)
    + w4(origin_chain_health)
    + w5(ecosystem_wallet_overlap)
```

The dashboard shows:
- **Top migration candidates** ranked by MDS
- **Demand trends** — is interest growing or fading?
- **Migration readiness** — does the token have NTT/OFT support? Active team?
- **One-click proposal** — generates a structured migration proposal for Sunrise

**Who uses this:** Sunrise team, to prioritize which tokens to bring next. Token teams, to see if demand exists before applying.

### Part 3: Community Onboarding Flow

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
│  ├── Lending (Kamino, MarginFi)                         │
│  ├── Liquidity provision (with APY estimates)           │
│  └── Staking (if applicable)                            │
│                                                         │
│  Analytics: Track conversion at each step               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key features:**
- **White-label** — customizable per token (colors, branding, messaging)
- **Origin-chain aware** — detects which chain the user is coming from
- **Progress tracking** — users see where they are in the onboarding journey
- **Analytics dashboard** — Sunrise sees conversion rates at each step (how many set up wallets, how many bridged, how many traded)
- **Shareable** — token communities can share the onboarding link on their Discord/Twitter

**Who uses this:** Token communities migrating to Solana. Sunrise team, to measure migration success.

---

## User Stories

### Sunrise Team — Finding the Next Migration

> **As a Sunrise team member**, I open the Demand Dashboard on Monday morning. The top-ranked token is ONDO (Ondo Finance) with an MDS of 87. The dashboard shows: 1,200+ Solana wallets bridged out to Ethereum last week specifically to buy ONDO, Jupiter search volume for "ONDO" spiked 4x in the past 14 days, and 340+ tweets from Solana-native accounts requesting ONDO on Solana. I click "Generate Proposal" and get a structured brief — token health metrics, community size, liquidity requirements — ready to share with the team and start the migration conversation with Ondo's team.

### Token Team — Deciding to Come to Solana

> **As a token project founder on Ethereum**, I'm considering expanding to Solana but unsure if real demand exists. Someone shares the Tideshift link. I search for my token and see a demand score of 72, with data showing 800+ Solana wallets already hold my token via wrapped bridges, and social mentions are trending up. I see a "Request Migration via Sunrise" button, click it, and get connected with the Sunrise team — with all my demand data pre-filled in the application.

### Community Member — Onboarding After Migration

> **As a HYPE holder on Hyperliquid**, I see a tweet that HYPE is now live on Solana via Sunrise. The tweet links to `tideshift.app/onboard/hype`. I land on a branded page explaining what happened. I don't have a Solana wallet, so I follow the guided Phantom setup (takes 2 minutes). Next step pre-configures the bridge — I enter the amount, approve, and my HYPE arrives on Solana in under a minute. The final step shows me where to trade (Jupiter, with a direct swap link) and where to earn yield (Kamino lending at 8.2% APY). I went from "what is Solana?" to actively using Solana DeFi in 10 minutes.

### Solana Power User — Signaling Demand

> **As an active Solana trader**, I keep bridging to Arbitrum to trade tokens that aren't on Solana yet. I visit the Demand Dashboard, see the tokens I care about ranked, and upvote the ones I want most. I can also submit a token I think is missing from the rankings. When one of my upvoted tokens finally migrates via Sunrise, I get notified and the onboarding page is ready for me to share with my community.

---

## Why This Matters for Sunrise

| Without Tideshift | With Tideshift |
|----------------|-------------|
| Manual demand discovery | Token Discovery: ~300 non-Solana tokens surfaced automatically |
| Anecdotal signals | Quantified demand with MDS scoring across 5 signal categories |
| No visibility into migration landscape | Full list of top-500 tokens without Solana CA, exportable as CSV |
| Community left to figure it out | Guided onboarding, per token |
| No post-migration metrics | Conversion analytics at every step |
| Each migration starts from scratch | Repeatable, scalable process |

Tideshift turns Sunrise's migration pipeline from a series of one-off efforts into a **systematic, measurable operation**.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                       │
│                                                                 │
│  ┌──────────────────┐ ┌──────────────┐ ┌─────────────────────┐  │
│  │ Demand Discovery │ │   Token      │ │ Community Onboarding│  │
│  │ Dashboard        │ │   Discovery  │ │ Flow (white-label)  │  │
│  │                  │ │              │ │                     │  │
│  │ - MDS scores     │ │ - Top 500   │ │ - Wallet setup      │  │
│  │ - Trend charts   │ │   scanning  │ │ - Bridge flow       │  │
│  │ - Proposal       │ │ - Non-Solana│ │ - Trading venues    │  │
│  │   builder        │ │   filtering │ │ - DeFi opportunities│  │
│  └───────┬──────────┘ └──────┬───────┘ └──────────┬──────────┘  │
│           │                │                │                    │
└───────────┼────────────────┼────────────────┼────────────────────┘
            │                │                │
┌───────────┼────────────────┼────────────────┼────────────────────┐
│           ▼                ▼                ▼                    │
│                        DATA LAYER                                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Scoring Engine (MDS)                       │    │
│  │  Aggregates signals → scores → ranks candidates        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐     │
│  │ Wormhole │ │ Jupiter  │ │ Social   │ │ On-chain       │     │
│  │ Bridge   │ │ Search   │ │ Signals  │ │ Analytics      │     │
│  │ Data     │ │ Intent   │ │ (X API)  │ │ (Helius, RPC)  │     │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           Onboarding Analytics Engine                   │    │
│  │  Tracks: wallet setup → bridge → trade → DeFi          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, Tailwind CSS, Recharts, shadcn/ui, Framer Motion |
| Data Fetching | SWR (auto-refresh), server-side TTL cache |
| APIs (Tier 1, no auth) | WormholeScan, DefiLlama, Jupiter Lite, deBridge |
| APIs (Tier 2, optional key) | CoinGecko (market data + token discovery) |
| Monitoring | API Health Board (real-time provider status in sidebar) |
| Deployment | Vercel |

---

## Future Vision

Tideshift is designed to grow with Sunrise — not as a hackathon demo, but as permanent infrastructure.

**Phase 1 (Hackathon):** Core demand dashboard + onboarding flow for 1-2 tokens

**Phase 2 (Post-Hackathon):**
- Integrate directly with Sunrise's internal pipeline
- Community voting/staking on migration candidates (users put skin in the game)
- Automated onboarding flow generation — Sunrise lists a token, onboarding page spins up automatically
- Post-migration health monitoring (liquidity depth, volume, user retention)

**Phase 3 (Long-term):**
- Demand prediction model using historical migration data
- Token team self-serve: teams apply, see their demand score, get a readiness checklist
- Cross-ecosystem partnerships: connect with token teams on other chains proactively
- RWA and institutional asset onboarding flows

**The goal:** Every token that arrives on Solana through Sunrise comes with a data-backed demand thesis and a ready-made path for its community to follow.

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

> **Note:** The app uses live API data from CoinGecko, WormholeScan, DefiLlama, Jupiter, and deBridge. No API keys are required for basic functionality — free tiers are sufficient. Add a `COINGECKO_API_KEY` in `.env` for higher rate limits.

---

## Demo

**[Live Demo: tideshift.vercel.app](https://tideshift.vercel.app)**

The app runs on live API data. The Discovery page surfaces ~300 tokens without Solana presence from the top 500 by market cap. The Dashboard scores 12 candidate tokens using real signals from 5 API providers. API health status is visible in the sidebar.

### Key Pages

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | [/](https://tideshift.vercel.app/) | Token rankings, MDS scores, bridge outflow charts, search trends |
| Discovery | [/discovery](https://tideshift.vercel.app/discovery) | ~300 tokens without Solana CA, pagination, search, CSV export |
| Token Detail | [/tokens/ondo](https://tideshift.vercel.app/tokens/ondo) | Radar chart, signal analysis, price chart, migration readiness |
| Proposals | [/proposals](https://tideshift.vercel.app/proposals) | Saved migration proposals with copy/share |
| Onboarding (HYPE) | [/onboard/hype](https://tideshift.vercel.app/onboard/hype) | 5-step guided migration: wallet → bridge → trade → DeFi |
| Onboarding (MON) | [/onboard/mon](https://tideshift.vercel.app/onboard/mon) | Same flow, different token branding |

> Demo video will be added before submission.

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

*Built for the Sunrise Migrations track at the Solana Graveyard Hackathon (Feb 12–27, 2026)*

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
- **Methodology banner** — transparent explanation of filtering criteria

### Part 2: Demand Discovery Dashboard

Dynamically scores the **top 50 non-Solana tokens** (by market cap) using 5 real-time signal categories. No hardcoded token lists — the dashboard pulls from the Discovery API and scores automatically.

**Data signals we aggregate:**

| Signal | Weight | Source | What it tells us |
|--------|--------|--------|-----------------|
| Bridge outflows | 30% | WormholeScan, deBridge | Solana users leaving to buy tokens elsewhere |
| Search intent | 25% | Jupiter | Tokens users search for but can't find on Solana |
| Social demand | 20% | CoinGecko community data | Community sentiment and migration requests |
| Origin-chain health | 15% | CoinGecko, DefiLlama | Token health: volume, TVL, holder count, market cap |
| Wallet overlap | 10% | Heuristic model | How many Solana wallets also hold the origin token |

**Key features:**
- **50 dynamically scored tokens** — refreshes from live data, cached 3 minutes
- **Demand trends** — is interest growing or fading?
- **Community demand voting** — users upvote tokens they want on Solana
- **On-demand MDS scoring** — score any Discovery token in real time from the table
- **Auto-generated proposals** — bridge recommendation, liquidity estimates, risk assessment, competitive landscape

**Who uses this:** Sunrise team, to prioritize which tokens to bring next. Token teams, to see if demand exists before applying.

### Part 3: Migration Health Monitor

Tracks post-migration health of tokens already on Solana. Completes the lifecycle: Discovery → Score → Migrate → **Monitor**.

- **Health score** (0-100): composite of volume trend, market cap stability, bridge activity, price momentum
- **30-day price sparklines** for each migrated token
- **Bridge activity tracking** from WormholeScan
- **Status badges**: healthy / moderate / concerning

Currently monitoring: HYPE, MON, LIT, INX

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

Currently live for: HYPE (Hyperliquid), MON (Monad), LIT (Lighter), INX (Infinex)

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
| No community input | Community demand voting — users upvote tokens they want |
| Manual proposal writing | Auto-generated proposals with bridge, liquidity, and risk analysis |
| No post-migration tracking | Migration Health Monitor with health scores and trend data |
| Community left to figure it out | Guided onboarding for 4 tokens (HYPE, MON, LIT, INX) |
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
│  │ ~300 tokens │ │ Top 50   │ │ HYPE,MON │ │ Auto-gen  │ │ 4 tokens │  │
│  │ Demand vote │ │ dynamic  │ │ LIT, INX │ │ bridge +  │ │ 5 steps  │  │
│  │ MDS scoring │ │ scoring  │ │ health   │ │ liquidity │ │ each     │  │
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
│  │CoinGecko │ │Wormhole  │ │DefiLlama │ │ Jupiter  │ │ deBridge │     │
│  │Market +  │ │Bridge    │ │TVL +     │ │Search    │ │Bridge    │     │
│  │Social    │ │Data      │ │Protocols │ │Intent    │ │Data      │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
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
| APIs (Tier 1, no auth) | WormholeScan, DefiLlama, Jupiter Lite, deBridge |
| APIs (Tier 2, optional key) | CoinGecko (market data + token discovery) |
| Monitoring | API Health Board (real-time provider status in sidebar) |
| Deployment | Vercel |

---

## Future Vision

Tideshift is designed to grow with Sunrise — not as a hackathon demo, but as permanent infrastructure.

**Current (Hackathon):**
- Dynamic demand dashboard scoring top 50 tokens from live data
- Community demand voting and on-demand MDS scoring
- Auto-generated migration proposals with bridge, liquidity, and risk analysis
- Post-migration health monitoring for 4 tokens
- White-label onboarding flows for 4 migrated tokens

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

> **Note:** The app uses live API data from CoinGecko, WormholeScan, DefiLlama, Jupiter, and deBridge. No API keys are required for basic functionality — free tiers are sufficient. Add a `COINGECKO_API_KEY` in `.env` for higher rate limits.

---

## Demo

**[Live Demo: tideshift.vercel.app](https://tideshift.vercel.app)**

The app runs entirely on live API data from 5 providers. The Discovery page surfaces ~300 tokens without Solana presence. The Dashboard dynamically scores the top 50 non-Solana tokens. API health status is visible in the sidebar.

### Key Pages

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | [/](https://tideshift.vercel.app/) | 50 dynamically scored tokens, MDS rankings, bridge outflow charts |
| Discovery | [/discovery](https://tideshift.vercel.app/discovery) | ~300 tokens, demand voting, on-demand MDS scoring, CSV export |
| Token Detail | [/tokens/tether-gold](https://tideshift.vercel.app/tokens/tether-gold) | Radar chart, signal analysis, price chart, auto-proposal builder |
| Migrations | [/migrations](https://tideshift.vercel.app/migrations) | Post-migration health monitor for HYPE, MON, LIT, INX |
| Proposals | [/proposals](https://tideshift.vercel.app/proposals) | Saved migration proposals with copy/share |
| Onboarding (HYPE) | [/onboard/hype](https://tideshift.vercel.app/onboard/hype) | 5-step guided migration: wallet → bridge → trade → DeFi |
| Onboarding (MON) | [/onboard/mon](https://tideshift.vercel.app/onboard/mon) | Same flow, Monad branding |
| Onboarding (LIT) | [/onboard/lit](https://tideshift.vercel.app/onboard/lit) | Same flow, Lighter branding |
| Onboarding (INX) | [/onboard/inx](https://tideshift.vercel.app/onboard/inx) | Same flow, Infinex branding |

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

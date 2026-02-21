# Sunrise Migration Toolkit

**Full-lifecycle infrastructure for token migrations to Solana — from demand discovery to community onboarding.**

Built for the [Sunrise](https://sunrisedefi.com) Migrations track at the [Solana Graveyard Hackathon](https://solana.com/graveyard-hack).

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

**Sunrise handles the hardest parts — canonical asset arrival, liquidity, and venue distribution. The Migration Toolkit handles everything around it.**

---

## Solution

The Sunrise Migration Toolkit is two products in one, designed to serve Sunrise's migration pipeline from end to end:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SUNRISE MIGRATION LIFECYCLE                      │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────────────────┐  │
│  │   DISCOVER   │───>│   MIGRATE    │───>│      ONBOARD          │  │
│  │              │    │              │    │                       │  │
│  │  Which token │    │  Sunrise     │    │  Convert origin-chain │  │
│  │  should come │    │  handles     │    │  community into       │  │
│  │  next?       │    │  this        │    │  Solana users         │  │
│  │              │    │              │    │                       │  │
│  │  Migration   │    │  Asset       │    │  Migration            │  │
│  │  Toolkit     │    │  arrival,    │    │  Toolkit              │  │
│  │  (upstream)  │    │  liquidity,  │    │  (downstream)         │  │
│  │              │    │  distribution│    │                       │  │
│  └──────────────┘    └──────────────┘    └───────────────────────┘  │
│                                                                     │
│        YOU ARE HERE          SUNRISE           YOU ARE HERE          │
└─────────────────────────────────────────────────────────────────────┘
```

### Part 1: Demand Discovery Dashboard

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

### Part 2: Community Onboarding Flow

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

## Why This Matters for Sunrise

| Without Toolkit | With Toolkit |
|----------------|-------------|
| Manual demand discovery | Data-driven candidate scoring |
| Anecdotal signals | Quantified demand with MDS |
| Community left to figure it out | Guided onboarding, per token |
| No post-migration metrics | Conversion analytics at every step |
| Each migration starts from scratch | Repeatable, scalable process |

The toolkit turns Sunrise's migration pipeline from a series of one-off efforts into a **systematic, measurable operation**.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                       │
│                                                                 │
│  ┌─────────────────────┐    ┌────────────────────────────────┐  │
│  │  Demand Discovery   │    │   Community Onboarding Flow    │  │
│  │  Dashboard          │    │   (white-label, per token)     │  │
│  │                     │    │                                │  │
│  │  - Token rankings   │    │  - Wallet setup wizard         │  │
│  │  - MDS scores       │    │  - Bridge flow (Sunrise)       │  │
│  │  - Trend charts     │    │  - Trading venue discovery     │  │
│  │  - Proposal builder │    │  - DeFi opportunities          │  │
│  └────────┬────────────┘    └──────────────┬─────────────────┘  │
│           │                                │                    │
└───────────┼────────────────────────────────┼────────────────────┘
            │                                │
┌───────────┼────────────────────────────────┼────────────────────┐
│           ▼          DATA LAYER            ▼                    │
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
| Frontend | Next.js 14, Tailwind CSS, Recharts |
| Data Fetching | SWR, server actions |
| Wallet Integration | @solana/wallet-adapter |
| Price/Market Data | Jupiter API, Birdeye API, CoinGecko |
| On-chain Data | Helius RPC, Wormhole Explorer API |
| Social Signals | X/Twitter API |
| Deployment | Vercel |

---

## Future Vision

This toolkit is designed to grow with Sunrise — not as a hackathon demo, but as permanent infrastructure.

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
git clone https://github.com/thopatevijay/sunrise-migration-toolkit.git
cd sunrise-migration-toolkit

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys (see .env.example for required keys)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## Demo

> Video walkthrough and live demo link will be added before submission.

---

## Team

- **Vijay Thopate** — Full-stack developer specializing in Solana, TypeScript, and DeFi applications

---

## Links

- [Sunrise](https://sunrisedefi.com)
- [Solana Graveyard Hackathon](https://solana.com/graveyard-hack)
- [Wormhole NTT Documentation](https://wormhole.com/docs/products/token-transfers/native-token-transfers/)

---

*Built for the Sunrise Migrations track at the Solana Graveyard Hackathon (Feb 12–27, 2026)*

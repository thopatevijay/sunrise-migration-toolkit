"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ArrowUpDown,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Star,
  Loader2,
  Zap,
  Sparkles,
  X,
} from "lucide-react";
import { TrendIndicator } from "@/components/shared/trend-indicator";
import { MdsBadge } from "@/components/shared/mds-badge";
import { formatUSD } from "@/lib/utils";
import type { DiscoveryToken } from "@/lib/types/discovery";
import {
  getUserId,
  fetchVoteCounts,
  fetchUserVotes,
  toggleVoteApi,
} from "@/lib/data/demand-votes";

type SortKey = "rank" | "marketCap" | "volume24h" | "change7d" | "demand" | "mds";
type PageSize = 25 | 50 | 100 | 200 | "all";

const PAGE_SIZES: { label: string; value: PageSize }[] = [
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
  { label: "200", value: 200 },
  { label: "All", value: "all" },
];

type MarketCapBucket = "all" | "1b" | "100m" | "10m" | "under10m";

const MCAP_BUCKETS: { label: string; value: MarketCapBucket }[] = [
  { label: "All Caps", value: "all" },
  { label: "$1B+", value: "1b" },
  { label: "$100M–$1B", value: "100m" },
  { label: "$10M–$100M", value: "10m" },
  { label: "<$10M", value: "under10m" },
];

function matchesMcapBucket(marketCap: number, bucket: MarketCapBucket): boolean {
  switch (bucket) {
    case "all": return true;
    case "1b": return marketCap >= 1_000_000_000;
    case "100m": return marketCap >= 100_000_000 && marketCap < 1_000_000_000;
    case "10m": return marketCap >= 10_000_000 && marketCap < 100_000_000;
    case "under10m": return marketCap < 10_000_000;
  }
}

interface DiscoveryTableProps {
  tokens: DiscoveryToken[];
  isLoading: boolean;
}

function downloadCSV(tokens: DiscoveryToken[]) {
  const header =
    "Rank,Symbol,Name,Market Cap,24h Volume,7d Change %,Origin Chains,Solana Status,CoinGecko ID,CoinGecko URL,Logo URL";
  const rows = tokens.map((t) =>
    [
      t.rank,
      t.symbol,
      `"${t.name.replace(/"/g, '""')}"`,
      t.marketCap,
      t.volume24h,
      t.change7d.toFixed(2),
      `"${t.originChains.join(", ")}"`,
      t.solanaStatus,
      t.coingeckoId,
      `https://www.coingecko.com/en/coins/${t.coingeckoId}`,
      t.logo,
    ].join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `no-solana-tokens-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const LOADING_STEPS = [
  { text: "Fetching top 500 tokens from CoinGecko", duration: 3000 },
  { text: "Loading platform data for chain detection", duration: 4000 },
  { text: "Cross-referencing Solana contract addresses", duration: 2000 },
  { text: "Filtering stablecoins and low-cap tokens", duration: 1500 },
  { text: "Checking Jupiter for bridged tokens", duration: 3000 },
  { text: "Building discovery table", duration: 2000 },
];

function DiscoveryLoadingState() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (stepIndex >= LOADING_STEPS.length - 1) return;
    const timer = setTimeout(
      () => setStepIndex((i) => Math.min(i + 1, LOADING_STEPS.length - 1)),
      LOADING_STEPS[stepIndex].duration
    );
    return () => clearTimeout(timer);
  }, [stepIndex]);

  const progress = Math.round(((stepIndex + 1) / LOADING_STEPS.length) * 100);

  return (
    <Card className="glass-card">
      <CardContent className="py-16 flex flex-col items-center justify-center gap-5">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-foreground">
            {LOADING_STEPS[stepIndex].text}
          </p>
          <p className="text-xs text-muted-foreground">
            Step {stepIndex + 1} of {LOADING_STEPS.length}
          </p>
        </div>
        <div className="w-64 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary/60 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function DiscoveryTable({ tokens, isLoading }: DiscoveryTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortAsc, setSortAsc] = useState(true);
  const [pageSize, setPageSize] = useState<PageSize>(50);
  const [page, setPage] = useState(1);
  const [chainFilter, setChainFilter] = useState<Set<string>>(new Set());
  const [mcapBucket, setMcapBucket] = useState<MarketCapBucket>("all");
  const [solanaFilter, setSolanaFilter] = useState<"all" | "wrapped" | "none">("all");
  const [myVotesOnly, setMyVotesOnly] = useState(false);

  // Extract unique chains sorted by frequency (most common first)
  const availableChains = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of tokens) {
      for (const c of t.originChains) {
        counts.set(c, (counts.get(c) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([chain, count]) => ({ chain, count }));
  }, [tokens]);

  const handleChainToggle = useCallback((chain: string) => {
    setChainFilter((prev) => {
      const next = new Set(prev);
      if (next.has(chain)) next.delete(chain);
      else next.add(chain);
      return next;
    });
    setPage(1);
  }, []);

  // Demand vote state — backed by Upstash Redis via API
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [votingId, setVotingId] = useState<string | null>(null);

  useEffect(() => {
    const userId = getUserId();
    Promise.all([fetchVoteCounts(), fetchUserVotes(userId)]).then(
      ([counts, votes]) => {
        setVoteCounts(counts);
        setUserVotes(votes);
      }
    );
  }, []);

  const handleVote = useCallback(async (e: React.MouseEvent, coingeckoId: string) => {
    e.stopPropagation();
    if (votingId) return;
    setVotingId(coingeckoId);

    // Optimistic update
    const wasVoted = userVotes.has(coingeckoId);
    const optimisticCount = (voteCounts[coingeckoId] ?? 0) + (wasVoted ? -1 : 1);
    setVoteCounts((prev) => ({ ...prev, [coingeckoId]: Math.max(0, optimisticCount) }));
    setUserVotes((prev) => {
      const next = new Set(prev);
      if (wasVoted) next.delete(coingeckoId);
      else next.add(coingeckoId);
      return next;
    });

    try {
      const result = await toggleVoteApi(coingeckoId, getUserId());
      setVoteCounts((prev) => ({ ...prev, [coingeckoId]: result.count }));
      setUserVotes((prev) => {
        const next = new Set(prev);
        if (result.voted) next.add(coingeckoId);
        else next.delete(coingeckoId);
        return next;
      });
    } catch {
      // Revert optimistic update on error
      setVoteCounts((prev) => ({ ...prev, [coingeckoId]: (voteCounts[coingeckoId] ?? 0) }));
      setUserVotes((prev) => {
        const next = new Set(prev);
        if (wasVoted) next.add(coingeckoId);
        else next.delete(coingeckoId);
        return next;
      });
    } finally {
      setVotingId(null);
    }
  }, [votingId, userVotes, voteCounts]);

  // On-demand MDS scoring state
  const [scores, setScores] = useState<Record<string, number>>({});
  const [scoringIds, setScoringIds] = useState<Set<string>>(new Set());

  // AI quick summary state
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [summaryLoadingIds, setSummaryLoadingIds] = useState<Set<string>>(new Set());
  const [activeSummaryId, setActiveSummaryId] = useState<string | null>(null);

  const handleSummary = useCallback(async (e: React.MouseEvent, coingeckoId: string) => {
    e.stopPropagation();

    // If already loaded, just toggle visibility
    if (summaries[coingeckoId]) {
      setActiveSummaryId((prev) => (prev === coingeckoId ? null : coingeckoId));
      return;
    }

    if (summaryLoadingIds.has(coingeckoId)) return;

    setSummaryLoadingIds((prev) => {
      const next = new Set(prev);
      next.add(coingeckoId);
      return next;
    });
    setActiveSummaryId(coingeckoId);

    try {
      const res = await fetch("/api/ai/quick-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coingeckoId }),
      });
      if (res.ok) {
        const data = await res.json();
        setSummaries((prev) => ({ ...prev, [coingeckoId]: data.summary }));
      }
    } catch {
      // silently fail
    } finally {
      setSummaryLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(coingeckoId);
        return next;
      });
    }
  }, [summaries, summaryLoadingIds]);

  const handleScore = useCallback(async (e: React.MouseEvent, token: DiscoveryToken) => {
    e.stopPropagation();
    if (scoringIds.has(token.coingeckoId) || scores[token.coingeckoId] !== undefined) return;

    setScoringIds((prev) => {
      const next = new Set(prev);
      next.add(token.coingeckoId);
      return next;
    });

    try {
      const res = await fetch("/api/tokens/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coingeckoId: token.coingeckoId,
          symbol: token.symbol,
          name: token.name,
          originChain: token.originChains[0],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setScores((prev) => ({ ...prev, [token.coingeckoId]: data.mds.totalScore }));
      }
    } catch {
      // silently fail — button stays available for retry
    } finally {
      setScoringIds((prev) => {
        const next = new Set(prev);
        next.delete(token.coingeckoId);
        return next;
      });
    }
  }, [scoringIds, scores]);

  const filtered = useMemo(() => {
    let result = [...tokens];

    // Chain filter
    if (chainFilter.size > 0) {
      result = result.filter((t) =>
        t.originChains.some((c) => chainFilter.has(c))
      );
    }

    // Market cap filter
    if (mcapBucket !== "all") {
      result = result.filter((t) => matchesMcapBucket(t.marketCap, mcapBucket));
    }

    // Solana status filter
    if (solanaFilter !== "all") {
      result = result.filter((t) => t.solanaStatus === solanaFilter);
    }

    // My votes filter
    if (myVotesOnly) {
      result = result.filter((t) => userVotes.has(t.coingeckoId));
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.symbol.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q) ||
          t.originChains.some((c) => c.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortKey === "demand") {
        const aVal = voteCounts[a.coingeckoId] ?? 0;
        const bVal = voteCounts[b.coingeckoId] ?? 0;
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      if (sortKey === "mds") {
        const aVal = scores[a.coingeckoId] ?? -1;
        const bVal = scores[b.coingeckoId] ?? -1;
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      return sortAsc
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return result;
  }, [tokens, search, chainFilter, mcapBucket, solanaFilter, myVotesOnly, sortKey, sortAsc, voteCounts, userVotes, scores]);

  // Pagination
  const effectivePageSize = pageSize === "all" ? filtered.length : pageSize;
  const totalPages = Math.max(1, Math.ceil(filtered.length / effectivePageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * effectivePageSize;
  const paged = filtered.slice(startIdx, startIdx + effectivePageSize);

  // Reset to page 1 when search or page size changes
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handlePageSize = useCallback((value: PageSize) => {
    setPageSize(value);
    setPage(1);
  }, []);

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortAsc(!sortAsc);
      } else {
        setSortKey(key);
        setSortAsc(key === "rank");
      }
      setPage(1);
    },
    [sortKey, sortAsc]
  );

  const SortableHeader = ({
    label,
    sortKeyName,
  }: {
    label: string;
    sortKeyName: SortKey;
  }) => (
    <button
      onClick={() => handleSort(sortKeyName)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  if (isLoading) {
    return <DiscoveryLoadingState />;
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">
            No-Solana Tokens ({filtered.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Page size selector */}
            <div className="flex items-center h-9 rounded-md border border-white/10 bg-white/5 overflow-hidden">
              {PAGE_SIZES.map((ps) => (
                <button
                  key={ps.label}
                  onClick={() => handlePageSize(ps.value)}
                  className={`px-2.5 h-full text-xs transition-colors ${
                    pageSize === ps.value
                      ? "bg-white/15 text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {ps.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search tokens or chains..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 h-9 w-52 bg-white/5 border-white/10 text-sm"
              />
            </div>
            <button
              onClick={() => downloadCSV(filtered)}
              className="flex items-center gap-1.5 h-9 px-3 rounded-md bg-white/5 border border-white/10 text-sm text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              title="Download CSV"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chain filter pills */}
        {availableChains.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pb-4 mb-4 border-b border-white/5">
            <button
              onClick={() => { setChainFilter(new Set()); setPage(1); }}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                chainFilter.size === 0
                  ? "bg-white/15 text-foreground font-medium border border-white/20"
                  : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 border border-transparent"
              }`}
            >
              All Chains
            </button>
            {availableChains.map(({ chain, count }) => (
              <button
                key={chain}
                onClick={() => handleChainToggle(chain)}
                className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                  chainFilter.has(chain)
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 font-medium"
                    : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 border border-transparent"
                }`}
              >
                {chain} <span className="text-[10px] opacity-60">{count}</span>
              </button>
            ))}
          </div>
        )}
        {/* Market cap + My Votes filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 pb-4 mb-4 border-b border-white/5">
          {MCAP_BUCKETS.map((b) => (
            <button
              key={b.value}
              onClick={() => { setMcapBucket(b.value); setPage(1); }}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                mcapBucket === b.value
                  ? "bg-white/15 text-foreground font-medium border border-white/20"
                  : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 border border-transparent"
              }`}
            >
              {b.label}
            </button>
          ))}
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button
            onClick={() => { setMyVotesOnly((v) => !v); setPage(1); }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-colors ${
              myVotesOnly
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 font-medium"
                : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 border border-transparent"
            }`}
          >
            <Star className={`h-3 w-3 ${myVotesOnly ? "fill-purple-400" : ""}`} />
            My Votes{userVotes.size > 0 && ` (${userVotes.size})`}
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          {(["all", "wrapped", "none"] as const).map((status) => (
            <button
              key={status}
              onClick={() => { setSolanaFilter(status); setPage(1); }}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                solanaFilter === status
                  ? status === "wrapped"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium"
                    : "bg-white/15 text-foreground font-medium border border-white/20"
                  : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 border border-transparent"
              }`}
            >
              {status === "all" ? "All" : status === "wrapped" ? "Bridged" : "Not on Solana"}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="w-12 text-xs">
                  <SortableHeader label="#" sortKeyName="rank" />
                </TableHead>
                <TableHead className="text-xs">Token</TableHead>
                <TableHead className="text-xs">
                  <SortableHeader label="Market Cap" sortKeyName="marketCap" />
                </TableHead>
                <TableHead className="text-xs hidden md:table-cell">
                  <SortableHeader label="24h Vol." sortKeyName="volume24h" />
                </TableHead>
                <TableHead className="text-xs">
                  <SortableHeader label="7d" sortKeyName="change7d" />
                </TableHead>
                <TableHead className="text-xs">
                  <SortableHeader label="Demand" sortKeyName="demand" />
                </TableHead>
                <TableHead className="text-xs">
                  <SortableHeader label="MDS" sortKeyName="mds" />
                </TableHead>
                <TableHead className="text-xs">AI</TableHead>
                <TableHead className="text-xs hidden lg:table-cell">
                  Chains
                </TableHead>
                <TableHead className="text-xs hidden md:table-cell">
                  Solana
                </TableHead>
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((token) => (
                <TableRow
                  key={token.coingeckoId}
                  className="border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  onClick={() =>
                    window.open(
                      `https://www.coingecko.com/en/coins/${token.coingeckoId}`,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {token.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      {token.logo ? (
                        <Image
                          src={token.logo}
                          alt={token.symbol}
                          width={28}
                          height={28}
                          className="h-7 w-7 rounded-full"
                          unoptimized
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                          {token.symbol.slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{token.symbol}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                          {token.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatUSD(token.marketCap)}
                  </TableCell>
                  <TableCell className="font-mono text-sm hidden md:table-cell">
                    {formatUSD(token.volume24h)}
                  </TableCell>
                  <TableCell>
                    <TrendIndicator value={token.change7d} />
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={(e) => handleVote(e, token.coingeckoId)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${
                        userVotes.has(token.coingeckoId)
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-transparent"
                      }`}
                    >
                      <ChevronUp className={`h-3.5 w-3.5 ${userVotes.has(token.coingeckoId) ? "text-purple-400" : ""}`} />
                      <span className="font-mono">{voteCounts[token.coingeckoId] ?? 0}</span>
                    </button>
                  </TableCell>
                  <TableCell>
                    {scores[token.coingeckoId] !== undefined ? (
                      <MdsBadge score={scores[token.coingeckoId]} size="sm" />
                    ) : (
                      <button
                        onClick={(e) => handleScore(e, token)}
                        disabled={scoringIds.has(token.coingeckoId)}
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-white/10 transition-colors disabled:opacity-50"
                      >
                        {scoringIds.has(token.coingeckoId) ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Zap className="h-3 w-3" />
                        )}
                        <span>{scoringIds.has(token.coingeckoId) ? "Scoring..." : "Score"}</span>
                      </button>
                    )}
                  </TableCell>
                  <TableCell className="relative">
                    <button
                      onClick={(e) => handleSummary(e, token.coingeckoId)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${
                        activeSummaryId === token.coingeckoId && summaries[token.coingeckoId]
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-white/10"
                      }`}
                    >
                      {summaryLoadingIds.has(token.coingeckoId) ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Sparkles className="h-3 w-3" />
                      )}
                    </button>
                    {activeSummaryId === token.coingeckoId && (summaries[token.coingeckoId] || summaryLoadingIds.has(token.coingeckoId)) && (
                      <div
                        className="absolute z-50 top-full left-0 mt-1 w-[280px] rounded-lg border border-white/10 bg-background shadow-xl p-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-medium text-purple-400 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> AI Summary
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setActiveSummaryId(null); }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        {summaryLoadingIds.has(token.coingeckoId) ? (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Analyzing {token.symbol}...
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {summaries[token.coingeckoId]}
                          </p>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {token.originChains.slice(0, 3).map((chain) => (
                        <span
                          key={chain}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground"
                        >
                          {chain}
                        </span>
                      ))}
                      {token.originChains.length > 3 && (
                        <span className="text-[10px] text-muted-foreground/60">
                          +{token.originChains.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {token.solanaStatus === "wrapped" ? (
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`https://orbmarkets.io/token/${token.solanaMint}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-block"
                          title="View on Orb Markets"
                        >
                          <Badge
                            variant="outline"
                            className="text-[10px] border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                          >
                            Bridged ↗
                          </Badge>
                        </a>
                        {token.solanaLiquidity ? (
                          <a
                            href={`https://jup.ag/tokens/${token.solanaMint}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] text-amber-400/70 hover:text-amber-400 transition-colors"
                            title="View on Jupiter"
                          >
                            {formatUSD(token.solanaLiquidity)} ↗
                          </a>
                        ) : null}
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[10px] border-red-500/30 text-red-400"
                      >
                        Not on Solana
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="w-8 pr-4">
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
            <p className="text-xs text-muted-foreground">
              Showing {startIdx + 1}–{Math.min(startIdx + effectivePageSize, filtered.length)} of{" "}
              {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="flex items-center justify-center h-8 w-8 rounded-md border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 min-w-[2rem] px-2 rounded-md text-xs transition-colors ${
                    p === safePage
                      ? "bg-white/15 text-foreground font-medium border border-white/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="flex items-center justify-center h-8 w-8 rounded-md border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

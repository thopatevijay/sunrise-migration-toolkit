"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  ArrowUpDown,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Loader2,
  Zap,
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

export function DiscoveryTable({ tokens, isLoading }: DiscoveryTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortAsc, setSortAsc] = useState(true);
  const [pageSize, setPageSize] = useState<PageSize>(50);
  const [page, setPage] = useState(1);

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
  }, [tokens, search, sortKey, sortAsc, voteCounts, scores]);

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
    return (
      <Card className="glass-card">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
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
                        <img
                          src={token.logo}
                          alt={token.symbol}
                          className="h-7 w-7 rounded-full"
                          loading="lazy"
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
                    <Badge
                      variant="outline"
                      className="text-[10px] border-red-500/30 text-red-400"
                    >
                      No Solana
                    </Badge>
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

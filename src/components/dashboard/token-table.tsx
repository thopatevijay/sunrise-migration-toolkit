"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ArrowUpDown } from "lucide-react";
import { MdsBadge } from "@/components/shared/mds-badge";
import { ChainBadge } from "@/components/shared/chain-badge";
import { TrendIndicator } from "@/components/shared/trend-indicator";
import { Sparkline } from "./sparkline";
import { formatUSD } from "@/lib/utils";
import { CHAINS } from "@/lib/config/chains";
import type { TokenWithScore } from "@/lib/data";
import type { ChainId } from "@/lib/config/tokens";

type SortKey = "mds" | "bridgeVolume" | "marketCap" | "change7d" | "searchTrend";

interface TokenTableProps {
  tokens: TokenWithScore[];
  isLoading: boolean;
}

export function TokenTable({ tokens, isLoading }: TokenTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [chainFilter, setChainFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("mds");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let result = [...tokens];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.symbol.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q)
      );
    }

    if (chainFilter !== "all") {
      result = result.filter((t) => t.originChain === chainFilter);
    }

    result.sort((a, b) => {
      let aVal: number, bVal: number;
      switch (sortKey) {
        case "mds":
          aVal = a.mds.totalScore;
          bVal = b.mds.totalScore;
          break;
        case "bridgeVolume":
          aVal = a.bridgeVolume7d;
          bVal = b.bridgeVolume7d;
          break;
        case "marketCap":
          aVal = a.marketCap;
          bVal = b.marketCap;
          break;
        case "change7d":
          aVal = a.change7d;
          bVal = b.change7d;
          break;
        case "searchTrend":
          aVal = a.searchTrend;
          bVal = b.searchTrend;
          break;
      }
      return sortAsc ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [tokens, search, chainFilter, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const uniqueChains = useMemo(() => {
    const chains = new Set(tokens.map((t) => t.originChain));
    return Array.from(chains);
  }, [tokens]);

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
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
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
            Migration Candidates ({filtered.length})
          </CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search tokens..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 w-44 bg-white/5 border-white/10 text-sm"
              />
            </div>
            <Select value={chainFilter} onValueChange={setChainFilter}>
              <SelectTrigger className="h-9 w-36 bg-white/5 border-white/10 text-sm">
                <SelectValue placeholder="All chains" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chains</SelectItem>
                {uniqueChains.map((chain) => (
                  <SelectItem key={chain} value={chain}>
                    {CHAINS[chain as ChainId]?.name ?? chain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="w-12 text-xs">#</TableHead>
                <TableHead className="text-xs">Token</TableHead>
                <TableHead className="text-xs">
                  <SortableHeader label="MDS" sortKeyName="mds" />
                </TableHead>
                <TableHead className="text-xs">
                  <SortableHeader label="Bridge Vol." sortKeyName="bridgeVolume" />
                </TableHead>
                <TableHead className="text-xs hidden md:table-cell">
                  <SortableHeader label="Market Cap" sortKeyName="marketCap" />
                </TableHead>
                <TableHead className="text-xs hidden lg:table-cell">Search</TableHead>
                <TableHead className="text-xs">
                  <SortableHeader label="7d" sortKeyName="change7d" />
                </TableHead>
                <TableHead className="text-xs hidden md:table-cell">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((token, index) => (
                <TableRow
                  key={token.id}
                  onClick={() => router.push(`/tokens/${token.id}`)}
                  className="cursor-pointer border-white/5 hover:bg-white/[0.03] transition-colors"
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                        {token.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{token.symbol}</p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">
                            {token.name}
                          </span>
                          <ChainBadge chainId={token.originChain} size="sm" />
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <MdsBadge score={token.mds.totalScore} size="sm" />
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatUSD(token.bridgeVolume7d)}
                  </TableCell>
                  <TableCell className="font-mono text-sm hidden md:table-cell">
                    {formatUSD(token.marketCap)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Sparkline
                      data={Array.from({ length: 14 }, (_, i) =>
                        Math.round(
                          (token.mds.breakdown.searchIntent.normalized / 100) *
                            (80 + Math.sin(i * 1.2) * 20)
                        )
                      )}
                      color={
                        token.searchTrend > 0 ? "#34d399" : "#f87171"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TrendIndicator value={token.change7d} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span
                      className={`text-xs font-medium ${
                        token.mds.trend === "rising"
                          ? "text-emerald-400"
                          : token.mds.trend === "falling"
                            ? "text-red-400"
                            : "text-muted-foreground"
                      }`}
                    >
                      {token.mds.trend === "rising"
                        ? "Rising"
                        : token.mds.trend === "falling"
                          ? "Falling"
                          : "Stable"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

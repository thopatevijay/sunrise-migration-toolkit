"use client";

import { useState, useMemo, useCallback } from "react";
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
import { Search, ArrowUpDown, Download } from "lucide-react";
import { TrendIndicator } from "@/components/shared/trend-indicator";
import { formatUSD } from "@/lib/utils";
import type { DiscoveryToken } from "@/lib/types/discovery";

type SortKey = "rank" | "marketCap" | "volume24h" | "change7d";

interface DiscoveryTableProps {
  tokens: DiscoveryToken[];
  isLoading: boolean;
}

function downloadCSV(tokens: DiscoveryToken[]) {
  const header =
    "Rank,Symbol,Name,Market Cap,24h Volume,7d Change %,Origin Chains,Solana Status,CoinGecko ID,Logo URL";
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
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return result;
  }, [tokens, search, sortKey, sortAsc]);

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortAsc(!sortAsc);
      } else {
        setSortKey(key);
        setSortAsc(key === "rank");
      }
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
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search tokens or chains..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                <TableHead className="text-xs hidden lg:table-cell">
                  Chains
                </TableHead>
                <TableHead className="text-xs hidden md:table-cell">
                  Solana
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((token) => (
                <TableRow
                  key={token.coingeckoId}
                  className="border-white/5 hover:bg-white/[0.03] transition-colors"
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

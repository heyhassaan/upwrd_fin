import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, TrendingUp, TrendingDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Stock } from "@/data/stocks";
import { StockCard } from "./StockCard";
import { Link } from "react-router-dom";

type SortOption = "symbol" | "price" | "change" | "volume";
type FilterOption = "all" | "gainers" | "losers";

interface StockListProps {
  stocks: Stock[];
  isLive?: boolean;
  lastUpdated?: Date | null;
}

export const StockList = ({ stocks, isLive, lastUpdated }: StockListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("symbol");
  const [filter, setFilter] = useState<FilterOption>("all");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search popup on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredAndSortedStocks = useMemo(() => {
    let result = [...stocks];

    if (filter === "gainers") result = result.filter((s) => s.change > 0);
    else if (filter === "losers") result = result.filter((s) => s.change < 0);

    result.sort((a, b) => {
      switch (sortBy) {
        case "symbol": return a.symbol.localeCompare(b.symbol);
        case "price": return b.price - a.price;
        case "change": return b.changePercent - a.changePercent;
        case "volume": return parseFloat(b.volume) - parseFloat(a.volume);
        default: return 0;
      }
    });

    return result;
  }, [stocks, sortBy, filter]);

  // Search results (all stocks)
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return stocks
      .filter(
        (s) =>
          s.symbol.toLowerCase().includes(query) ||
          s.name.toLowerCase().includes(query) ||
          s.sector.toLowerCase().includes(query)
      )
      .slice(0, 8);
  }, [stocks, searchQuery]);

  // Show only 12 on homepage
  const displayStocks = filteredAndSortedStocks.slice(0, 12);

  const gainersCount = stocks.filter((s) => s.change > 0).length;
  const losersCount = stocks.filter((s) => s.change < 0).length;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
        >
          <div>
            <h2 className="text-2xl font-bold">PSX Stocks</h2>
            <p className="text-muted-foreground">
              {stocks.length} stocks • {gainersCount} gainers • {losersCount} losers
              <span className={`ml-2 inline-flex items-center gap-1 text-xs ${isLive ? "text-gain" : "text-primary"}`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLive ? "bg-gain" : "bg-primary"}`} />
                {isLive ? "Live PSX Data" : "Simulated"}
              </span>
              {lastUpdated && (
                <span className="ml-2 text-xs text-muted-foreground">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>

          {/* Search with popup */}
          <div className="relative w-full md:w-80" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search all stocks..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              className="pl-10 bg-secondary border-border"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setShowSearchResults(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Search Results Popup */}
            <AnimatePresence>
              {showSearchResults && searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden max-h-[420px] overflow-y-auto"
                >
                  {searchResults.length > 0 ? (
                    searchResults.map((stock) => {
                      const isPositive = stock.change >= 0;
                      return (
                        <Link
                          key={stock.symbol}
                          to={`/stock/${stock.symbol}`}
                          onClick={() => setShowSearchResults(false)}
                          className="flex items-center justify-between px-4 py-3 hover:bg-secondary/60 transition-colors border-b border-border/30 last:border-0"
                        >
                          <div>
                            <span className="font-semibold text-foreground">{stock.symbol}</span>
                            <span className="text-xs text-muted-foreground ml-2">{stock.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">
                              PKR {stock.price.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                            </span>
                            <span
                              className={`ml-2 text-xs font-medium ${isPositive ? "text-gain" : "text-loss"}`}
                            >
                              {isPositive ? "+" : ""}
                              {stock.changePercent.toFixed(2)}%
                            </span>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="px-4 py-6 text-center text-muted-foreground text-sm">
                      No stocks found for "{searchQuery}"
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <div className="flex items-center gap-2">
            <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} className="text-xs">
              All Stocks
            </Button>
            <Button size="sm" variant={filter === "gainers" ? "default" : "outline"} onClick={() => setFilter("gainers")} className="text-xs">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />Gainers
            </Button>
            <Button size="sm" variant={filter === "losers" ? "default" : "outline"} onClick={() => setFilter("losers")} className="text-xs">
              <TrendingDown className="w-3.5 h-3.5 mr-1" />Losers
            </Button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-secondary border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="symbol">Symbol</option>
              <option value="price">Price</option>
              <option value="change">% Change</option>
              <option value="volume">Volume</option>
            </select>
          </div>
        </motion.div>

        {/* Stock Grid - Only 12 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayStocks.map((stock, index) => (
            <StockCard key={stock.symbol} stock={stock} index={index} />
          ))}
        </div>

        {filteredAndSortedStocks.length > 12 && (
          <div className="text-center mt-8 text-muted-foreground text-sm">
            Showing 12 of {filteredAndSortedStocks.length} stocks — use search to find any stock
          </div>
        )}
      </div>
    </section>
  );
};

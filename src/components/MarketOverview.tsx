import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Clock, Wifi, WifiOff } from "lucide-react";
import { marketIndices, getMarketStatus } from "@/data/stocks";
import { MarketIndex } from "@/hooks/use-live-prices";

interface MarketOverviewProps {
  liveIndices?: MarketIndex[];
  isLive?: boolean;
  lastUpdated?: Date | null;
}

export const MarketOverview = ({
  liveIndices,
  isLive = false,
  lastUpdated,
}: MarketOverviewProps) => {
  const marketStatus = getMarketStatus();

  // Use live indices if available, otherwise fall back to hardcoded
  const indices: MarketIndex[] =
    liveIndices && liveIndices.length > 0
      ? liveIndices
      : [
          { name: "KSE-100", ...marketIndices.kse100 },
          { name: "KSE-30", ...marketIndices.kse30 },
          { name: "KMI-30", ...marketIndices.kmi30 },
        ];

  const timeString = lastUpdated
    ? lastUpdated.toLocaleTimeString("en-PK")
    : new Date().toLocaleTimeString("en-PK");

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Market Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                marketStatus.isOpen ? "market-open" : "market-closed"
              }`}
            />
            <span className="text-lg font-semibold">{marketStatus.message}</span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" />
              PSX: 9:30 AM - 3:30 PM PKT
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isLive ? (
              <Wifi className="w-4 h-4 text-gain" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
            <span>{isLive ? "Live" : "Delayed"} · {timeString}</span>
          </div>
        </motion.div>

        {/* Indices Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {indices.map((index, i) => (
            <motion.div
              key={index.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="stock-card rounded-xl p-5 border border-border/50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {index.name}
                  </h3>
                  <p className="text-2xl font-bold mt-1">
                    {index.value.toLocaleString("en-PK", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium ${
                    index.change >= 0
                      ? "bg-gain/10 text-gain"
                      : "bg-loss/10 text-loss"
                  }`}
                >
                  {index.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {index.change >= 0 ? "+" : ""}
                    {index.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {index.change >= 0 ? "+" : ""}
                {index.change.toLocaleString("en-PK", {
                  minimumFractionDigits: 2,
                })}{" "}
                pts
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

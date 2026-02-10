import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Clock,
  BarChart3,
  DollarSign,
  Activity,
  Calendar,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StockChart } from "@/components/StockChart";
import { pxsStocks, getMarketStatus } from "@/data/stocks";
import { Button } from "@/components/ui/button";
import { useLivePrices } from "@/hooks/use-live-prices";

type Period = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

const PERIOD_POINTS: Record<Period, number> = {
  "1D": 12,
  "1W": 20,
  "1M": 30,
  "3M": 60,
  "1Y": 120,
  "ALL": 200,
};

const generatePeriodData = (basePrice: number, change: number, points: number): number[] => {
  const isPositive = change >= 0;
  const data: number[] = [];
  let price = basePrice * (isPositive ? 0.92 : 1.08);
  for (let i = 0; i < points - 1; i++) {
    const volatility = 0.015 * (points > 60 ? 1.5 : 1);
    const delta = (Math.random() - 0.45) * basePrice * volatility;
    price += isPositive ? Math.abs(delta) * 0.25 : -Math.abs(delta) * 0.25;
    price = Math.max(0.01, price);
    data.push(parseFloat(price.toFixed(2)));
  }
  data.push(basePrice);
  return data;
};

const StockDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { stocks } = useLivePrices();
  const marketStatus = getMarketStatus();
  const [period, setPeriod] = useState<Period>("1M");

  // Always look up from static mock data first (instant, never null for valid symbols),
  // then overlay with live data when available
  const staticStock = useMemo(
    () => pxsStocks.find((s) => s.symbol === symbol),
    [symbol]
  );
  const liveStock = useMemo(
    () => stocks.find((s) => s.symbol === symbol),
    [stocks, symbol]
  );
  const stock = liveStock || staticStock;

  const chartData = useMemo(() => {
    if (!stock) return [];
    const points = PERIOD_POINTS[period];
    if (period === "1D") {
      const base = stock.chartData;
      if (base.length >= points) return base.slice(-points);
      return generatePeriodData(stock.price, stock.change, points);
    }
    return generatePeriodData(stock.price, stock.change, points);
  }, [stock, period]);

  if (!stock) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Stock not found</h1>
            <p className="text-muted-foreground mb-6">
              Could not find stock with symbol "{symbol}"
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Markets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isPositive = stock.change >= 0;

  const stats = [
    { label: "Open", value: (stock.price - stock.change).toFixed(2), icon: Clock },
    { label: "High", value: (stock.price * 1.02).toFixed(2), icon: TrendingUp },
    { label: "Low", value: (stock.price * 0.98).toFixed(2), icon: TrendingDown },
    { label: "Volume", value: stock.volume, icon: BarChart3 },
    { label: "Market Cap", value: stock.marketCap, icon: DollarSign },
    { label: "52W High", value: stock.high52w.toFixed(2), icon: Activity },
    { label: "52W Low", value: stock.low52w.toFixed(2), icon: Activity },
    { label: "Sector", value: stock.sector, icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Markets
            </Link>
          </motion.div>

          {/* Stock Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{stock.symbol}</h1>
                <span className="px-3 py-1 rounded-full bg-secondary text-sm text-muted-foreground">
                  {stock.sector}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${marketStatus.isOpen ? "market-open" : "market-closed"}`}
                  />
                  <span className="text-xs text-muted-foreground">{marketStatus.message}</span>
                </div>
              </div>
              <p className="text-lg text-muted-foreground">{stock.name}</p>
            </div>

            <div className="flex flex-col items-start lg:items-end">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl md:text-5xl font-bold">
                  PKR {stock.price.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                </span>
                <div
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-lg font-semibold ${
                    isPositive ? "bg-gain/10 text-gain" : "bg-loss/10 text-loss"
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  <span>
                    {isPositive ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
              <span className={`text-lg mt-1 ${isPositive ? "text-gain" : "text-loss"}`}>
                {isPositive ? "+" : ""}
                {stock.change.toFixed(2)} today
              </span>
            </div>
          </motion.div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="stock-card rounded-2xl p-6 border border-border/50 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Price Chart</h2>
              <div className="flex items-center gap-2">
                {(["1D", "1W", "1M", "3M", "1Y", "ALL"] as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      period === p
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <StockChart data={chartData} isPositive={isPositive} height={350} />
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="stock-card rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <stat.icon className="w-4 h-4" />
                  <span className="text-sm">{stat.label}</span>
                </div>
                <p className="text-lg font-semibold">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StockDetail;

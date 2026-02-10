import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Stock } from "@/data/stocks";
import { MiniChart } from "./MiniChart";

interface StockCardProps {
  stock: Stock;
  index: number;
}

export const StockCard = ({ stock, index }: StockCardProps) => {
  const isPositive = stock.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/stock/${stock.symbol}`}>
        <div className="stock-card rounded-xl p-5 border border-border/50 cursor-pointer group">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                  {stock.symbol}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                  {stock.sector}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                {stock.name}
              </p>
            </div>
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium ${
                isPositive
                  ? "bg-gain/10 text-gain"
                  : "bg-loss/10 text-loss"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {stock.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">
                PKR {stock.price.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
              </p>
              <p
                className={`text-sm mt-1 ${
                  isPositive ? "text-gain" : "text-loss"
                }`}
              >
                {isPositive ? "+" : ""}
                {stock.change.toFixed(2)}
              </p>
            </div>
            <MiniChart data={stock.chartData} isPositive={isPositive} />
          </div>

          <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
            <span>Vol: {stock.volume}</span>
            <span>MCap: {stock.marketCap}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

import { useState, useEffect, useCallback, useRef } from "react";
import { Stock, pxsStocks } from "@/data/stocks";
import { fetchPsxMarketData } from "@/lib/psx-api";

// Fetches real PSX data, merges with mock data so no stock goes missing
export const useLivePrices = () => {
  const [stocks, setStocks] = useState<Stock[]>(() => [...pxsStocks]);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const isMounted = useRef(true);

  // Fetch real data from PSX and merge with mock
  const fetchLive = useCallback(async () => {
    try {
      const liveData = await fetchPsxMarketData();
      if (liveData && liveData.length > 0 && isMounted.current) {
        const liveMap = new Map(liveData.map((s) => [s.symbol, s]));
        const mockMap = new Map(pxsStocks.map((s) => [s.symbol, s]));

        // Update mock stocks with live data where available
        const merged: Stock[] = pxsStocks.map((mock) => {
          const live = liveMap.get(mock.symbol);
          if (live) {
            return {
              ...live,
              name: mock.name, // keep human-readable name
              marketCap: mock.marketCap,
              high52w: live.high52w,
              low52w: live.low52w,
            };
          }
          return mock; // keep mock if no live match
        });

        // Add any live stocks not in mock data
        liveData.forEach((live) => {
          if (!mockMap.has(live.symbol)) {
            merged.push(live);
          }
        });

        setStocks(merged);
        setIsLive(true);
        setLastUpdated(new Date());
      }
    } catch {
      console.log("Using simulated data");
    }
  }, []);

  // Simulated tick for smooth animation
  const simulateTick = useCallback(() => {
    setStocks((prev) =>
      prev.map((stock) => {
        const changePercent = (Math.random() - 0.48) * 1.5;
        const priceChange = stock.price * (changePercent / 100);
        const newPrice = Math.max(0.01, stock.price + priceChange);
        const newChange = newPrice - (stock.price - stock.change);
        const newChangePercent = (newChange / (newPrice - newChange)) * 100;
        const newChartData = [...stock.chartData.slice(1), newPrice];

        return {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(newChange.toFixed(2)),
          changePercent: parseFloat(newChangePercent.toFixed(2)),
          chartData: newChartData,
        };
      })
    );
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchLive();
    const liveInterval = setInterval(fetchLive, 30000);
    const tickInterval = setInterval(simulateTick, 3000);

    return () => {
      isMounted.current = false;
      clearInterval(liveInterval);
      clearInterval(tickInterval);
    };
  }, [fetchLive, simulateTick]);

  return { stocks, isLive, lastUpdated };
};

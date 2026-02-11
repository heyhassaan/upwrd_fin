import { useState, useEffect, useCallback, useRef } from "react";
import { Stock, pxsStocks } from "@/data/stocks";
import {
  fetchAllTicks,
  fetchIndices,
  createPsxWebSocket,
  PsxTickData,
} from "@/lib/psx-terminal-api";

// Sector map for PSX Terminal API responses
const sectorMap: Record<string, string> = {
  "OIL AND GAS EXPLORATION COMPANIES": "Energy",
  "OIL AND GAS MARKETING COMPANIES": "Energy",
  "REFINERY": "Energy",
  "POWER GENERATION & DISTRIBUTION": "Power",
  "COMMERCIAL BANKS": "Banking",
  "CEMENT": "Cement",
  "FERTILIZER": "Fertilizer",
  "TECHNOLOGY & COMMUNICATION": "Technology",
  "AUTOMOBILE ASSEMBLER": "Automobile",
  "AUTOMOBILE PARTS & ACCESSORIES": "Automobile",
  "TEXTILE COMPOSITE": "Textile",
  "TEXTILE SPINNING": "Textile",
  "PHARMACEUTICAL": "Pharma",
  "CHEMICAL": "Chemicals",
  "FOOD & PERSONAL CARE PRODUCTS": "Food",
  "SUGAR & ALLIED INDUSTRIES": "Food",
  "ENGINEERING": "Steel",
  "INSURANCE": "Insurance",
  "TRANSPORT": "Transport",
  "TOBACCO": "Consumer",
  "PAPER & BOARD": "Paper",
  "GLASS & CERAMICS": "Glass",
  "MISCELLANEOUS": "Other",
  "CABLE & ELECTRICAL GOODS": "Electronics",
};

function resolveSector(raw: string, fallback: string): string {
  if (!raw) return fallback || "Other";
  const upper = raw.toUpperCase().trim();
  return sectorMap[upper] || fallback || "Other";
}

const formatVolume = (vol: number): string => {
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(1)}M`;
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)}K`;
  return vol.toString();
};

function generateChartFromPrice(price: number, change: number): number[] {
  const isPositive = change >= 0;
  const data: number[] = [];
  let p = price - change;
  for (let i = 0; i < 10; i++) {
    const delta = (Math.random() - 0.5) * price * 0.01;
    p += isPositive ? Math.abs(delta) * 0.3 : -Math.abs(delta) * 0.3;
    data.push(p);
  }
  data.push(price);
  return data;
}

function tickToStock(tick: PsxTickData, existing?: Stock): Stock {
  const price = tick.price;
  const change = tick.change;
  const changePercent =
    tick.changePercent || (tick.open > 0 ? (change / tick.open) * 100 : 0);

  const chartData: number[] = existing?.chartData
    ? [...existing.chartData.slice(1), price]
    : generateChartFromPrice(price, change);

  return {
    symbol: tick.symbol,
    name: existing?.name || tick.name || tick.symbol,
    price,
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    volume: formatVolume(tick.volume || 0),
    marketCap: existing?.marketCap || "-",
    high52w: tick.high > 0 ? tick.high : existing?.high52w || price * 1.15,
    low52w: tick.low > 0 ? tick.low : existing?.low52w || price * 0.85,
    sector: resolveSector(tick.sector || "", existing?.sector || "Other"),
    chartData,
  };
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export const useLivePrices = () => {
  const [stocks, setStocks] = useState<Stock[]>(() => [...pxsStocks]);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const isMounted = useRef(true);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch stocks via REST API
  const fetchLive = useCallback(async () => {
    try {
      const ticks = await fetchAllTicks();

      if (ticks.length > 0 && isMounted.current) {
        const tickMap = new Map(ticks.map((t) => [t.symbol, t]));
        const mockMap = new Map(pxsStocks.map((s) => [s.symbol, s]));

        // Merge: update existing mock stocks with live data
        const merged: Stock[] = pxsStocks.map((mock) => {
          const live = tickMap.get(mock.symbol);
          if (live && live.price > 0) {
            return tickToStock(live, mock);
          }
          return mock;
        });

        // Add new live stocks not in mock list
        ticks.forEach((tick) => {
          if (
            !mockMap.has(tick.symbol) &&
            tick.price > 0 &&
            tick.symbol.length <= 8
          ) {
            merged.push(tickToStock(tick));
          }
        });

        setStocks(merged);
        setIsLive(true);
        setLastUpdated(new Date());
      }
    } catch {
      console.log("PSX Terminal API unavailable, using fallback data");
    }
  }, []);

  // Fetch index data via REST API
  const fetchLiveIndices = useCallback(async () => {
    try {
      const idxData = await fetchIndices();

      if (idxData.length > 0 && isMounted.current) {
        const mapped = idxData.map((idx) => {
          let name = idx.symbol;
          const sym = name.toUpperCase();
          if (sym.includes("100")) name = "KSE-100";
          else if (sym.includes("KSE") && sym.includes("30")) name = "KSE-30";
          else if (sym.includes("KMI")) name = "KMI-30";
          else if (sym.includes("ALLSHR")) name = "KSE All Share";

          return {
            name,
            value: idx.current,
            change: idx.change,
            changePercent: idx.changePercent,
          };
        });

        setIndices(mapped);
      }
    } catch {
      console.log("Failed to fetch index data");
    }
  }, []);

  // Connect WebSocket for real-time streaming
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = createPsxWebSocket(
      // Stock tick updates
      (ticks) => {
        if (!isMounted.current) return;
        setStocks((prev) => {
          const updated = [...prev];
          for (const tick of ticks) {
            if (tick.price <= 0) continue;
            const idx = updated.findIndex((s) => s.symbol === tick.symbol);
            if (idx >= 0) {
              updated[idx] = tickToStock(tick, updated[idx]);
            }
          }
          return updated;
        });
        setLastUpdated(new Date());
      },
      // Index updates
      (idxTicks) => {
        if (!isMounted.current) return;
        setIndices((prev) => {
          const updated = [...prev];
          for (const idx of idxTicks) {
            const sym = idx.symbol.toUpperCase();
            const i = updated.findIndex((p) =>
              sym.includes("100")
                ? p.name === "KSE-100"
                : sym.includes("KSE") && sym.includes("30")
                ? p.name === "KSE-30"
                : sym.includes("KMI")
                ? p.name === "KMI-30"
                : false
            );
            if (i >= 0) {
              updated[i] = {
                ...updated[i],
                value: idx.current,
                change: idx.change,
                changePercent: idx.changePercent,
              };
            }
          }
          return updated;
        });
      }
    );

    if (ws) {
      wsRef.current = ws;
      ws.onclose = () => {
        wsRef.current = null;
        // Auto-reconnect after 5s
        if (isMounted.current) {
          setTimeout(connectWebSocket, 5000);
        }
      };
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;

    // Initial REST fetch
    fetchLive();
    fetchLiveIndices();

    // Try real-time WebSocket
    connectWebSocket();

    // Fallback poll every 30s if WebSocket isn't connected
    const pollInterval = setInterval(() => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        fetchLive();
        fetchLiveIndices();
      }
    }, 30000);

    return () => {
      isMounted.current = false;
      clearInterval(pollInterval);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [fetchLive, fetchLiveIndices, connectWebSocket]);

  return { stocks, indices, isLive, lastUpdated };
};

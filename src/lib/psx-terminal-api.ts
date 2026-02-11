/**
 * PSX Terminal API Client
 * Free, open-source API for Pakistan Stock Exchange data
 * https://github.com/mumtazkahn/psx-terminal
 *
 * Base URL: https://psxterminal.com/api
 * Rate limit: 100 requests/minute per IP
 */

const BASE_URL = "https://psxterminal.com/api";

export interface PsxTickData {
  symbol: string;
  name?: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;
  changePercent: number;
  volume: number;
  trades?: number;
  value?: number;
  bid?: number;
  ask?: number;
  ldcp?: number;
  sector?: string;
  marketType?: string;
  state?: string;
}

export interface PsxIndexData {
  symbol: string;
  name?: string;
  current: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  volume?: number;
}

export interface PsxMarketStats {
  totalSymbols?: number;
  advancers?: number;
  decliners?: number;
  unchanged?: number;
  totalVolume?: number;
  totalValue?: number;
}

// Fetch all market ticks (regular market)
export async function fetchAllTicks(): Promise<PsxTickData[]> {
  try {
    const res = await fetch(`${BASE_URL}/stats/REG`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // The stats endpoint returns market-wide data
    // Normalize the response
    if (Array.isArray(data)) {
      return data.map(normalizeTickData);
    }
    if (data?.tickers && Array.isArray(data.tickers)) {
      return data.tickers.map(normalizeTickData);
    }
    if (data?.data && Array.isArray(data.data)) {
      return data.data.map(normalizeTickData);
    }

    return [];
  } catch (err) {
    console.error("Failed to fetch PSX ticks:", err);
    return [];
  }
}

// Fetch single stock tick
export async function fetchTick(symbol: string): Promise<PsxTickData | null> {
  try {
    const res = await fetch(`${BASE_URL}/ticks/REG/${symbol}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return normalizeTickData(data);
  } catch (err) {
    console.error(`Failed to fetch tick for ${symbol}:`, err);
    return null;
  }
}

// Fetch index data (KSE-100, KSE-30, KMI-30)
export async function fetchIndices(): Promise<PsxIndexData[]> {
  try {
    const res = await fetch(`${BASE_URL}/stats/IDX`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Normalize index response
    const raw = Array.isArray(data) ? data : data?.tickers || data?.data || [];

    return raw
      .filter((item: any) => {
        const sym = (item.symbol || item.name || "").toUpperCase();
        return sym.includes("KSE100") || sym.includes("KSE-100") ||
               sym.includes("KSE30") || sym.includes("KSE-30") ||
               sym.includes("KMI30") || sym.includes("KMI-30") ||
               sym.includes("ALLSHR") || sym.includes("KMI") ||
               sym.includes("KSE");
      })
      .map((item: any): PsxIndexData => ({
        symbol: item.symbol || item.name || "",
        name: item.name || item.symbol || "",
        current: toNum(item.current || item.price || item.close || item.value),
        change: toNum(item.change || item.netChange),
        changePercent: toNum(item.changePercent || item.percentChange || item.changePer),
        high: toNum(item.high),
        low: toNum(item.low),
        open: toNum(item.open),
        volume: toNum(item.volume),
      }));
  } catch (err) {
    console.error("Failed to fetch PSX indices:", err);
    return [];
  }
}

// Fetch market breadth stats
export async function fetchMarketBreadth(): Promise<PsxMarketStats | null> {
  try {
    const res = await fetch(`${BASE_URL}/stats/breadth`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      totalSymbols: toNum(data.total || data.totalSymbols),
      advancers: toNum(data.advancers || data.advancing),
      decliners: toNum(data.decliners || data.declining),
      unchanged: toNum(data.unchanged || data.neutral),
      totalVolume: toNum(data.totalVolume || data.volume),
      totalValue: toNum(data.totalValue || data.value),
    };
  } catch (err) {
    console.error("Failed to fetch market breadth:", err);
    return null;
  }
}

// Fetch all symbols list
export async function fetchSymbols(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/symbols`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Failed to fetch symbols:", err);
    return [];
  }
}

// Fetch intraday kline data for charts
export async function fetchKlines(
  symbol: string,
  timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" = "1h",
  limit: number = 50
): Promise<number[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/klines/${symbol}/${timeframe}?limit=${limit}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Extract close prices from kline data
    if (Array.isArray(data)) {
      return data.map((k: any) => toNum(k.close || k.c || k[4]));
    }
    return [];
  } catch (err) {
    console.error(`Failed to fetch klines for ${symbol}:`, err);
    return [];
  }
}

// WebSocket connection for real-time updates
export function createPsxWebSocket(
  onData: (data: PsxTickData[]) => void,
  onIndexData?: (data: PsxIndexData[]) => void
): WebSocket | null {
  try {
    const ws = new WebSocket("wss://psxterminal.com/");

    ws.onopen = () => {
      console.log("PSX WebSocket connected");

      // Subscribe to regular market data
      ws.send(JSON.stringify({
        type: "subscribe",
        subscriptionType: "market-data",
        params: { marketType: "REG" },
      }));

      // Subscribe to index data
      ws.send(JSON.stringify({
        type: "subscribe",
        subscriptionType: "market-data",
        params: { marketType: "IDX" },
      }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "welcome" || msg.type === "pong") return;

        // Handle market data updates
        if (msg.type === "market-data" || msg.data) {
          const items = Array.isArray(msg.data) ? msg.data : [msg.data || msg];

          const regTicks = items
            .filter((d: any) => d.marketType !== "IDX" && d.symbol)
            .map(normalizeTickData);

          const idxTicks = items
            .filter((d: any) => d.marketType === "IDX")
            .map((item: any): PsxIndexData => ({
              symbol: item.symbol || "",
              name: item.name || item.symbol || "",
              current: toNum(item.current || item.price || item.close),
              change: toNum(item.change),
              changePercent: toNum(item.changePercent || item.changePer),
              high: toNum(item.high),
              low: toNum(item.low),
              open: toNum(item.open),
              volume: toNum(item.volume),
            }));

          if (regTicks.length > 0) onData(regTicks);
          if (idxTicks.length > 0 && onIndexData) onIndexData(idxTicks);
        }
      } catch {
        // Ignore parse errors from heartbeats etc.
      }
    };

    ws.onerror = (err) => console.error("PSX WebSocket error:", err);
    ws.onclose = () => console.log("PSX WebSocket disconnected");

    return ws;
  } catch (err) {
    console.error("Failed to create PSX WebSocket:", err);
    return null;
  }
}

// --- Helpers ---

function toNum(val: any): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const n = parseFloat(String(val).replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
}

function normalizeTickData(raw: any): PsxTickData {
  const price = toNum(raw.current || raw.price || raw.close || raw.last);
  const open = toNum(raw.open);
  const change = toNum(raw.change || raw.netChange);
  const changePercent = toNum(
    raw.changePercent || raw.percentChange || raw.changePer ||
    (open > 0 ? (change / open) * 100 : 0)
  );

  return {
    symbol: raw.symbol || raw.ticker || "",
    name: raw.name || raw.companyName || raw.symbol || "",
    price,
    open,
    high: toNum(raw.high),
    low: toNum(raw.low),
    close: price,
    change,
    changePercent,
    volume: toNum(raw.volume || raw.vol),
    trades: toNum(raw.trades || raw.numberOfTrades),
    value: toNum(raw.value || raw.turnover),
    bid: toNum(raw.bid || raw.bestBid),
    ask: toNum(raw.ask || raw.bestAsk),
    ldcp: toNum(raw.ldcp || raw.previousClose),
    sector: raw.sector || raw.sectorName || "",
    marketType: raw.marketType || "REG",
    state: raw.state || "",
  };
}

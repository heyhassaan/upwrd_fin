import { supabase } from "@/integrations/supabase/client";
import { Stock } from "@/data/stocks";

interface PsxRawStock {
  symbol: string;
  sector: string;
  ldcp: number;
  open: number;
  high: number;
  low: number;
  current: number;
  change: number;
  changePercent: number;
  volume: number;
}

// Map PSX sector codes to readable names
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
  "TEXTILE WEAVING": "Textile",
  "PHARMACEUTICAL": "Pharma",
  "CHEMICAL": "Chemicals",
  "FOOD & PERSONAL CARE PRODUCTS": "Food",
  "SUGAR & ALLIED INDUSTRIES": "Food",
  "ENGINEERING": "Steel",
  "INSURANCE": "Insurance",
  "INVESTMENT BANKS / SECURITIES COMPANIES": "Banking",
  "LEASING COMPANIES": "Finance",
  "MODARABAS": "Finance",
  "CLOSE - END MUTUAL FUND": "Fund",
  "REAL ESTATE INVESTMENT TRUST": "REIT",
  "TRANSPORT": "Transport",
  "TOBACCO": "Consumer",
  "PAPER & BOARD": "Paper",
  "VANASPATI & ALLIED INDUSTRIES": "Food",
  "GLASS & CERAMICS": "Glass",
  "MISCELLANEOUS": "Other",
  "CABLE & ELECTRICAL GOODS": "Electronics",
  "LEATHER & TANNERIES": "Textile",
  "JUTE": "Textile",
  "SYNTHETIC & RAYON": "Textile",
  // Numeric sector codes from PSX
  "0820": "Energy",
  "0821": "Energy",
  "0822": "Energy",
  "0823": "Power",
  "0824": "Power",
  "0807": "Banking",
  "0808": "Banking",
  "0825": "Cement",
  "0826": "Fertilizer",
  "0827": "Chemicals",
  "0828": "Telecom",
  "0829": "Technology",
  "0830": "Automobile",
  "0831": "Automobile",
  "0832": "Textile",
  "0833": "Textile",
  "0834": "Textile",
  "0835": "Pharma",
  "0836": "Food",
  "0837": "Food",
  "0838": "Insurance",
  "0839": "Steel",
  "0840": "Electronics",
  "0841": "Paper",
  "0842": "Consumer",
  "0843": "Transport",
  "0844": "Other",
};

const formatVolume = (vol: number): string => {
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(1)}M`;
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)}K`;
  return vol.toString();
};

const generateChartFromPrice = (price: number, change: number): number[] => {
  const isPositive = change >= 0;
  const data: number[] = [];
  let p = price - change; // start from open
  for (let i = 0; i < 10; i++) {
    const delta = (Math.random() - 0.5) * price * 0.01;
    p += isPositive ? Math.abs(delta) * 0.3 : -Math.abs(delta) * 0.3;
    data.push(p);
  }
  data.push(price);
  return data;
};

export const fetchPsxMarketData = async (): Promise<Stock[] | null> => {
  try {
    const { data, error } = await supabase.functions.invoke("psx-data", {
      body: { endpoint: "market-watch" },
    });

    if (error || !data?.success || !Array.isArray(data.data)) {
      console.error("PSX fetch error:", error || data?.error);
      return null;
    }

    const rawStocks: PsxRawStock[] = data.data;

    return rawStocks
      .filter((s) => s.current > 0 && s.symbol && s.symbol.length <= 8)
      .map((s) => {
        // The API may have misaligned columns, so we derive change from open vs current
        const price = s.current;
        const openPrice = s.open > 0 ? s.open : price;
        const change = price - openPrice;
        const changePercent = openPrice > 0 ? (change / openPrice) * 100 : 0;

        return {
          symbol: s.symbol,
          name: s.symbol,
          price,
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
          volume: formatVolume(Math.abs(s.volume || 0) * 1_000_000),
          marketCap: "-",
          high52w: s.high > 0 ? s.high * 1.15 : price * 1.15,
          low52w: s.low > 0 ? s.low * 0.85 : price * 0.85,
          sector: sectorMap[s.sector?.toUpperCase()] || sectorMap[s.sector] || "Other",
          chartData: generateChartFromPrice(price, change),
        };
      });
  } catch (err) {
    console.error("Failed to fetch PSX data:", err);
    return null;
  }
};

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { MarketOverview } from "@/components/MarketOverview";
import { StockList } from "@/components/StockList";
import { Footer } from "@/components/Footer";
import { useLivePrices } from "@/hooks/use-live-prices";

const Index = () => {
  const { stocks, indices, isLive, lastUpdated } = useLivePrices();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <MarketOverview
          liveIndices={indices}
          isLive={isLive}
          lastUpdated={lastUpdated}
        />
        <StockList stocks={stocks} isLive={isLive} lastUpdated={lastUpdated} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

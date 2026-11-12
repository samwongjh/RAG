import React from 'react';
import { MarketProvider, useMarket } from './context/MarketContext';
import { TickerTape } from './components/TickerTape';
import { Navbar } from './components/Navbar';
import { MarketCategoryTabs } from './components/MarketCategoryTabs';
import { HeroIndices } from './components/HeroIndices';
import { MarketMovers } from './components/MarketMovers';
import { SectorBarometer } from './components/SectorBarometer';
import { NewsAndCalendar } from './components/NewsAndCalendar';
import { CategoryViews } from './components/CategoryViews';
import { ChartModal } from './components/ChartModal';
import { SearchModal } from './components/SearchModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { Footer } from './components/Footer';

const MarketContent: React.FC = () => {
  const { activeTab } = useMarket();

  return (
    <div className="min-h-screen flex flex-col bg-[#131722] dark:bg-[#131722] text-[#d1d4dc] transition-colors">
      {/* 1. Global Live Ticker Marquee */}
      <TickerTape />

      {/* 2. Top Navigation Bar */}
      <Navbar />

      {/* 3. Sticky Subnavigation Category Tabs */}
      <MarketCategoryTabs />

      {/* 4. Main Viewport Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 pb-12">
        {activeTab === 'overview' ? (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Major Benchmarks Cards with interactive mini charts */}
            <HeroIndices />

            {/* S&P 500 Sector Capital Rotation */}
            <SectorBarometer />

            {/* Market Movers: Gainers, Losers, High Volume */}
            <MarketMovers />

            {/* Live Financial News & Economic Calendar */}
            <NewsAndCalendar />
          </div>
        ) : (
          <CategoryViews />
        )}
      </main>

      {/* 5. Clean Compliant Footer */}
      <Footer />

      {/* 6. Overlays & Modals */}
      <ChartModal />
      <SearchModal />
      <WatchlistDrawer />
    </div>
  );
};

export default function App() {
  return (
    <MarketProvider>
      <MarketContent />
    </MarketProvider>
  );
}

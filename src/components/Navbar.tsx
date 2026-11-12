import React from 'react';
import { useMarket, MarketTab } from '../context/MarketContext';
import { 
  Search, 
  Sun, 
  Moon, 
  Bookmark, 
  Radio, 
  Globe2,
  TrendingUp,
  BarChart3,
  Flame,
  Filter
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsSearchOpen, 
    theme, 
    toggleTheme, 
    watchlist, 
    setIsWatchlistOpen,
    isLiveStreaming,
    setIsLiveStreaming,
    currency,
    setCurrency
  } = useMarket();

  const navTabs: { id: MarketTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'heatmap', label: 'Heatmap' },
    { id: 'screener', label: 'Screener' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-[#131722] dark:bg-[#131722] border-b border-[#2a2e39] transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            {/* TradingView signature geometric icon */}
            <div className="w-8 h-8 rounded-lg bg-[#2962ff] flex items-center justify-center text-white shadow-sm shadow-[#2962ff]/30 group-hover:scale-105 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 14.5L9.5 9L14 13.5L20 7.5V11.5H22V4H14.5V6H18.5L13.5 11L9 6.5L2 13.5V14.5H4Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base md:text-lg tracking-tight text-[#f0f3fa] whitespace-nowrap">
                TradingView <span className="text-[#2962ff] font-bold">Markets</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Concise Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#2962ff] bg-[#2962ff]/10 font-semibold'
                    : 'text-[#d1d4dc] hover:text-[#f0f3fa] hover:bg-[#1e222d]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#1e222d] hover:bg-[#2a2e39] border border-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc] rounded-lg text-xs transition-colors cursor-pointer"
            title="Search symbols (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-[#787b86]" />
            <span className="hidden sm:inline">Search market...</span>
            <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] font-mono bg-[#131722] border border-[#363a45] rounded text-[#787b86]">
              ⌘K
            </kbd>
          </button>

          {/* Live Stream Simulation status toggle */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              isLiveStreaming
                ? 'bg-[#089981]/10 border-[#089981]/30 text-[#089981]'
                : 'bg-[#1e222d] border-[#2a2e39] text-[#787b86]'
            }`}
            title={isLiveStreaming ? 'Live price stream active (click to pause)' : 'Price stream paused (click to resume)'}
          >
            <Radio className={`w-3 h-3 ${isLiveStreaming ? 'animate-pulse' : ''}`} />
            <span className="hidden md:inline">{isLiveStreaming ? 'Live' : 'Paused'}</span>
          </button>

          {/* Currency Switcher */}
          <div className="hidden sm:flex items-center border border-[#2a2e39] rounded-lg bg-[#1e222d] p-0.5 text-xs text-[#787b86]">
            {(['USD', 'EUR'] as const).map(c => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                  currency === c ? 'bg-[#2962ff] text-white' : 'hover:text-[#d1d4dc]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Watchlist Drawer Trigger */}
          <button
            onClick={() => setIsWatchlistOpen(true)}
            className="relative flex items-center justify-center p-2 rounded-lg bg-[#1e222d] hover:bg-[#2a2e39] text-[#d1d4dc] border border-[#2a2e39] transition-colors cursor-pointer"
            title="Open Watchlist"
          >
            <Bookmark className="w-4 h-4 text-[#2962ff]" />
            {watchlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2962ff] text-white text-[10px] font-bold flex items-center justify-center">
                {watchlist.length}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-[#1e222d] hover:bg-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc] border border-[#2a2e39] transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile subnav scrollable bar */}
      <div className="flex lg:hidden overflow-x-auto no-scrollbar border-t border-[#2a2e39] px-4 py-2 gap-2 bg-[#131722]">
        {navTabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#2962ff] text-white font-semibold'
                  : 'text-[#787b86] hover:text-[#d1d4dc] bg-[#1e222d]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

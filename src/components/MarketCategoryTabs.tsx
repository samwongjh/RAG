import React from 'react';
import { useMarket, MarketTab } from '../context/MarketContext';
import { 
  Compass, 
  TrendingUp, 
  Bitcoin, 
  DollarSign, 
  BarChart, 
  Layers, 
  SlidersHorizontal,
  Fuel,
  Landmark
} from 'lucide-react';

export const MarketCategoryTabs: React.FC = () => {
  const { activeTab, setActiveTab } = useMarket();

  const tabs: { id: MarketTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Markets Overview', icon: <Compass className="w-4 h-4" /> },
    { id: 'stocks', label: 'Stocks & Equities', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'crypto', label: 'Cryptocurrency', icon: <Bitcoin className="w-4 h-4" /> },
    { id: 'forex', label: 'Currencies (FX)', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'indices', label: 'Global Indices', icon: <BarChart className="w-4 h-4" /> },
    { id: 'futures', label: 'Commodities', icon: <Fuel className="w-4 h-4" /> },
    { id: 'bonds', label: 'Bonds & Rates', icon: <Landmark className="w-4 h-4" /> },
    { id: 'heatmap', label: 'Market Heatmap', icon: <Layers className="w-4 h-4" /> },
    { id: 'screener', label: 'Screener', icon: <SlidersHorizontal className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full bg-[#131722] border-b border-[#2a2e39] mb-8 sticky top-14 z-20 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-2">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2962ff] text-white shadow-sm shadow-[#2962ff]/25'
                    : 'text-[#787b86] hover:text-[#f0f3fa] hover:bg-[#1e222d]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

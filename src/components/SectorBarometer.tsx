import React from 'react';
import { SECTORS_DATA } from '../data/marketData';
import { useMarket } from '../context/MarketContext';
import { TrendingUp, TrendingDown, Layers } from 'lucide-react';

export const SectorBarometer: React.FC = () => {
  const { setActiveTab } = useMarket();

  return (
    <section className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 sm:p-5 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#2962ff]" />
          <div>
            <h3 className="text-base font-bold text-[#f0f3fa]">S&P 500 Sector Performance</h3>
            <p className="text-xs text-[#787b86]">Capital rotation across the 11 primary economic sectors</p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('heatmap')}
          className="text-xs font-semibold text-[#2962ff] hover:underline self-start sm:self-auto cursor-pointer"
        >
          View Sector Heatmap →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {SECTORS_DATA.map(sec => {
          const isPositive = sec.changePercent >= 0;
          return (
            <div
              key={sec.id}
              onClick={() => setActiveTab('heatmap')}
              className="bg-[#131722] hover:bg-[#252a36] border border-[#2a2e39] p-3 rounded-lg transition-colors cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-bold text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors truncate max-w-[170px]">
                  {sec.name}
                </span>
                <span className={`flex items-center text-xs font-bold tabular-nums ${isPositive ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                  {isPositive ? '+' : ''}{sec.changePercent.toFixed(2)}%
                </span>
              </div>

              {/* Bar visualization */}
              <div className="w-full bg-[#1e222d] h-1.5 rounded-full overflow-hidden mb-2 relative">
                <div
                  className={`h-full rounded-full ${isPositive ? 'bg-[#089981]' : 'bg-[#f23645]'}`}
                  style={{ width: `${Math.min(Math.abs(sec.changePercent) * 35, 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-[#787b86] tabular-nums">
                <span>Leader: <span className="text-[#d1d4dc] font-medium">{sec.topStock}</span></span>
                <span>Wgt: {sec.weight}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

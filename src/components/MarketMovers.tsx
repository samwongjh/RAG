import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { MarketAsset } from '../types/market';
import { Bookmark, Star, TrendingUp, TrendingDown, ChevronRight, BarChart2 } from 'lucide-react';

type MoverCategory = 'gainers' | 'losers' | 'mostActive' | 'crypto' | 'all';

export const MarketMovers: React.FC = () => {
  const { assets, setSelectedAsset, watchlist, toggleWatchlist, lastTickDirections } = useMarket();
  const [activeCategory, setActiveCategory] = useState<MoverCategory>('gainers');

  // Filter assets based on category
  const filteredAssets = (() => {
    switch (activeCategory) {
      case 'gainers':
        return [...assets].sort((a, b) => b.changePercent - a.changePercent).slice(0, 10);
      case 'losers':
        return [...assets].sort((a, b) => a.changePercent - b.changePercent).slice(0, 10);
      case 'mostActive':
        return [...assets]
          .filter(a => a.volume24h.includes('M') || a.volume24h.includes('B'))
          .sort((a, b) => {
            const getVal = (v: string) => {
              const num = parseFloat(v.replace(/[^0-9.]/g, '')) || 0;
              return v.includes('B') ? num * 1000 : num;
            };
            return getVal(b.volume24h) - getVal(a.volume24h);
          })
          .slice(0, 10);
      case 'crypto':
        return assets.filter(a => a.category === 'crypto');
      case 'all':
      default:
        return assets.slice(0, 12);
    }
  })();

  const renderSparkline = (data: number[], isPositive: boolean) => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 64;
    const height = 22;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const strokeColor = isPositive ? '#089981' : '#f23645';

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (price >= 1) {
      return price.toFixed(2);
    }
    return price.toFixed(4);
  };

  const getRatingBadge = (rating: MarketAsset['technicalRating']) => {
    switch (rating) {
      case 'Strong Buy':
        return <span className="text-[11px] font-semibold text-[#089981] bg-[#089981]/15 px-2 py-0.5 rounded">Strong Buy</span>;
      case 'Buy':
        return <span className="text-[11px] font-medium text-[#22ab94] bg-[#22ab94]/10 px-2 py-0.5 rounded">Buy</span>;
      case 'Neutral':
        return <span className="text-[11px] font-medium text-[#787b86] bg-[#787b86]/10 px-2 py-0.5 rounded">Neutral</span>;
      case 'Sell':
        return <span className="text-[11px] font-medium text-[#f23645] bg-[#f23645]/10 px-2 py-0.5 rounded">Sell</span>;
      case 'Strong Sell':
        return <span className="text-[11px] font-semibold text-[#f23645] bg-[#f23645]/20 px-2 py-0.5 rounded">Strong Sell</span>;
    }
  };

  return (
    <div className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden mb-8">
      {/* Header and Filter Tabs */}
      <div className="p-4 sm:p-5 border-b border-[#2a2e39] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#f0f3fa]">Market Movers & Activity</h3>
          <p className="text-xs text-[#787b86]">Top movers ranked by percentage change, volume velocity and institutional interest</p>
        </div>

        {/* Segmented Category Filter */}
        <div className="flex items-center gap-1 bg-[#131722] p-1 rounded-lg overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'gainers', label: 'Top Gainers' },
              { id: 'losers', label: 'Top Losers' },
              { id: 'mostActive', label: 'Most Active' },
              { id: 'crypto', label: 'Crypto Movers' },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-[#2962ff] text-white shadow-sm'
                  : 'text-[#787b86] hover:text-[#d1d4dc]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#2a2e39] text-[#787b86] font-medium uppercase tracking-wider text-[11px] bg-[#1a1e28]">
              <th className="py-3 px-4 w-10 text-center"></th>
              <th className="py-3 px-4">Symbol / Name</th>
              <th className="py-3 px-4 text-right">Price</th>
              <th className="py-3 px-4 text-right">Change</th>
              <th className="py-3 px-4 text-right">% Change</th>
              <th className="py-3 px-4 text-center">Trend (1D)</th>
              <th className="py-3 px-4 text-right hidden sm:table-cell">24h Volume</th>
              <th className="py-3 px-4 text-right hidden md:table-cell">Market Cap</th>
              <th className="py-3 px-4 text-center hidden lg:table-cell">Technical</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2e39]/50">
            {filteredAssets.map(asset => {
              const isPositive = asset.changePercent >= 0;
              const isWatchlisted = watchlist.includes(asset.symbol);
              const tickDir = lastTickDirections[asset.symbol];

              return (
                <tr
                  key={asset.symbol}
                  onClick={() => setSelectedAsset(asset)}
                  className={`hover:bg-[#252a36] transition-colors cursor-pointer group ${
                    tickDir === 'up' ? 'animate-tick-up' : tickDir === 'down' ? 'animate-tick-down' : ''
                  }`}
                >
                  {/* Star / Watchlist Toggle */}
                  <td className="py-3 px-3 text-center" onClick={(e) => { e.stopPropagation(); toggleWatchlist(asset.symbol); }}>
                    <button
                      className="text-[#787b86] hover:text-[#f59e0b] transition-colors p-1 rounded"
                      title={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-[#f59e0b] text-[#f59e0b]' : ''}`} />
                    </button>
                  </td>

                  {/* Symbol & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-[11px] text-[#f0f3fa] shrink-0">
                        {asset.symbol.substring(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors text-sm">
                            {asset.symbol}
                          </span>
                          <span className="text-[10px] text-[#787b86] font-mono uppercase">
                            {asset.exchange}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#787b86] truncate max-w-[140px] sm:max-w-[200px]">
                          {asset.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 text-right tabular-nums font-semibold text-sm text-[#f0f3fa]">
                    {formatPrice(asset.price)}
                  </td>

                  {/* Change $ */}
                  <td className={`py-3 px-4 text-right tabular-nums font-medium ${isPositive ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                    {isPositive ? '+' : ''}{asset.change > 0 && asset.price > 100 ? asset.change.toFixed(2) : asset.change.toFixed(4)}
                  </td>

                  {/* % Change */}
                  <td className="py-3 px-4 text-right tabular-nums">
                    <span className={`inline-flex items-center gap-0.5 font-bold px-2 py-0.5 rounded text-xs ${
                      isPositive 
                        ? 'text-[#089981] bg-[#089981]/15' 
                        : 'text-[#f23645] bg-[#f23645]/15'
                    }`}>
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </span>
                  </td>

                  {/* Sparkline */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center">
                      {renderSparkline(asset.sparkline, isPositive)}
                    </div>
                  </td>

                  {/* Volume */}
                  <td className="py-3 px-4 text-right tabular-nums text-[#d1d4dc] hidden sm:table-cell">
                    {asset.volume24h}
                  </td>

                  {/* Market Cap */}
                  <td className="py-3 px-4 text-right tabular-nums text-[#787b86] hidden md:table-cell">
                    {asset.marketCap || '-'}
                  </td>

                  {/* Technical Rating */}
                  <td className="py-3 px-4 text-center hidden lg:table-cell">
                    {getRatingBadge(asset.technicalRating)}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedAsset(asset)}
                      className="px-2.5 py-1 text-xs font-medium text-[#2962ff] hover:bg-[#2962ff]/15 rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Chart</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

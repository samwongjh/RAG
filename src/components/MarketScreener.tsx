import React, { useState, useMemo } from 'react';
import { useMarket } from '../context/MarketContext';
import { MarketAsset, AssetCategory } from '../types/market';
import { Search, ArrowUpDown, Star, ChevronDown, Check, SlidersHorizontal, BarChart2 } from 'lucide-react';

type SortField = 'symbol' | 'price' | 'changePercent' | 'volume24h' | 'technicalScore';

export const MarketScreener: React.FC = () => {
  const { assets, setSelectedAsset, watchlist, toggleWatchlist, lastTickDirections } = useMarket();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [performanceFilter, setPerformanceFilter] = useState<'all' | 'gainers' | 'losers' | 'bullish'>('all');
  const [sortField, setSortField] = useState<SortField>('changePercent');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Sorting and Filtering
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      // Category filter
      if (selectedCategory !== 'all' && asset.category !== selectedCategory) {
        return false;
      }
      // Performance filter
      if (performanceFilter === 'gainers' && asset.changePercent <= 0) return false;
      if (performanceFilter === 'losers' && asset.changePercent >= 0) return false;
      if (performanceFilter === 'bullish' && !['Strong Buy', 'Buy'].includes(asset.technicalRating)) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSymbol = asset.symbol.toLowerCase().includes(q);
        const matchesName = asset.name.toLowerCase().includes(q);
        const matchesSector = asset.sector?.toLowerCase().includes(q) || false;
        if (!matchesSymbol && !matchesName && !matchesSector) return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'symbol') {
        comparison = a.symbol.localeCompare(b.symbol);
      } else if (sortField === 'price') {
        comparison = a.price - b.price;
      } else if (sortField === 'changePercent') {
        comparison = a.changePercent - b.changePercent;
      } else if (sortField === 'technicalScore') {
        comparison = a.technicalScore - b.technicalScore;
      } else if (sortField === 'volume24h') {
        const getVal = (v: string) => {
          const num = parseFloat(v.replace(/[^0-9.]/g, '')) || 0;
          return v.includes('B') ? num * 1000 : num;
        };
        comparison = getVal(a.volume24h) - getVal(b.volume24h);
      }
      return sortAsc ? comparison : -comparison;
    });
  }, [assets, selectedCategory, performanceFilter, searchQuery, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Instruments' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'indices', label: 'Indices' },
    { id: 'futures', label: 'Commodities' },
    { id: 'bonds', label: 'Bonds' },
  ];

  return (
    <div className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden mb-8">
      {/* Screener Header & Filter Toolbar */}
      <div className="p-4 sm:p-5 border-b border-[#2a2e39] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[#2962ff]" />
              <h2 className="text-xl font-bold text-[#f0f3fa]">Global Market Screener</h2>
            </div>
            <p className="text-xs text-[#787b86]">Multi-asset screening, technical filters and performance metrics</p>
          </div>

          {/* Quick Search in Screener */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[#787b86] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by symbol, company..."
              className="w-full bg-[#131722] border border-[#2a2e39] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#f0f3fa] placeholder-[#787b86] focus:outline-none focus:border-[#2962ff]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#2a2e39]/60">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#2962ff] text-white font-semibold'
                    : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#131722]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Performance preset filters */}
          <div className="flex items-center gap-1 text-xs">
            {(
              [
                { id: 'all', label: 'All Returns' },
                { id: 'gainers', label: 'Positive (>0%)' },
                { id: 'losers', label: 'Negative (<0%)' },
                { id: 'bullish', label: 'Bullish Rating' },
              ] as const
            ).map(p => (
              <button
                key={p.id}
                onClick={() => setPerformanceFilter(p.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  performanceFilter === p.id
                    ? 'bg-[#2a2e39] text-[#f0f3fa] border border-[#363a45]'
                    : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#2a2e39] text-[#787b86] font-medium uppercase tracking-wider text-[11px] bg-[#1a1e28]">
              <th className="py-3 px-3 w-10 text-center"></th>
              <th className="py-3 px-4 cursor-pointer hover:text-[#f0f3fa]" onClick={() => handleSort('symbol')}>
                <div className="flex items-center gap-1">
                  <span>Symbol / Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-[#f0f3fa]" onClick={() => handleSort('price')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Price</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-[#f0f3fa]" onClick={() => handleSort('changePercent')}>
                <div className="flex items-center justify-end gap-1">
                  <span>% Change</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right hidden sm:table-cell">24h High</th>
              <th className="py-3 px-4 text-right hidden sm:table-cell">24h Low</th>
              <th className="py-3 px-4 text-right hidden md:table-cell cursor-pointer hover:text-[#f0f3fa]" onClick={() => handleSort('volume24h')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Volume</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-center cursor-pointer hover:text-[#f0f3fa]" onClick={() => handleSort('technicalScore')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Technical Score</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-center">Open</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2e39]/50">
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-[#787b86]">
                  No financial instruments found matching the current filters.
                </td>
              </tr>
            ) : (
              filteredAssets.map(asset => {
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
                    <td className="py-3 px-3 text-center" onClick={(e) => { e.stopPropagation(); toggleWatchlist(asset.symbol); }}>
                      <button className="text-[#787b86] hover:text-[#f59e0b] p-1">
                        <Star className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-[#f59e0b] text-[#f59e0b]' : ''}`} />
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-[10px] text-[#f0f3fa] shrink-0">
                          {asset.symbol.substring(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors">
                            {asset.symbol}
                          </span>
                          <span className="text-[11px] text-[#787b86] truncate max-w-[150px] sm:max-w-[220px]">
                            {asset.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right tabular-nums font-semibold text-sm text-[#f0f3fa]">
                      ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: asset.price > 10 ? 2 : 4 })}
                    </td>

                    <td className="py-3 px-4 text-right tabular-nums font-bold">
                      <span className={`px-2 py-0.5 rounded text-xs inline-block ${
                        isPositive ? 'text-[#089981] bg-[#089981]/15' : 'text-[#f23645] bg-[#f23645]/15'
                      }`}>
                        {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right tabular-nums text-[#787b86] hidden sm:table-cell">
                      ${asset.high24h.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-4 text-right tabular-nums text-[#787b86] hidden sm:table-cell">
                      ${asset.low24h.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-4 text-right tabular-nums text-[#d1d4dc] hidden md:table-cell">
                      {asset.volume24h}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-16 bg-[#131722] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              asset.technicalScore >= 70 ? 'bg-[#089981]' : asset.technicalScore >= 45 ? 'bg-[#f59e0b]' : 'bg-[#f23645]'
                            }`}
                            style={{ width: `${asset.technicalScore}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-[#d1d4dc] tabular-nums">
                          {asset.technicalScore}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedAsset(asset)}
                        className="px-2 py-1 text-xs text-[#2962ff] hover:bg-[#2962ff]/10 rounded font-medium inline-flex items-center gap-1 cursor-pointer"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Chart</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-[#1a1e28] border-t border-[#2a2e39] flex items-center justify-between text-xs text-[#787b86]">
        <span>Showing {filteredAssets.length} of {assets.length} financial instruments</span>
        <span>Data updated continuously in real-time</span>
      </div>
    </div>
  );
};

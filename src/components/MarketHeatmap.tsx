import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { MarketAsset } from '../types/market';
import { LayoutGrid, Filter, Search } from 'lucide-react';

export const MarketHeatmap: React.FC = () => {
  const { assets, setSelectedAsset } = useMarket();
  const [heatmapType, setHeatmapType] = useState<'stocks' | 'crypto'>('stocks');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [hoveredAsset, setHoveredAsset] = useState<MarketAsset | null>(null);

  // Group assets for heatmap
  const relevantAssets = assets.filter(a => {
    if (heatmapType === 'stocks') {
      if (a.category !== 'stocks') return false;
      if (selectedSector !== 'All' && a.sector !== selectedSector) return false;
      return true;
    } else {
      return a.category === 'crypto';
    }
  });

  // Calculate market cap numeric estimation for tile sizing
  const parseCap = (capStr?: string) => {
    if (!capStr) return 10;
    const num = parseFloat(capStr.replace(/[^0-9.]/g, '')) || 10;
    return capStr.includes('T') ? num * 1000 : num;
  };

  const totalCap = relevantAssets.reduce((acc, curr) => acc + parseCap(curr.marketCap), 0) || 1;

  // Determine color based on changePercent
  const getHeatmapColor = (changePercent: number) => {
    if (changePercent >= 4.0) return 'bg-[#089981] text-white';
    if (changePercent >= 2.0) return 'bg-[#0b826e] text-white';
    if (changePercent >= 0.5) return 'bg-[#126b5d] text-white';
    if (changePercent >= 0) return 'bg-[#1b4b44] text-[#d1d4dc]';
    if (changePercent >= -1.0) return 'bg-[#4a1c24] text-[#d1d4dc]';
    if (changePercent >= -3.0) return 'bg-[#8f1d28] text-white';
    return 'bg-[#f23645] text-white';
  };

  const sectors = ['All', 'Technology', 'Communication', 'Financial', 'Healthcare', 'Consumer Cyclical', 'Energy'];

  return (
    <div className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 sm:p-6 mb-8">
      {/* Heatmap Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#2a2e39]">
        <div>
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-[#2962ff]" />
            <h2 className="text-xl font-bold text-[#f0f3fa]">Interactive Market Heatmap</h2>
          </div>
          <p className="text-xs text-[#787b86]">Visualizing market breadth, capital concentration and daily returns</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Asset Class Switcher */}
          <div className="flex items-center bg-[#131722] p-1 rounded-lg text-xs">
            <button
              onClick={() => { setHeatmapType('stocks'); setSelectedSector('All'); }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                heatmapType === 'stocks' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
              }`}
            >
              US Equities
            </button>
            <button
              onClick={() => { setHeatmapType('crypto'); setSelectedSector('All'); }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                heatmapType === 'crypto' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
              }`}
            >
              Crypto 24H
            </button>
          </div>

          {/* Sector Filter for Stocks */}
          {heatmapType === 'stocks' && (
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
              {sectors.map(sec => (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    selectedSector === sec
                      ? 'bg-[#2a2e39] text-[#f0f3fa] font-semibold border border-[#363a45]'
                      : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#131722]'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center justify-between text-[11px] text-[#787b86] mb-3 px-1">
        <span>Tile size represents relative market capitalization</span>
        <div className="flex items-center gap-1 font-mono">
          <span>-3%</span>
          <div className="w-4 h-3 bg-[#f23645] rounded-xs" />
          <div className="w-4 h-3 bg-[#8f1d28] rounded-xs" />
          <div className="w-4 h-3 bg-[#4a1c24] rounded-xs" />
          <div className="w-4 h-3 bg-[#1b4b44] rounded-xs" />
          <div className="w-4 h-3 bg-[#126b5d] rounded-xs" />
          <div className="w-4 h-3 bg-[#089981] rounded-xs" />
          <span>+3%</span>
        </div>
      </div>

      {/* Treemap Container */}
      <div className="relative min-h-[460px] w-full bg-[#131722] p-2 rounded-lg border border-[#2a2e39] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 auto-rows-fr">
        {relevantAssets.map(asset => {
          const cap = parseCap(asset.marketCap);
          const weightPercent = (cap / totalCap) * 100;
          const colorClass = getHeatmapColor(asset.changePercent);

          // Span larger grid cells for heavyweights like NVDA, AAPL, MSFT, BTC
          const spanClass =
            weightPercent > 18
              ? 'col-span-2 row-span-2 min-h-[160px]'
              : weightPercent > 8
              ? 'col-span-2 row-span-1 min-h-[100px]'
              : 'col-span-1 row-span-1 min-h-[85px]';

          return (
            <div
              key={asset.symbol}
              onClick={() => setSelectedAsset(asset)}
              onMouseEnter={() => setHoveredAsset(asset)}
              onMouseLeave={() => setHoveredAsset(null)}
              className={`${spanClass} ${colorClass} p-3 rounded-md flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-[#2962ff] transition-all relative overflow-hidden group shadow-xs`}
            >
              <div className="flex items-start justify-between">
                <span className="font-extrabold text-sm sm:text-base tracking-tight leading-none group-hover:scale-105 transition-transform">
                  {asset.symbol}
                </span>
                <span className="text-[10px] font-mono opacity-80 uppercase">
                  {asset.sector ? asset.sector.split(' ')[0] : asset.category}
                </span>
              </div>

              <div className="my-1 truncate text-[11px] opacity-85 hidden sm:block">
                {asset.name}
              </div>

              <div className="flex items-baseline justify-between tabular-nums">
                <span className="text-xs font-semibold">
                  ${asset.price.toLocaleString('en-US', { maximumFractionDigits: asset.price > 10 ? 2 : 4 })}
                </span>
                <span className="text-xs font-bold font-mono">
                  {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Hover Card Detail */}
      {hoveredAsset && (
        <div className="mt-4 p-3 bg-[#131722] border border-[#363a45] rounded-lg flex flex-wrap items-center justify-between text-xs gap-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-[#f0f3fa]">{hoveredAsset.symbol}</span>
            <span className="text-[#787b86]">{hoveredAsset.name}</span>
            <span className="px-1.5 py-0.5 rounded bg-[#1e222d] text-[#787b86] font-mono text-[10px]">{hoveredAsset.exchange}</span>
          </div>
          <div className="flex items-center gap-4 tabular-nums">
            <span className="text-[#787b86]">Price: <strong className="text-[#f0f3fa]">${hoveredAsset.price}</strong></span>
            <span className="text-[#787b86]">24h Range: <strong className="text-[#d1d4dc]">${hoveredAsset.low24h} - ${hoveredAsset.high24h}</strong></span>
            <span className="text-[#787b86]">Volume: <strong className="text-[#d1d4dc]">{hoveredAsset.volume24h}</strong></span>
            <span className="text-[#787b86]">Cap: <strong className="text-[#d1d4dc]">{hoveredAsset.marketCap || 'N/A'}</strong></span>
            <button
              onClick={() => setSelectedAsset(hoveredAsset)}
              className="text-[#2962ff] font-semibold hover:underline cursor-pointer"
            >
              Open Interactive Chart →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

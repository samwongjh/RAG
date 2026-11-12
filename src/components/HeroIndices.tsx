import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { MarketAsset } from '../types/market';
import { TrendingUp, TrendingDown, Maximize2 } from 'lucide-react';

export const HeroIndices: React.FC = () => {
  const { assets, setSelectedAsset, lastTickDirections } = useMarket();
  const [selectedTimeframes, setSelectedTimeframes] = useState<Record<string, '1D' | '5D' | '1M' | '1Y'>>({
    'SPX': '1D',
    'NDX': '1D',
    'DJI': '1D',
    'BTC/USD': '1D',
  });

  const featuredSymbols = ['SPX', 'NDX', 'DJI', 'BTC/USD'];
  const featuredAssets = assets.filter(a => featuredSymbols.includes(a.symbol));

  const setCardTimeframe = (symbol: string, tf: '1D' | '5D' | '1M' | '1Y', e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTimeframes(prev => ({ ...prev, [symbol]: tf }));
  };

  const renderMiniChart = (asset: MarketAsset, timeframe: '1D' | '5D' | '1M' | '1Y') => {
    const candles = asset.history[timeframe] || asset.history['1D'];
    if (!candles || candles.length < 2) return null;

    const prices = candles.map(c => c.close);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const width = 280;
    const height = 70;

    const points = prices.map((val, idx) => {
      const x = (idx / (prices.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 12) - 6;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const isPositive = asset.changePercent >= 0;
    const strokeColor = isPositive ? '#089981' : '#f23645';
    const gradientId = `grad-${asset.symbol.replace('/', '-')}`;

    return (
      <div className="relative w-full h-[70px] mt-2 overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Area fill */}
          <polygon
            points={`0,${height} ${points} ${width},${height}`}
            fill={`url(#${gradientId})`}
          />
          {/* Stroke line */}
          <polyline
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    );
  };

  return (
    <section className="w-full mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#f0f3fa] tracking-tight">
            Major Benchmarks
          </h2>
          <p className="text-xs text-[#787b86]">
            Real-time global index tracking and digital macro reserves
          </p>
        </div>
      </div>

      {/* Grid of 4 prominent index cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredAssets.map(asset => {
          const isPositive = asset.changePercent >= 0;
          const currentTf = selectedTimeframes[asset.symbol] || '1D';
          const tickDir = lastTickDirections[asset.symbol];

          // 24h high/low percentage position
          const highLowRange = asset.high24h - asset.low24h || 1;
          const currentPosPercent = Math.min(Math.max(((asset.price - asset.low24h) / highLowRange) * 100, 0), 100);

          return (
            <div
              key={asset.symbol}
              onClick={() => setSelectedAsset(asset)}
              className={`bg-[#1e222d] hover:bg-[#252a36] border border-[#2a2e39] hover:border-[#363a45] rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm relative group ${
                tickDir === 'up' ? 'animate-tick-up' : tickDir === 'down' ? 'animate-tick-down' : ''
              }`}
            >
              {/* Header with symbol and timeframe buttons */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors">
                      {asset.symbol}
                    </span>
                    <span className="text-[10px] text-[#787b86] uppercase font-mono px-1 py-0.5 rounded bg-[#131722]">
                      {asset.exchange}
                    </span>
                  </div>
                  <div className="text-xs text-[#787b86] truncate max-w-[150px]">
                    {asset.name}
                  </div>
                </div>

                {/* Timeframe pill selector */}
                <div className="flex items-center gap-1 bg-[#131722] p-0.5 rounded-md text-[10px]">
                  {(['1D', '5D', '1M', '1Y'] as const).map(tf => (
                    <button
                      key={tf}
                      onClick={(e) => setCardTimeframe(asset.symbol, tf, e)}
                      className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                        currentTf === tf
                          ? 'bg-[#2962ff] text-white font-medium'
                          : 'text-[#787b86] hover:text-[#d1d4dc]'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price and Change */}
              <div className="mt-3 flex items-baseline justify-between tabular-nums">
                <div className="text-2xl font-bold text-[#f0f3fa]">
                  {asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                  {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{isPositive ? '+' : ''}{asset.change.toFixed(2)}</span>
                  <span>({isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%)</span>
                </div>
              </div>

              {/* Mini Area Chart */}
              {renderMiniChart(asset, currentTf)}

              {/* Range bar: Low vs High 24h */}
              <div className="mt-3 pt-3 border-t border-[#2a2e39]/60">
                <div className="flex justify-between text-[10px] text-[#787b86] tabular-nums mb-1">
                  <span>L: {asset.low24h.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                  <span>Vol: {asset.volume24h}</span>
                  <span>H: {asset.high24h.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="w-full bg-[#131722] h-1 rounded-full overflow-hidden relative">
                  <div 
                    className="absolute top-0 bottom-0 bg-[#2962ff] rounded-full"
                    style={{ left: `${Math.max(currentPosPercent - 8, 0)}%`, width: '16%' }}
                  />
                </div>
              </div>

              {/* Open chart hover prompt */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="p-1.5 rounded-md bg-[#131722]/80 text-[#d1d4dc] hover:text-[#2962ff]">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

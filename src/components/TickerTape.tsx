import React from 'react';
import { useMarket } from '../context/MarketContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const TickerTape: React.FC = () => {
  const { assets, setSelectedAsset, lastTickDirections } = useMarket();

  // Pick top marquee assets (indices, majors, high volume)
  const marqueeSymbols = ['SPX', 'NDX', 'DJI', 'BTC/USD', 'ETH/USD', 'GOLD', 'CRUDE_OIL', 'EUR/USD', 'NVDA', 'AAPL', 'TSLA', 'SOL/USD'];
  const marqueeAssets = assets.filter(a => marqueeSymbols.includes(a.symbol));

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (price >= 1) {
      return price.toFixed(2);
    }
    return price.toFixed(4);
  };

  const renderMiniSparkline = (data: number[], isPositive: boolean) => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 48;
    const height = 18;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const strokeColor = isPositive ? '#089981' : '#f23645';

    return (
      <svg width={width} height={height} className="overflow-visible shrink-0">
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

  return (
    <div className="w-full bg-[#131722] dark:bg-[#131722] border-b border-[#2a2e39] text-xs select-none overflow-hidden transition-colors">
      <div className="flex items-center overflow-x-auto no-scrollbar py-2 px-4 space-x-6 md:space-x-8">
        {marqueeAssets.map(asset => {
          const isPositive = asset.changePercent >= 0;
          const tickDir = lastTickDirections[asset.symbol];

          return (
            <button
              key={asset.symbol}
              onClick={() => setSelectedAsset(asset)}
              className={`flex items-center gap-3 shrink-0 py-0.5 px-2 rounded hover:bg-[#1e222d] transition-all cursor-pointer text-left ${
                tickDir === 'up' ? 'animate-tick-up' : tickDir === 'down' ? 'animate-tick-down' : ''
              }`}
              title={`View ${asset.name} full interactive chart`}
            >
              <div className="flex flex-col">
                <span className="font-bold text-[#d1d4dc] hover:text-[#2962ff] transition-colors tracking-tight">
                  {asset.symbol}
                </span>
                <span className="text-[10px] text-[#787b86] truncate max-w-[80px]">
                  {asset.category.toUpperCase()}
                </span>
              </div>

              {renderMiniSparkline(asset.sparkline, isPositive)}

              <div className="flex flex-col items-end tabular-nums">
                <span className="font-semibold text-[#f0f3fa]">
                  {formatPrice(asset.price)}
                </span>
                <span className={`flex items-center gap-0.5 text-[11px] font-medium ${isPositive ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                  {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

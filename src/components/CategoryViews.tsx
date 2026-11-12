import React from 'react';
import { useMarket } from '../context/MarketContext';
import { MarketAsset } from '../types/market';
import { 
  TrendingUp, 
  TrendingDown, 
  Bitcoin, 
  DollarSign, 
  Globe2, 
  Coins, 
  Fuel, 
  Landmark,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { MarketScreener } from './MarketScreener';
import { MarketHeatmap } from './MarketHeatmap';
import { HeroIndices } from './HeroIndices';

export const CategoryViews: React.FC = () => {
  const { activeTab, assets, setSelectedAsset, lastTickDirections } = useMarket();

  const getAssetsByCategory = (cat: string) => assets.filter(a => a.category === cat);

  // RENDER CRYPTO VIEW
  if (activeTab === 'crypto') {
    const cryptoAssets = getAssetsByCategory('crypto');
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Crypto Macro Barometer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#1e222d] border border-[#2a2e39] p-4 rounded-xl">
            <span className="text-xs text-[#787b86]">Total Crypto Market Cap</span>
            <div className="text-xl font-bold text-[#f0f3fa] mt-1 tabular-nums">$2.42 Trillion</div>
            <span className="text-xs font-semibold text-[#089981] flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +2.84% (24h)
            </span>
          </div>

          <div className="bg-[#1e222d] border border-[#2a2e39] p-4 rounded-xl">
            <span className="text-xs text-[#787b86]">24h Total Volume</span>
            <div className="text-xl font-bold text-[#f0f3fa] mt-1 tabular-nums">$84.6 Billion</div>
            <span className="text-xs text-[#787b86] mt-1 block">Across top centralized exchanges</span>
          </div>

          <div className="bg-[#1e222d] border border-[#2a2e39] p-4 rounded-xl">
            <span className="text-xs text-[#787b86]">Bitcoin Dominance</span>
            <div className="text-xl font-bold text-[#f0f3fa] mt-1 tabular-nums">57.2%</div>
            <span className="text-xs text-[#089981] mt-1 block">ETH: 13.8% · Others: 29.0%</span>
          </div>

          <div className="bg-[#1e222d] border border-[#2a2e39] p-4 rounded-xl">
            <span className="text-xs text-[#787b86]">Crypto Fear & Greed</span>
            <div className="text-xl font-bold text-[#089981] mt-1 tabular-nums">74 / 100</div>
            <span className="text-xs text-[#089981] mt-1 block font-semibold">Greed Sentiment</span>
          </div>
        </div>

        {/* Dedicated Crypto Heatmap */}
        <MarketHeatmap />

        {/* Filtered Screener */}
        <MarketScreener />
      </div>
    );
  }

  // RENDER FOREX VIEW
  if (activeTab === 'forex') {
    const fxAssets = getAssetsByCategory('forex');
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Forex Header & Currency Matrix */}
        <div className="bg-[#1e222d] border border-[#2a2e39] p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Globe2 className="w-5 h-5 text-[#2962ff]" />
            <h2 className="text-xl font-bold text-[#f0f3fa]">Foreign Exchange Majors & Cross Rates</h2>
          </div>
          <p className="text-xs text-[#787b86]">Live interbank currency pricing, exchange differentials and pip swings</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {fxAssets.map(pair => {
              const isPositive = pair.changePercent >= 0;
              const tickDir = lastTickDirections[pair.symbol];

              return (
                <div
                  key={pair.symbol}
                  onClick={() => setSelectedAsset(pair)}
                  className={`bg-[#131722] hover:bg-[#252a36] border border-[#2a2e39] p-4 rounded-xl cursor-pointer transition-colors group ${
                    tickDir === 'up' ? 'animate-tick-up' : tickDir === 'down' ? 'animate-tick-down' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors">
                      {pair.symbol}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#1e222d] text-[#787b86] font-mono">
                      {pair.country}
                    </span>
                  </div>
                  <div className="text-xs text-[#787b86] mb-3">{pair.name}</div>
                  <div className="flex items-baseline justify-between tabular-nums">
                    <div className="text-xl font-extrabold text-[#f0f3fa]">
                      {pair.price.toFixed(4)}
                    </div>
                    <div className={`flex items-center gap-1 font-bold text-xs ${isPositive ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      <span>{isPositive ? '+' : ''}{pair.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#2a2e39]/50 flex justify-between text-[11px] text-[#787b86]">
                    <span>L: {pair.low24h.toFixed(4)}</span>
                    <span>H: {pair.high24h.toFixed(4)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <MarketScreener />
      </div>
    );
  }

  // RENDER FUTURES & COMMODITIES VIEW
  if (activeTab === 'futures') {
    const futuresAssets = getAssetsByCategory('futures');
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        <div className="bg-[#1e222d] border border-[#2a2e39] p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Fuel className="w-5 h-5 text-[#2962ff]" />
            <h2 className="text-xl font-bold text-[#f0f3fa]">Commodities & Global Futures</h2>
          </div>
          <p className="text-xs text-[#787b86]">Energy contracts, precious metals, industrial minerals and spot delivery benchmarks</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {futuresAssets.map(future => {
              const isPositive = future.changePercent >= 0;
              const tickDir = lastTickDirections[future.symbol];

              return (
                <div
                  key={future.symbol}
                  onClick={() => setSelectedAsset(future)}
                  className={`bg-[#131722] hover:bg-[#252a36] border border-[#2a2e39] p-4 rounded-xl cursor-pointer transition-colors group ${
                    tickDir === 'up' ? 'animate-tick-up' : tickDir === 'down' ? 'animate-tick-down' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-base text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors">
                      {future.symbol}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1e222d] text-[#787b86]">
                      {future.exchange}
                    </span>
                  </div>
                  <div className="text-xs text-[#787b86] mb-3">{future.name}</div>
                  <div className="flex items-baseline justify-between tabular-nums">
                    <div className="text-xl font-extrabold text-[#f0f3fa]">
                      ${future.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`flex items-center gap-1 font-bold text-xs ${isPositive ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      <span>{isPositive ? '+' : ''}{future.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <MarketScreener />
      </div>
    );
  }

  // RENDER BONDS & YIELDS VIEW
  if (activeTab === 'bonds') {
    const bondAssets = getAssetsByCategory('bonds');
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        <div className="bg-[#1e222d] border border-[#2a2e39] p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Landmark className="w-5 h-5 text-[#2962ff]" />
            <h2 className="text-xl font-bold text-[#f0f3fa]">Sovereign Bonds & Yield Curves</h2>
          </div>
          <p className="text-xs text-[#787b86]">Government debt yields, duration risk and macroeconomic rate curve structure</p>

          {/* Treasury Yield Curve Illustration */}
          <div className="bg-[#131722] border border-[#2a2e39] p-4 rounded-xl mt-6">
            <div className="flex justify-between items-center text-xs mb-3 text-[#787b86]">
              <span className="font-semibold text-[#f0f3fa]">US Treasury Yield Curve (2Y to 30Y)</span>
              <span className="text-[#089981] font-mono">Curve Spread: +15.4 bps (Normalizing)</span>
            </div>

            {/* Yield curve chart */}
            <div className="h-36 w-full relative">
              <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="w-full h-full">
                <line x1="0" y1="30" x2="600" y2="30" stroke="#2a2e39" strokeDasharray="3 3" />
                <line x1="0" y1="70" x2="600" y2="70" stroke="#2a2e39" strokeDasharray="3 3" />
                <polyline
                  fill="none"
                  stroke="#2962ff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  points="50,60 180,50 320,38 480,32 550,28"
                />
                <circle cx="50" cy="60" r="5" fill="#2962ff" />
                <circle cx="180" cy="50" r="5" fill="#2962ff" />
                <circle cx="320" cy="38" r="5" fill="#2962ff" />
                <circle cx="480" cy="32" r="5" fill="#2962ff" />
                <circle cx="550" cy="28" r="5" fill="#2962ff" />

                <text x="50" y="85" fill="#787b86" fontSize="11" textAnchor="middle" className="font-mono">US 1M</text>
                <text x="180" y="85" fill="#787b86" fontSize="11" textAnchor="middle" className="font-mono">US 2Y (4.08%)</text>
                <text x="320" y="85" fill="#787b86" fontSize="11" textAnchor="middle" className="font-mono">US 5Y (4.15%)</text>
                <text x="480" y="85" fill="#787b86" fontSize="11" textAnchor="middle" className="font-mono">US 10Y (4.24%)</text>
                <text x="550" y="85" fill="#787b86" fontSize="11" textAnchor="middle" className="font-mono">US 30Y (4.51%)</text>
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {bondAssets.map(bond => (
              <div
                key={bond.symbol}
                onClick={() => setSelectedAsset(bond)}
                className="bg-[#131722] hover:bg-[#252a36] border border-[#2a2e39] p-4 rounded-xl cursor-pointer transition-colors group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors">{bond.symbol}</span>
                  <span className="text-xs text-[#787b86] font-mono">{bond.country}</span>
                </div>
                <div className="text-xs text-[#787b86] mb-3">{bond.name}</div>
                <div className="text-2xl font-extrabold text-[#f0f3fa] tabular-nums">
                  {bond.price.toFixed(3)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <MarketScreener />
      </div>
    );
  }

  // RENDER INDICES VIEW
  if (activeTab === 'indices') {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        <HeroIndices />
        <MarketScreener />
      </div>
    );
  }

  // RENDER STOCKS VIEW
  if (activeTab === 'stocks') {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        <HeroIndices />
        <MarketHeatmap />
        <MarketScreener />
      </div>
    );
  }

  // RENDER HEATMAP TAB
  if (activeTab === 'heatmap') {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        <MarketHeatmap />
      </div>
    );
  }

  // RENDER SCREENER TAB
  if (activeTab === 'screener') {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        <MarketScreener />
      </div>
    );
  }

  return null;
};

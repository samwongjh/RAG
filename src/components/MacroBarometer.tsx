import React from 'react';
import { useMarket } from '../context/MarketContext';
import { Gauge, Activity, Clock, ShieldCheck, TrendingUp, TrendingDown, Layers } from 'lucide-react';

export const MacroBarometer: React.FC = () => {
  const { breadth, marketSession } = useMarket();

  const totalBreadth = breadth.advancing + breadth.declining + breadth.unchanged;
  const advPercent = (breadth.advancing / totalBreadth) * 100;
  const decPercent = (breadth.declining / totalBreadth) * 100;

  return (
    <section className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 sm:p-5 mb-8 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[#2a2e39] gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#2962ff]" />
          <div>
            <h3 className="text-base font-bold text-[#f0f3fa]">Global Market Pulse & Sentiment</h3>
            <p className="text-xs text-[#787b86]">Macro breadth, institutional liquidity, volatility and market session status</p>
          </div>
        </div>
        
        {/* Session status badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#089981]/15 text-[#089981] font-semibold border border-[#089981]/30">
            <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse" />
            {marketSession.name}: {marketSession.status}
          </span>
          <span className="text-[#787b86] hidden md:inline">
            Closes in {marketSession.closesIn}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Fear & Greed Index */}
        <div className="bg-[#131722] border border-[#2a2e39] p-4 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs text-[#787b86] font-medium">Market Sentiment</span>
              <div className="text-sm font-bold text-[#f0f3fa]">Fear & Greed Index</div>
            </div>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#089981]/15 text-[#089981]">
              {breadth.fearGreedLabel}
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2 tabular-nums">
              <span className="text-2xl font-black text-[#089981]">{breadth.fearGreedIndex}</span>
              <span className="text-xs text-[#787b86]">/ 100</span>
            </div>
            {/* Speedometer track */}
            <div className="w-full bg-[#1e222d] h-2 rounded-full overflow-hidden mt-2 relative">
              <div 
                className="h-full bg-gradient-to-r from-[#f23645] via-[#f59e0b] to-[#089981] rounded-full"
                style={{ width: `${breadth.fearGreedIndex}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-[#787b86] pt-2 border-t border-[#2a2e39]/60 tabular-nums">
            <span>Previous: 64</span>
            <span>1 Month: 52 (Neutral)</span>
          </div>
        </div>

        {/* 2. Market Breadth: Advancers vs Decliners */}
        <div className="bg-[#131722] border border-[#2a2e39] p-4 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs text-[#787b86] font-medium">NYSE & NASDAQ</span>
              <div className="text-sm font-bold text-[#f0f3fa]">Advance / Decline Ratio</div>
            </div>
            <span className="text-xs font-bold font-mono text-[#089981]">
              +1.73x
            </span>
          </div>

          <div className="my-2">
            <div className="flex justify-between text-xs font-bold tabular-nums mb-1">
              <span className="text-[#089981]">{breadth.advancing.toLocaleString()} Adv</span>
              <span className="text-[#f23645]">{breadth.declining.toLocaleString()} Dec</span>
            </div>
            {/* Advance / Decline Bar */}
            <div className="w-full h-2 rounded-full flex overflow-hidden bg-[#1e222d]">
              <div className="bg-[#089981] h-full" style={{ width: `${advPercent}%` }} />
              <div className="bg-[#f23645] h-full" style={{ width: `${decPercent}%` }} />
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-[#787b86] pt-2 border-t border-[#2a2e39]/60 tabular-nums">
            <span>52W Highs: <strong className="text-[#089981]">{breadth.newHighs}</strong></span>
            <span>52W Lows: <strong className="text-[#f23645]">{breadth.newLows}</strong></span>
          </div>
        </div>

        {/* 3. Volatility Index (VIX) */}
        <div className="bg-[#131722] border border-[#2a2e39] p-4 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs text-[#787b86] font-medium">Implied Volatility</span>
              <div className="text-sm font-bold text-[#f0f3fa]">CBOE VIX Index</div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#089981]/15 text-[#089981]">
              Low Risk
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2 tabular-nums">
              <span className="text-2xl font-black text-[#f0f3fa]">{breadth.vix.toFixed(2)}</span>
              <span className="text-xs font-bold text-[#089981] flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" />
                {breadth.vixChange} (-2.69%)
              </span>
            </div>
            <div className="text-[11px] text-[#787b86] mt-1">
              Below 20 threshold indicates stable market liquidity
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-[#787b86] pt-2 border-t border-[#2a2e39]/60 tabular-nums">
            <span>Day Range: 14.88 - 15.60</span>
            <span>52W Low: 11.86</span>
          </div>
        </div>

        {/* 4. Fed Watch / Rate Path */}
        <div className="bg-[#131722] border border-[#2a2e39] p-4 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs text-[#787b86] font-medium">Monetary Policy</span>
              <div className="text-sm font-bold text-[#f0f3fa]">Fed Rate Probability</div>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1e222d] text-[#787b86]">
              FOMC
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline justify-between tabular-nums">
              <span className="text-lg font-bold text-[#f0f3fa]">4.75% - 5.00%</span>
              <span className="text-xs font-bold text-[#2962ff]">88.5% Hold/Cut</span>
            </div>
            <div className="w-full bg-[#1e222d] h-2 rounded-full overflow-hidden mt-2 relative">
              <div className="h-full bg-[#2962ff] rounded-full" style={{ width: '88.5%' }} />
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-[#787b86] pt-2 border-t border-[#2a2e39]/60 tabular-nums">
            <span>Next Deliberation: 18 Days</span>
            <span>Target: 2.0% Core CPI</span>
          </div>
        </div>

      </div>
    </section>
  );
};

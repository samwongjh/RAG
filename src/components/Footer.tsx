import React from 'react';
import { useMarket } from '../context/MarketContext';
import { Shield, Globe2, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useMarket();

  return (
    <footer className="w-full bg-[#131722] border-t border-[#2a2e39] text-xs text-[#787b86] py-10 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-[#f0f3fa] mb-3 text-xs uppercase tracking-wider">Markets</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('stocks')} className="hover:text-[#2962ff] transition-colors cursor-pointer">Stocks & Equities</button></li>
              <li><button onClick={() => setActiveTab('crypto')} className="hover:text-[#2962ff] transition-colors cursor-pointer">Cryptocurrency</button></li>
              <li><button onClick={() => setActiveTab('forex')} className="hover:text-[#2962ff] transition-colors cursor-pointer">Forex Rates</button></li>
              <li><button onClick={() => setActiveTab('indices')} className="hover:text-[#2962ff] transition-colors cursor-pointer">Global Indices</button></li>
              <li><button onClick={() => setActiveTab('futures')} className="hover:text-[#2962ff] transition-colors cursor-pointer">Commodities & Futures</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#f0f3fa] mb-3 text-xs uppercase tracking-wider">Analytics</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('heatmap')} className="hover:text-[#2962ff] transition-colors cursor-pointer">S&P 500 Heatmap</button></li>
              <li><button onClick={() => setActiveTab('screener')} className="hover:text-[#2962ff] transition-colors cursor-pointer">Multi-Asset Screener</button></li>
              <li><button onClick={() => setActiveTab('overview')} className="hover:text-[#2962ff] transition-colors cursor-pointer">Sector Barometer</button></li>
              <li><button onClick={() => setActiveTab('bonds')} className="hover:text-[#2962ff] transition-colors cursor-pointer">Treasury Yield Curve</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#f0f3fa] mb-3 text-xs uppercase tracking-wider">Trading Community</h4>
            <ul className="space-y-2">
              <li><span className="hover:text-[#f0f3fa] transition-colors">Pine Script™ v6</span></li>
              <li><span className="hover:text-[#f0f3fa] transition-colors">Community Ideas</span></li>
              <li><span className="hover:text-[#f0f3fa] transition-colors">Technical Indicators</span></li>
              <li><span className="hover:text-[#f0f3fa] transition-colors">Economic Calendar</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#f0f3fa] mb-3 text-xs uppercase tracking-wider">TradingView Markets</h4>
            <p className="text-[11px] leading-relaxed mb-3">
              The world's most versatile charting platform and social network for active traders and long-term global investors.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#2962ff] font-medium">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Real-Time Market Data Stream</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#2a2e39]/60 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 TradingView Markets. Real-time quotes and data simulated for analytical exploration.</p>
          <p className="text-[#787b86] text-center md:text-right max-w-xl">
            Financial market quotations are delayed or real-time simulation where noted. Trading involves substantial risk of loss.
          </p>
        </div>
      </div>
    </footer>
  );
};

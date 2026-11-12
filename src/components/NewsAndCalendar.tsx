import React, { useState } from 'react';
import { NEWS_ITEMS, ECONOMIC_EVENTS } from '../data/marketData';
import { useMarket } from '../context/MarketContext';
import { Newspaper, Calendar, TrendingUp, TrendingDown, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { NewsItem } from '../types/market';

export const NewsAndCalendar: React.FC = () => {
  const { assets, setSelectedAsset } = useMarket();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const handleSymbolClick = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const asset = assets.find(a => a.symbol === symbol);
    if (asset) setSelectedAsset(asset);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Financial News & Market Insights */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2a2e39]">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-[#2962ff]" />
              <h3 className="text-base font-bold text-[#f0f3fa]">Market News & Wire</h3>
            </div>
            <span className="text-xs text-[#787b86]">Live Feed</span>
          </div>

          <div className="divide-y divide-[#2a2e39]/60">
            {NEWS_ITEMS.map(news => {
              const sentimentColor =
                news.sentiment === 'bullish'
                  ? 'text-[#089981]'
                  : news.sentiment === 'bearish'
                  ? 'text-[#f23645]'
                  : 'text-[#787b86]';

              return (
                <div
                  key={news.id}
                  onClick={() => setSelectedNews(news)}
                  className="py-3 hover:bg-[#252a36] px-2 -mx-2 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-[11px] text-[#787b86] mb-1">
                    <span className="font-semibold text-[#2962ff]">{news.category}</span>
                    <span>·</span>
                    <span>{news.source}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {news.timeAgo}
                    </span>
                    <span className="ml-auto font-medium capitalize text-[10px] px-1.5 py-0.2 rounded bg-[#131722] border border-[#2a2e39]">
                      <span className={sentimentColor}>{news.sentiment}</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors leading-snug line-clamp-2 mb-2">
                    {news.title}
                  </h4>

                  {/* Related Symbols Ticker Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {news.relatedSymbols.map(sym => (
                      <button
                        key={sym}
                        onClick={(e) => handleSymbolClick(sym, e)}
                        className="px-2 py-0.5 rounded bg-[#131722] hover:bg-[#2962ff]/20 text-[#787b86] hover:text-[#2962ff] text-[10px] font-mono font-bold transition-colors border border-[#2a2e39]"
                        title={`Open ${sym} chart`}
                      >
                        ${sym}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Read Article Modal / Drawer Preview */}
        {selectedNews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
            <div className="bg-[#1e222d] border border-[#363a45] rounded-xl max-w-lg w-full p-6 text-xs text-[#d1d4dc] shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39] mb-4">
                <span className="text-xs font-semibold text-[#2962ff]">{selectedNews.source} · {selectedNews.category}</span>
                <button onClick={() => setSelectedNews(null)} className="text-[#787b86] hover:text-[#f0f3fa] text-base font-bold">✕</button>
              </div>
              <h3 className="text-base font-bold text-[#f0f3fa] leading-snug mb-3">{selectedNews.title}</h3>
              <p className="text-sm text-[#d1d4dc] leading-relaxed mb-4">{selectedNews.snippet}</p>
              <div className="p-3 bg-[#131722] rounded-lg border border-[#2a2e39] mb-4">
                <span className="text-[#787b86] block mb-1">Impacted Assets:</span>
                <div className="flex gap-2">
                  {selectedNews.relatedSymbols.map(sym => (
                    <button
                      key={sym}
                      onClick={(e) => { setSelectedNews(null); handleSymbolClick(sym, e); }}
                      className="px-2.5 py-1 bg-[#2962ff] text-white rounded font-mono font-bold text-xs"
                    >
                      View ${sym}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="w-full py-2 bg-[#2a2e39] text-[#f0f3fa] rounded-lg font-medium hover:bg-[#363a45]"
              >
                Close Story
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Economic Calendar */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2a2e39]">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#2962ff]" />
              <h3 className="text-base font-bold text-[#f0f3fa]">Economic Calendar</h3>
            </div>
            <span className="text-xs text-[#787b86]">Today's High-Impact Releases</span>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-[#787b86] border-b border-[#2a2e39] pb-2 text-[10px] uppercase font-mono">
                  <th className="py-2 px-2">Time</th>
                  <th className="py-2 px-2">Country / Event</th>
                  <th className="py-2 px-2 text-center">Impact</th>
                  <th className="py-2 px-2 text-right">Actual</th>
                  <th className="py-2 px-2 text-right">Forecast</th>
                  <th className="py-2 px-2 text-right">Previous</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2e39]/50">
                {ECONOMIC_EVENTS.map(ev => {
                  const impactColor =
                    ev.impact === 'high'
                      ? 'bg-[#f23645] text-white'
                      : ev.impact === 'medium'
                      ? 'bg-[#f59e0b] text-black'
                      : 'bg-[#787b86] text-white';

                  return (
                    <tr key={ev.id} className="hover:bg-[#252a36] transition-colors">
                      <td className="py-3 px-2 font-mono text-[#787b86] whitespace-nowrap">
                        {ev.time}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{ev.flag}</span>
                          <span className="font-semibold text-[#f0f3fa] line-clamp-1">{ev.event}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${impactColor}`}>
                          {ev.impact}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-bold text-[#f0f3fa] tabular-nums">
                        {ev.actual}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-[#787b86] tabular-nums">
                        {ev.forecast}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-[#787b86] tabular-nums">
                        {ev.previous}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#2a2e39] flex items-center justify-between text-[11px] text-[#787b86]">
          <span>Central Bank deliberations & CPI releases update automatically</span>
          <span className="font-semibold text-[#2962ff]">Full Calendar View →</span>
        </div>
      </div>
    </div>
  );
};

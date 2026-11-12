import React, { useState, useEffect, useRef } from 'react';
import { useMarket } from '../context/MarketContext';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { MarketAsset } from '../types/market';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, assets, setSelectedAsset } = useMarket();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isSearchOpen]);

  const searchResults = assets.filter(a => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      a.symbol.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      (a.sector && a.sector.toLowerCase().includes(q))
    );
  }).slice(0, 8);

  const handleSelect = (asset: MarketAsset) => {
    setSelectedAsset(asset);
    setIsSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (searchResults.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + searchResults.length) % (searchResults.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        handleSelect(searchResults[selectedIndex]);
      }
    }
  };

  if (!isSearchOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-xs"
      onClick={() => setIsSearchOpen(false)}
    >
      <div 
        className="w-full max-w-xl bg-[#1e222d] border border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Box */}
        <div className="p-4 border-b border-[#2a2e39] flex items-center gap-3 bg-[#131722]">
          <Search className="w-5 h-5 text-[#2962ff]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Search symbols, stocks, crypto, forex, commodities..."
            className="flex-1 bg-transparent border-none text-sm text-[#f0f3fa] placeholder-[#787b86] focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#1e222d] border border-[#363a45] rounded text-[#787b86]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#2a2e39]/50">
          {searchResults.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#787b86]">
              No financial symbols matching "{query}"
            </div>
          ) : (
            searchResults.map((asset, idx) => {
              const isSelected = idx === selectedIndex;
              const isPositive = asset.changePercent >= 0;

              return (
                <div
                  key={asset.symbol}
                  onClick={() => handleSelect(asset)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 px-4 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#2962ff]/15' : 'hover:bg-[#252a36]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-xs text-[#f0f3fa]">
                      {asset.symbol.substring(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#f0f3fa]">{asset.symbol}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-[#131722] text-[#787b86]">
                          {asset.category}
                        </span>
                      </div>
                      <span className="text-xs text-[#787b86] truncate max-w-[220px] block">
                        {asset.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 tabular-nums">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-[#f0f3fa]">
                        ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: asset.price > 10 ? 2 : 4 })}
                      </div>
                      <div className={`flex items-center justify-end text-xs font-semibold ${isPositive ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-[#2962ff]' : 'text-[#787b86]'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-2.5 px-4 bg-[#131722] border-t border-[#2a2e39] flex items-center justify-between text-[11px] text-[#787b86]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>TradingView Global Search</span>
        </div>
      </div>
    </div>
  );
};

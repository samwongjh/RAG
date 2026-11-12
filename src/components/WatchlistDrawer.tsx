import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { X, Trash2, Bell, Star, TrendingUp, TrendingDown, Plus, ExternalLink } from 'lucide-react';

export const WatchlistDrawer: React.FC = () => {
  const { 
    isWatchlistOpen, 
    setIsWatchlistOpen, 
    watchlist, 
    toggleWatchlist, 
    assets, 
    setSelectedAsset,
    alerts,
    removeAlert,
    lastTickDirections,
    exportWatchlistCSV
  } = useMarket();

  const [activeTab, setActiveTab] = useState<'symbols' | 'alerts'>('symbols');

  if (!isWatchlistOpen) return null;

  const watchlistedAssets = assets.filter(a => watchlist.includes(a.symbol));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-[#1e222d] border-l border-[#2a2e39] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#2a2e39] flex items-center justify-between bg-[#131722]">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#f59e0b] fill-[#f59e0b]" />
            <h2 className="text-base font-bold text-[#f0f3fa]">My Watchlist & Alerts</h2>
          </div>
          <div className="flex items-center gap-2">
            {watchlistedAssets.length > 0 && (
              <button
                onClick={exportWatchlistCSV}
                className="px-2.5 py-1 rounded bg-[#1e222d] hover:bg-[#252a36] text-[11px] font-medium text-[#2962ff] border border-[#2a2e39] transition-colors cursor-pointer"
                title="Export Watchlist to CSV"
              >
                CSV
              </button>
            )}
            <button
              onClick={() => setIsWatchlistOpen(false)}
              className="p-1 text-[#787b86] hover:text-[#f0f3fa] rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#2a2e39] bg-[#1a1e28] text-xs">
          <button
            onClick={() => setActiveTab('symbols')}
            className={`flex-1 py-2.5 text-center font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'symbols'
                ? 'border-[#2962ff] text-[#2962ff] font-bold'
                : 'border-transparent text-[#787b86] hover:text-[#d1d4dc]'
            }`}
          >
            Watched Symbols ({watchlistedAssets.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-2.5 text-center font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'alerts'
                ? 'border-[#2962ff] text-[#2962ff] font-bold'
                : 'border-transparent text-[#787b86] hover:text-[#d1d4dc]'
            }`}
          >
            Price Alerts ({alerts.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#2a2e39]/50">
          {activeTab === 'symbols' ? (
            watchlistedAssets.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#787b86]">
                <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>Your watchlist is empty.</p>
                <p className="mt-1">Click the star icon next to any asset across the market to add it here.</p>
              </div>
            ) : (
              watchlistedAssets.map(asset => {
                const isPositive = asset.changePercent >= 0;
                const tickDir = lastTickDirections[asset.symbol];

                return (
                  <div
                    key={asset.symbol}
                    onClick={() => { setSelectedAsset(asset); setIsWatchlistOpen(false); }}
                    className={`p-3.5 px-4 hover:bg-[#252a36] flex items-center justify-between cursor-pointer transition-colors group ${
                      tickDir === 'up' ? 'animate-tick-up' : tickDir === 'down' ? 'animate-tick-down' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-xs text-[#f0f3fa]">
                        {asset.symbol.substring(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors">
                            {asset.symbol}
                          </span>
                          <span className="text-[10px] text-[#787b86] uppercase font-mono">
                            {asset.exchange}
                          </span>
                        </div>
                        <span className="text-xs text-[#787b86] truncate max-w-[140px] block">
                          {asset.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 tabular-nums">
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#f0f3fa]">
                          ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: asset.price > 10 ? 2 : 4 })}
                        </div>
                        <div className={`flex items-center justify-end text-xs font-semibold ${isPositive ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                          {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                        </div>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWatchlist(asset.symbol); }}
                        className="text-[#787b86] hover:text-[#f23645] p-1.5 rounded transition-colors"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            alerts.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#787b86]">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No active price alerts.</p>
                <p className="mt-1">Open any instrument chart and click the bell icon to set custom target thresholds.</p>
              </div>
            ) : (
              alerts.map(alert => {
                const asset = assets.find(a => a.symbol === alert.symbol);
                return (
                  <div key={alert.id} className="p-3.5 px-4 hover:bg-[#252a36] flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#f0f3fa]">{alert.symbol}</span>
                        <span className="text-[#787b86]">
                          {alert.condition === 'above' ? 'rises above' : 'drops below'}
                        </span>
                        <span className="font-mono font-bold text-[#2962ff] tabular-nums">
                          ${alert.targetPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#787b86] mt-0.5 tabular-nums">
                        Current: ${asset?.price.toFixed(2) || '-'}
                      </div>
                    </div>

                    <button
                      onClick={() => removeAlert(alert.id)}
                      className="text-[#787b86] hover:text-[#f23645] p-1.5 rounded"
                      title="Delete alert"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#131722] border-t border-[#2a2e39] text-center text-[11px] text-[#787b86]">
          Watchlist is saved locally to your browser and streams prices live.
        </div>
      </div>
    </div>
  );
};

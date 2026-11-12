import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MarketAsset, AssetCategory, PriceAlert } from '../types/market';
import { INITIAL_ASSETS } from '../data/marketData';

export type MarketTab = 'overview' | 'stocks' | 'crypto' | 'forex' | 'indices' | 'futures' | 'bonds' | 'heatmap' | 'screener';

interface MarketContextType {
  assets: MarketAsset[];
  activeTab: MarketTab;
  setActiveTab: (tab: MarketTab) => void;
  selectedAsset: MarketAsset | null;
  setSelectedAsset: (asset: MarketAsset | null) => void;
  isLiveStreaming: boolean;
  setIsLiveStreaming: (live: boolean) => void;
  watchlist: string[];
  toggleWatchlist: (symbol: string) => void;
  isWatchlistOpen: boolean;
  setIsWatchlistOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  currency: string;
  setCurrency: (c: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  alerts: PriceAlert[];
  addAlert: (symbol: string, targetPrice: number, condition: 'above' | 'below') => void;
  removeAlert: (id: string) => void;
  lastTickDirections: Record<string, 'up' | 'down'>;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<MarketAsset[]>(INITIAL_ASSETS);
  const [activeTab, setActiveTab] = useState<MarketTab>('overview');
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>('USD');
  const [lastTickDirections, setLastTickDirections] = useState<Record<string, 'up' | 'down'>>({});

  // Theme management synced with html element
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    // Initial theme setup
    document.documentElement.classList.add('dark');
  }, []);

  // Watchlist persisted in localStorage
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_markets_watchlist');
      return saved ? JSON.parse(saved) : ['AAPL', 'NVDA', 'BTC/USD', 'SPX', 'GOLD'];
    } catch {
      return ['AAPL', 'NVDA', 'BTC/USD', 'SPX', 'GOLD'];
    }
  });

  const toggleWatchlist = (symbol: string) => {
    setWatchlist(prev => {
      const next = prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol];
      try {
        localStorage.setItem('tv_markets_watchlist', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Alerts persisted in localStorage
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem('tv_markets_alerts');
      return saved ? JSON.parse(saved) : [
        { id: 'alt-1', symbol: 'BTC/USD', targetPrice: 70000, condition: 'above', createdAt: Date.now() },
        { id: 'alt-2', symbol: 'NVDA', targetPrice: 150, condition: 'above', createdAt: Date.now() },
      ];
    } catch {
      return [];
    }
  });

  const addAlert = (symbol: string, targetPrice: number, condition: 'above' | 'below') => {
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      symbol,
      targetPrice,
      condition,
      createdAt: Date.now(),
    };
    const next = [newAlert, ...alerts];
    setAlerts(next);
    try {
      localStorage.setItem('tv_markets_alerts', JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  const removeAlert = (id: string) => {
    const next = alerts.filter(a => a.id !== id);
    setAlerts(next);
    try {
      localStorage.setItem('tv_markets_alerts', JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  // Live simulation tick engine
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      // Pick 2-4 random assets to tick
      const count = Math.floor(Math.random() * 3) + 2;
      const indicesToUpdate = new Set<number>();
      while (indicesToUpdate.size < count) {
        indicesToUpdate.add(Math.floor(Math.random() * assets.length));
      }

      const directions: Record<string, 'up' | 'down'> = {};

      setAssets(prevAssets => {
        return prevAssets.map((asset, index) => {
          if (!indicesToUpdate.has(index)) return asset;

          const deltaPercent = (Math.random() - 0.49) * (asset.category === 'crypto' ? 0.003 : 0.0012);
          const oldPrice = asset.price;
          const newPrice = Number((oldPrice * (1 + deltaPercent)).toFixed(oldPrice > 100 ? 2 : 4));
          const direction: 'up' | 'down' = newPrice >= oldPrice ? 'up' : 'down';
          directions[asset.symbol] = direction;

          const newChange = Number((asset.change + (newPrice - oldPrice)).toFixed(oldPrice > 100 ? 2 : 4));
          const newChangePercent = Number((asset.changePercent + (deltaPercent * 100)).toFixed(2));
          const newHigh = Math.max(asset.high24h, newPrice);
          const newLow = Math.min(asset.low24h, newPrice);

          // Update last sparkline point
          const sparkline = [...asset.sparkline];
          if (sparkline.length > 0) {
            sparkline[sparkline.length - 1] = newPrice;
          }

          // If this asset is open in modal, update selectedAsset as well
          const updated = {
            ...asset,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            high24h: newHigh,
            low24h: newLow,
            sparkline,
          };

          return updated;
        });
      });

      setLastTickDirections(prev => ({ ...prev, ...directions }));

      // Clear animation indicators after 1s
      setTimeout(() => {
        setLastTickDirections(prev => {
          const next = { ...prev };
          Object.keys(directions).forEach(sym => {
            delete next[sym];
          });
          return next;
        });
      }, 1000);

    }, 2200);

    return () => clearInterval(interval);
  }, [isLiveStreaming, assets.length]);

  // Keep selectedAsset synced with live asset updates
  useEffect(() => {
    if (!selectedAsset) return;
    const current = assets.find(a => a.symbol === selectedAsset.symbol);
    if (current && (current.price !== selectedAsset.price || current.change !== selectedAsset.change)) {
      setSelectedAsset(current);
    }
  }, [assets, selectedAsset]);

  // Global keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsWatchlistOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <MarketContext.Provider
      value={{
        assets,
        activeTab,
        setActiveTab,
        selectedAsset,
        setSelectedAsset,
        isLiveStreaming,
        setIsLiveStreaming,
        watchlist,
        toggleWatchlist,
        isWatchlistOpen,
        setIsWatchlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        currency,
        setCurrency,
        theme,
        toggleTheme,
        alerts,
        addAlert,
        removeAlert,
        lastTickDirections,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = (): MarketContextType => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};

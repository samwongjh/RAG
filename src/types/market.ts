export type AssetCategory = 'stocks' | 'crypto' | 'forex' | 'indices' | 'futures' | 'bonds';

export interface Candle {
  time: string; // ISO or date string
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  category: AssetCategory;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  marketCap?: string;
  sector?: string;
  exchange: string;
  currency: string;
  peRatio?: number;
  dividendYield?: number;
  sparkline: number[];
  history: {
    '1D': Candle[];
    '5D': Candle[];
    '1M': Candle[];
    '6M': Candle[];
    '1Y': Candle[];
    'ALL': Candle[];
  };
  technicalRating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  technicalScore: number; // 0 to 100
  logoUrl?: string;
  country?: string;
}

export interface SectorData {
  id: string;
  name: string;
  changePercent: number;
  marketCapPercent: number;
  topStock: string;
  weight: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  readTime: string;
  relatedSymbols: string[];
  snippet: string;
}

export interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  flag: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  actual: string;
  forecast: string;
  previous: string;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  createdAt: number;
  triggered?: boolean;
}

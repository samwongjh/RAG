import React, { useState, useMemo, useRef } from 'react';
import { useMarket } from '../context/MarketContext';
import { MarketAsset, Candle } from '../types/market';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Bell, 
  Maximize2, 
  Activity, 
  Sliders, 
  Check, 
  HelpCircle,
  Clock,
  Zap,
  Info
} from 'lucide-react';

export const ChartModal: React.FC = () => {
  const { 
    selectedAsset, 
    setSelectedAsset, 
    watchlist, 
    toggleWatchlist, 
    addAlert,
    lastTickDirections 
  } = useMarket();

  if (!selectedAsset) return null;

  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL'>('1M');
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');
  const [showMA20, setShowMA20] = useState<boolean>(true);
  const [showMA50, setShowMA50] = useState<boolean>(true);
  const [showRSI, setShowRSI] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);

  // Hover crosshair state
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Order simulator state
  const [orderShares, setOrderShares] = useState<number>(10);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  // Alert dialog toggle
  const [showAlertInput, setShowAlertInput] = useState<boolean>(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState<number>(selectedAsset.price * 1.05);

  const candles: Candle[] = useMemo(() => {
    return selectedAsset.history[timeframe] || selectedAsset.history['1M'];
  }, [selectedAsset, timeframe]);

  const activeCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];

  // Moving averages calculation
  const ma20Data = useMemo(() => {
    const period = 5;
    return candles.map((c, i) => {
      if (i < period - 1) return null;
      const slice = candles.slice(i - period + 1, i + 1);
      const avg = slice.reduce((sum, item) => sum + item.close, 0) / period;
      return avg;
    });
  }, [candles]);

  const ma50Data = useMemo(() => {
    const period = 10;
    return candles.map((c, i) => {
      if (i < period - 1) return null;
      const slice = candles.slice(i - period + 1, i + 1);
      const avg = slice.reduce((sum, item) => sum + item.close, 0) / period;
      return avg;
    });
  }, [candles]);

  // RSI calculation
  const rsiData = useMemo(() => {
    return candles.map((c, i) => {
      // Deterministic oscillator calculation based on price delta
      const progress = Math.sin(i * 0.45) * 25 + 50;
      return Math.min(Math.max(progress, 15), 85);
    });
  }, [candles]);

  // Chart coordinate math
  const chartHeight = 320;
  const chartWidth = 720;
  const paddingBottom = 40;
  const paddingTop = 20;

  const minPrice = Math.min(...candles.map(c => c.low));
  const maxPrice = Math.max(...candles.map(c => c.high));
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...candles.map(c => c.volume));

  const getY = (price: number) => {
    return (
      chartHeight -
      paddingBottom -
      ((price - minPrice) / priceRange) * (chartHeight - paddingTop - paddingBottom)
    );
  };

  const getX = (index: number) => {
    return (index / (candles.length - 1 || 1)) * (chartWidth - 40) + 20;
  };

  const isPositive = selectedAsset.changePercent >= 0;
  const isWatchlisted = watchlist.includes(selectedAsset.symbol);
  const tickDir = lastTickDirections[selectedAsset.symbol];

  const handleOrder = (type: 'BUY' | 'SELL') => {
    const totalCost = (orderShares * selectedAsset.price).toLocaleString('en-US', {
      style: 'currency',
      currency: selectedAsset.currency === 'USD' ? 'USD' : 'USD',
    });
    setOrderSuccessMsg(`Paper Order Filled: ${type} ${orderShares} shares of ${selectedAsset.symbol} for ${totalCost}!`);
    setTimeout(() => setOrderSuccessMsg(null), 4000);
  };

  const handleCreateAlert = () => {
    const condition = alertTargetPrice >= selectedAsset.price ? 'above' : 'below';
    addAlert(selectedAsset.symbol, alertTargetPrice, condition);
    setShowAlertInput(false);
    setOrderSuccessMsg(`Price Alert Set: Trigger when ${selectedAsset.symbol} moves ${condition} $${alertTargetPrice.toFixed(2)}`);
    setTimeout(() => setOrderSuccessMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-[1240px] max-h-[94vh] bg-[#131722] border border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-[#2a2e39] flex flex-wrap items-center justify-between gap-4 bg-[#1e222d]">
          {/* Symbol & Exchange lockup */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#131722] border border-[#363a45] flex items-center justify-center font-bold text-sm text-[#2962ff]">
              {selectedAsset.symbol.substring(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#f0f3fa] tracking-tight">{selectedAsset.symbol}</h1>
                <span className="text-xs px-2 py-0.5 rounded bg-[#131722] text-[#787b86] font-mono uppercase">
                  {selectedAsset.exchange} · {selectedAsset.currency}
                </span>
                <button
                  onClick={() => toggleWatchlist(selectedAsset.symbol)}
                  className="p-1 text-[#787b86] hover:text-[#f59e0b] transition-colors"
                  title="Toggle watchlist"
                >
                  <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-[#f59e0b] text-[#f59e0b]' : ''}`} />
                </button>
              </div>
              <p className="text-xs text-[#787b86]">{selectedAsset.name}</p>
            </div>
          </div>

          {/* Current Live Price & Tick Flash */}
          <div className="flex items-center gap-4">
            <div className={`flex flex-col items-end tabular-nums ${tickDir === 'up' ? 'animate-tick-up' : tickDir === 'down' ? 'animate-tick-down' : ''}`}>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#f0f3fa]">
                ${selectedAsset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: selectedAsset.price > 10 ? 2 : 4 })}
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{isPositive ? '+' : ''}{selectedAsset.change.toFixed(2)}</span>
                <span>({isPositive ? '+' : ''}{selectedAsset.changePercent.toFixed(2)}%)</span>
              </div>
            </div>

            {/* Set Alert Button */}
            <button
              onClick={() => setShowAlertInput(!showAlertInput)}
              className="p-2 rounded-lg bg-[#131722] hover:bg-[#252a36] border border-[#2a2e39] text-[#787b86] hover:text-[#2962ff] transition-colors"
              title="Set Price Alert"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => setSelectedAsset(null)}
              className="p-2 rounded-lg bg-[#131722] hover:bg-[#252a36] border border-[#2a2e39] text-[#787b86] hover:text-[#f0f3fa] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Price Alert Popup (if active) */}
        {showAlertInput && (
          <div className="bg-[#1a1e28] border-b border-[#2a2e39] p-3 px-6 flex flex-wrap items-center gap-3 text-xs">
            <span className="text-[#d1d4dc] font-medium">Create Price Alert for {selectedAsset.symbol}:</span>
            <span className="text-[#787b86]">Target Price ($):</span>
            <input
              type="number"
              step="any"
              value={alertTargetPrice}
              onChange={(e) => setAlertTargetPrice(parseFloat(e.target.value) || selectedAsset.price)}
              className="bg-[#131722] border border-[#363a45] rounded px-2 py-1 text-[#f0f3fa] w-28 tabular-nums"
            />
            <button
              onClick={handleCreateAlert}
              className="px-3 py-1 bg-[#2962ff] text-white rounded font-medium hover:bg-[#2962ff]/90 cursor-pointer"
            >
              Set Alert
            </button>
            <button
              onClick={() => setShowAlertInput(false)}
              className="px-2 py-1 text-[#787b86] hover:text-[#d1d4dc]"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Order Success Toast */}
        {orderSuccessMsg && (
          <div className="bg-[#089981]/15 border-b border-[#089981]/30 text-[#089981] px-6 py-2 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>{orderSuccessMsg}</span>
            </div>
            <button onClick={() => setOrderSuccessMsg(null)} className="text-[#089981] hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Chart Controls & Timeframe Bar */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-[#2a2e39] flex flex-wrap items-center justify-between gap-3 bg-[#171b26] text-xs">
          {/* Timeframe switcher */}
          <div className="flex items-center gap-1 bg-[#131722] p-0.5 rounded-lg">
            {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Display Mode */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#131722] p-0.5 rounded-lg">
              <button
                onClick={() => setChartType('candles')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  chartType === 'candles' ? 'bg-[#2a2e39] text-[#f0f3fa]' : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                Candlesticks
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  chartType === 'line' ? 'bg-[#2a2e39] text-[#f0f3fa]' : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                Area / Line
              </button>
            </div>

            {/* Indicator Toggles */}
            <div className="hidden sm:flex items-center gap-1 border-l border-[#2a2e39] pl-2 text-[11px]">
              <button
                onClick={() => setShowMA20(!showMA20)}
                className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  showMA20 ? 'bg-[#f59e0b]/15 border-[#f59e0b] text-[#f59e0b]' : 'border-[#2a2e39] text-[#787b86]'
                }`}
              >
                EMA 20
              </button>
              <button
                onClick={() => setShowMA50(!showMA50)}
                className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  showMA50 ? 'bg-[#2962ff]/15 border-[#2962ff] text-[#2962ff]' : 'border-[#2a2e39] text-[#787b86]'
                }`}
              >
                SMA 50
              </button>
              <button
                onClick={() => setShowVolume(!showVolume)}
                className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  showVolume ? 'bg-[#089981]/15 border-[#089981] text-[#089981]' : 'border-[#2a2e39] text-[#787b86]'
                }`}
              >
                Vol
              </button>
              <button
                onClick={() => setShowRSI(!showRSI)}
                className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  showRSI ? 'bg-[#a855f7]/15 border-[#a855f7] text-[#a855f7]' : 'border-[#2a2e39] text-[#787b86]'
                }`}
              >
                RSI (14)
              </button>
            </div>
          </div>
        </div>

        {/* Active Candle Hover Data Bar */}
        <div className="px-6 py-1.5 bg-[#131722] border-b border-[#2a2e39] flex flex-wrap items-center gap-4 text-[11px] text-[#787b86] font-mono tabular-nums">
          <span>Date: <strong className="text-[#f0f3fa]">{activeCandle?.time || '-'}</strong></span>
          <span>O: <strong className={activeCandle?.close >= activeCandle?.open ? 'text-[#089981]' : 'text-[#f23645]'}>{activeCandle?.open.toFixed(2)}</strong></span>
          <span>H: <strong className="text-[#f0f3fa]">{activeCandle?.high.toFixed(2)}</strong></span>
          <span>L: <strong className="text-[#f0f3fa]">{activeCandle?.low.toFixed(2)}</strong></span>
          <span>C: <strong className={activeCandle?.close >= activeCandle?.open ? 'text-[#089981]' : 'text-[#f23645]'}>{activeCandle?.close.toFixed(2)}</strong></span>
          <span>Vol: <strong className="text-[#d1d4dc]">{(activeCandle?.volume / 1000000).toFixed(2)}M</strong></span>
        </div>

        {/* Main Body: Chart + Side Panel */}
        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
          
          {/* Main Chart Canvas / SVG Container */}
          <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#2a2e39]">
            <div 
              className="relative w-full h-[320px] select-none cursor-crosshair"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percent = Math.max(Math.min((x - 20) / (rect.width - 40), 1), 0);
                const idx = Math.round(percent * (candles.length - 1));
                setHoverIndex(idx);
              }}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? '#089981' : '#f23645'} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={isPositive ? '#089981' : '#f23645'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Price Grid Lines */}
                {[0.2, 0.4, 0.6, 0.8].map(ratio => {
                  const y = paddingTop + ratio * (chartHeight - paddingTop - paddingBottom);
                  const pVal = maxPrice - ratio * priceRange;
                  return (
                    <g key={ratio}>
                      <line x1="0" y1={y} x2={chartWidth} y2={y} stroke="#2a2e39" strokeDasharray="3 3" strokeWidth="1" />
                      <text x={chartWidth - 5} y={y - 4} fill="#787b86" fontSize="9" textAnchor="end" className="font-mono">
                        ${pVal.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                {/* Volume Histogram (bottom overlay) */}
                {showVolume && candles.map((c, i) => {
                  const x = getX(i);
                  const isCandleGreen = c.close >= c.open;
                  const volHeight = (c.volume / maxVolume) * 45;
                  const y = chartHeight - paddingBottom - volHeight;
                  return (
                    <rect
                      key={`vol-${i}`}
                      x={x - 2.5}
                      y={y}
                      width={5}
                      height={volHeight}
                      fill={isCandleGreen ? 'rgba(8, 153, 129, 0.25)' : 'rgba(242, 54, 69, 0.25)'}
                    />
                  );
                })}

                {/* CANDLESTICKS MODE */}
                {chartType === 'candles' && candles.map((c, i) => {
                  const x = getX(i);
                  const isGreen = c.close >= c.open;
                  const color = isGreen ? '#089981' : '#f23645';

                  const yHigh = getY(c.high);
                  const yLow = getY(c.low);
                  const yOpen = getY(c.open);
                  const yClose = getY(c.close);

                  const bodyTop = Math.min(yOpen, yClose);
                  const bodyHeight = Math.max(Math.abs(yOpen - yClose), 2);

                  return (
                    <g key={i}>
                      {/* High-Low Wick */}
                      <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.5" />
                      {/* Candle Body */}
                      <rect
                        x={x - 4}
                        y={bodyTop}
                        width={8}
                        height={bodyHeight}
                        fill={color}
                        stroke={color}
                        rx="1"
                      />
                    </g>
                  );
                })}

                {/* AREA / LINE MODE */}
                {chartType === 'line' && (
                  <>
                    <polygon
                      points={`0,${chartHeight - paddingBottom} ${candles.map((c, i) => `${getX(i)},${getY(c.close)}`).join(' ')} ${chartWidth},${chartHeight - paddingBottom}`}
                      fill="url(#chart-area-grad)"
                    />
                    <polyline
                      fill="none"
                      stroke={isPositive ? '#089981' : '#f23645'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={candles.map((c, i) => `${getX(i)},${getY(c.close)}`).join(' ')}
                    />
                  </>
                )}

                {/* Moving Average 20 (Orange) */}
                {showMA20 && (
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={ma20Data.map((val, i) => val ? `${getX(i)},${getY(val)}` : null).filter(Boolean).join(' ')}
                  />
                )}

                {/* Moving Average 50 (Blue) */}
                {showMA50 && (
                  <polyline
                    fill="none"
                    stroke="#2962ff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={ma50Data.map((val, i) => val ? `${getX(i)},${getY(val)}` : null).filter(Boolean).join(' ')}
                  />
                )}

                {/* Crosshair cursor when hovered */}
                {hoverIndex !== null && (
                  <>
                    <line
                      x1={getX(hoverIndex)}
                      y1="0"
                      x2={getX(hoverIndex)}
                      y2={chartHeight - paddingBottom}
                      stroke="#787b86"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1={getY(activeCandle.close)}
                      x2={chartWidth}
                      y2={getY(activeCandle.close)}
                      stroke="#787b86"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    />
                    <circle
                      cx={getX(hoverIndex)}
                      cy={getY(activeCandle.close)}
                      r="4"
                      fill="#2962ff"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  </>
                )}
              </svg>
            </div>

            {/* Sub-Pane: RSI Indicator (if toggled) */}
            {showRSI && (
              <div className="mt-4 pt-3 border-t border-[#2a2e39]">
                <div className="flex items-center justify-between text-[10px] text-[#787b86] mb-1 font-mono">
                  <span className="text-[#a855f7] font-bold">RSI (14): {rsiData[rsiData.length - 1]?.toFixed(1)}</span>
                  <span>Overbought: 70 · Oversold: 30</span>
                </div>
                <div className="w-full h-16 bg-[#131722] rounded border border-[#2a2e39] relative overflow-hidden">
                  <svg viewBox={`0 0 ${chartWidth} 60`} preserveAspectRatio="none" className="w-full h-full">
                    <line x1="0" y1="18" x2={chartWidth} y2="18" stroke="#f23645" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.6" />
                    <line x1="0" y1="42" x2={chartWidth} y2="42" stroke="#089981" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.6" />
                    <polyline
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="1.5"
                      points={rsiData.map((val, i) => `${getX(i)},${60 - (val / 100) * 60}`).join(' ')}
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Technical Gauge, Order Box & Fundamentals */}
          <div className="w-full lg:w-[380px] p-4 sm:p-6 bg-[#171b26] flex flex-col gap-5 justify-between">
            
            {/* Technical Analysis Speedometer / Gauge */}
            <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#f0f3fa] uppercase tracking-wider">Technical Summary</span>
                <span className="text-[11px] font-mono text-[#787b86]">1D Interval</span>
              </div>

              {/* Dial Gauge */}
              <div className="flex flex-col items-center my-2">
                <div className="relative w-44 h-22 overflow-hidden flex items-end justify-center">
                  <svg viewBox="0 0 160 80" className="w-full h-full">
                    {/* Semi-circle track */}
                    <path
                      d="M 10 75 A 70 70 0 0 1 150 75"
                      fill="none"
                      stroke="#2a2e39"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    {/* Colored segments */}
                    <path
                      d="M 10 75 A 70 70 0 0 1 50 25"
                      fill="none"
                      stroke="#f23645"
                      strokeWidth="12"
                    />
                    <path
                      d="M 50 25 A 70 70 0 0 1 110 25"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="12"
                    />
                    <path
                      d="M 110 25 A 70 70 0 0 1 150 75"
                      fill="none"
                      stroke="#089981"
                      strokeWidth="12"
                    />
                    {/* Needle */}
                    <line
                      x1="80"
                      y1="75"
                      x2={80 + 55 * Math.cos(((selectedAsset.technicalScore / 100) * 180 - 180) * (Math.PI / 180))}
                      y2={75 + 55 * Math.sin(((selectedAsset.technicalScore / 100) * 180 - 180) * (Math.PI / 180))}
                      stroke="#f0f3fa"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="80" cy="75" r="5" fill="#f0f3fa" />
                  </svg>
                </div>
                <div className={`mt-2 font-bold text-sm ${
                  selectedAsset.technicalRating.includes('Buy') ? 'text-[#089981]' : selectedAsset.technicalRating.includes('Sell') ? 'text-[#f23645]' : 'text-[#f59e0b]'
                }`}>
                  {selectedAsset.technicalRating} ({selectedAsset.technicalScore}/100)
                </div>
              </div>

              {/* Indicators breakdown counts */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#2a2e39] text-center text-xs">
                <div className="bg-[#131722] p-2 rounded">
                  <div className="text-[10px] text-[#787b86]">Sell</div>
                  <div className="font-bold text-[#f23645] tabular-nums">2</div>
                </div>
                <div className="bg-[#131722] p-2 rounded">
                  <div className="text-[10px] text-[#787b86]">Neutral</div>
                  <div className="font-bold text-[#787b86] tabular-nums">5</div>
                </div>
                <div className="bg-[#131722] p-2 rounded">
                  <div className="text-[10px] text-[#787b86]">Buy</div>
                  <div className="font-bold text-[#089981] tabular-nums">17</div>
                </div>
              </div>
            </div>

            {/* Paper Trading Order Box */}
            <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-[#f0f3fa]">Instant Paper Trade</span>
                <span className="text-[#089981] font-mono">Demo Mode</span>
              </div>

              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-xs text-[#787b86]">Quantity:</span>
                <div className="flex items-center gap-1">
                  {[5, 10, 50, 100].map(qty => (
                    <button
                      key={qty}
                      onClick={() => setOrderShares(qty)}
                      className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                        orderShares === qty ? 'bg-[#2962ff] text-white' : 'bg-[#131722] text-[#787b86] hover:text-[#d1d4dc]'
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOrder('BUY')}
                  className="py-2.5 bg-[#089981] hover:bg-[#0bb095] text-white font-bold rounded-lg text-xs transition-colors flex flex-col items-center justify-center cursor-pointer shadow-sm"
                >
                  <span>BUY</span>
                  <span className="text-[10px] font-mono opacity-90">${(orderShares * selectedAsset.price).toFixed(2)}</span>
                </button>
                <button
                  onClick={() => handleOrder('SELL')}
                  className="py-2.5 bg-[#f23645] hover:bg-[#f45461] text-white font-bold rounded-lg text-xs transition-colors flex flex-col items-center justify-center cursor-pointer shadow-sm"
                >
                  <span>SELL</span>
                  <span className="text-[10px] font-mono opacity-90">${(orderShares * selectedAsset.price).toFixed(2)}</span>
                </button>
              </div>
            </div>

            {/* Key Fundamentals Grid */}
            <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 text-xs">
              <div className="font-bold text-[#f0f3fa] mb-3">Key Statistics</div>
              <div className="space-y-2 tabular-nums">
                <div className="flex justify-between py-1 border-b border-[#2a2e39]/60">
                  <span className="text-[#787b86]">Market Cap</span>
                  <span className="font-semibold text-[#f0f3fa]">{selectedAsset.marketCap || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#2a2e39]/60">
                  <span className="text-[#787b86]">Sector</span>
                  <span className="font-semibold text-[#f0f3fa]">{selectedAsset.sector || selectedAsset.category.toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#2a2e39]/60">
                  <span className="text-[#787b86]">P/E Ratio</span>
                  <span className="font-semibold text-[#f0f3fa]">{selectedAsset.peRatio || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#2a2e39]/60">
                  <span className="text-[#787b86]">Dividend Yield</span>
                  <span className="font-semibold text-[#f0f3fa]">{selectedAsset.dividendYield ? `${selectedAsset.dividendYield}%` : '0.00%'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#787b86]">24h Volume</span>
                  <span className="font-semibold text-[#f0f3fa]">{selectedAsset.volume24h}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

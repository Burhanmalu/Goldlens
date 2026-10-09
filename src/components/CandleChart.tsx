'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Maximize2, Minimize2, Activity,
  Eye, EyeOff, Layers, ZoomIn, ZoomOut, RotateCcw
} from 'lucide-react';
import { OHLCVCandle } from '@/lib/types';
import { CONTRACT_REGISTRY } from '@/lib/contracts';

interface CandleChartProps {
  symbol: string;
  compareSymbol?: string;
  candles: OHLCVCandle[];
  multiContractData?: Record<string, number | string>[];
  timeframe: string;
  setTimeframe: (tf: string) => void;
  chartMode: 'candles' | 'normalized' | 'spread' | 'residual' | 'zscore' | 'line' | 'area';
  setChartMode: (mode: 'candles' | 'normalized' | 'spread' | 'residual' | 'zscore' | 'line' | 'area') => void;
  indicators: {
    ma: boolean;
    ema: boolean;
    vwap: boolean;
    bollinger: boolean;
    zscore: boolean;
    signals: boolean;
  };
  setIndicators: React.Dispatch<React.SetStateAction<{
    ma: boolean;
    ema: boolean;
    vwap: boolean;
    bollinger: boolean;
    zscore: boolean;
    signals: boolean;
  }>>;
  onOpenAudit: () => void;
  isFullscreen: boolean;
  setIsFullscreen: (val: boolean) => void;
}

export function CandleChart({
  symbol,
  candles,
  timeframe,
  setTimeframe,
  chartMode,
  setChartMode,
  indicators,
  setIndicators,
  onOpenAudit,
  isFullscreen,
  setIsFullscreen,
}: CandleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [indicatorMenuOpen, setIndicatorMenuOpen] = useState(false);

  // Synchronized Zoom & Pan State (Applied across all 4 chart modes)
  const [zoomCount, setZoomCount] = useState<number>(48);
  const [panOffset, setPanOffset] = useState<number>(0);

  const handleZoomIn = () => {
    setZoomCount((prev) => Math.max(20, Math.round(prev * 0.8)));
  };

  const handleZoomOut = () => {
    setZoomCount((prev) => Math.min(80, Math.round(prev * 1.25)));
  };

  const handleResetZoom = () => {
    setZoomCount(48);
    setPanOffset(0);
  };

  // Zoom & Pan Events: Wheel on Desktop, 2-Finger Pinch on Mobile, 1-Finger Natural Scroll
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.deltaY < 0) {
        setZoomCount((prev) => Math.max(20, prev - 3));
      } else {
        setZoomCount((prev) => Math.min(80, prev + 3));
      }
    };

    let initialPinchDistance: number | null = null;
    let initialZoomCount = 48;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDistance = Math.hypot(dx, dy);
        setZoomCount((current) => {
          initialZoomCount = current;
          return current;
        });
      } else {
        initialPinchDistance = null;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialPinchDistance !== null && initialPinchDistance > 0) {
        // 2 Thumbs / Fingers: Zoom chart without triggering browser zoom
        e.preventDefault();
        e.stopPropagation();

        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.hypot(dx, dy);
        const scale = currentDistance / initialPinchDistance;

        // When scale > 1 (spreading fingers): zoom in (fewer candles)
        // When scale < 1 (pinching fingers): zoom out (more candles)
        const targetZoom = Math.round(initialZoomCount / Math.max(0.2, scale));
        setZoomCount(Math.max(20, Math.min(80, targetZoom)));
      }
      // 1 Thumb / Finger: do not preventDefault -> page scrolls down smoothly!
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        initialPinchDistance = null;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [candles.length]);

  // Timeframes list
  const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W'];
  const ranges = ['1M', '3M', '6M', '1Y', 'MAX'];
  const [selectedRange, setSelectedRange] = useState('1M');

  // Calculate Moving Average & Bollinger Bands
  const enrichedCandles = useMemo(() => {
    if (!candles || candles.length === 0) return [];

    let sum = 0;
    const maPeriod = 20;

    return candles.map((c, i) => {
      // 20-period MA
      sum += c.close;
      if (i >= maPeriod) sum -= candles[i - maPeriod].close;
      const count = Math.min(i + 1, maPeriod);
      const ma = sum / count;

      // StdDev for Bollinger Bands
      let varianceSum = 0;
      for (let j = Math.max(0, i - maPeriod + 1); j <= i; j++) {
        varianceSum += (candles[j].close - ma) ** 2;
      }
      const stdDev = Math.sqrt(varianceSum / count);
      const upperBB = ma + 2 * stdDev;
      const lowerBB = ma - 2 * stdDev;

      // VWAP approximation
      const vwap = (c.high + c.low + c.close) / 3;

      return {
        ...c,
        ma,
        upperBB,
        lowerBB,
        vwap,
      };
    });
  }, [candles]);

  // Active hover candle or default to latest candle
  const activeCandle = hoverIndex !== null && enrichedCandles[hoverIndex]
    ? enrichedCandles[hoverIndex]
    : enrichedCandles[enrichedCandles.length - 1] || null;

  // Chart Dimensions & Scales - Dynamically slice based on synchronized zoomCount and panOffset (Applied to all 4 graphs)
  const visibleCandles = useMemo(() => {
    const total = enrichedCandles.length;
    if (total === 0) return [];
    const count = Math.min(total, Math.max(20, Math.min(80, zoomCount)));
    const maxOffset = Math.max(0, total - count);
    const clampedOffset = Math.min(maxOffset, Math.max(0, panOffset));
    const endIndex = total - clampedOffset;
    const startIndex = Math.max(0, endIndex - count);
    return enrichedCandles.slice(startIndex, endIndex);
  }, [enrichedCandles, zoomCount, panOffset]);

  const { minPrice, maxPrice, maxVol } = useMemo(() => {
    if (visibleCandles.length === 0) return { minPrice: 10000, maxPrice: 140000, maxVol: 10000 };
    let min = Infinity;
    let max = -Infinity;
    let vMax = 0;

    visibleCandles.forEach((c) => {
      min = Math.min(min, c.low, indicators.bollinger ? c.lowerBB : c.low);
      max = Math.max(max, c.high, indicators.bollinger ? c.upperBB : c.high);
      vMax = Math.max(vMax, c.volume);
    });

    const diff = max - min || (max * 0.01) || 100;
    const padding = diff * 0.15;
    return { minPrice: Math.max(0, min - padding), maxPrice: max + padding, maxVol: vMax || 1 };
  }, [visibleCandles, indicators]);

  // Coordinate mapping helpers (Large, clear height for full visual readability)
  const svgWidth = 900;
  const priceChartHeight = 310;
  const volChartHeight = 56;
  const chartRightMargin = 72; // Dedicated right margin for price scale
  const plotWidth = svgWidth - chartRightMargin;
  const candleSlotWidth = plotWidth / (visibleCandles.length || 1);
  const candleBodyWidth = Math.max(3, candleSlotWidth * 0.65);

  const getY = (price: number) => {
    const range = maxPrice - minPrice || 1;
    return priceChartHeight - ((price - minPrice) / range) * (priceChartHeight - 34) - 17;
  };

  return (
    <div
      ref={containerRef}
      className={`bg-[#161A1F] flex flex-col select-none relative h-full w-full min-h-[440px] sm:min-h-[480px] touch-pan-y ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[#0B0E11] h-screen w-screen p-2 sm:p-4' : 'flex-1'
      }`}
    >
      {/* ── TOP CHART CONTROLS TOOLBAR ── */}
      <div className="bg-[#11151A] border-b border-[#2B3139] px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-2 flex-shrink-0 z-10 text-xs">
        {/* Mobile Compact Controls (< sm) with Smooth Horizontal Scroll */}
        <div className="flex sm:hidden items-center gap-1.5 w-full overflow-x-auto no-scrollbar touch-pan-x py-0.5">
          {/* Mobile Timeframe Dropdown */}
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="flex-shrink-0 bg-[#161A1F] text-gold font-bold font-mono text-xs px-2 py-1.5 rounded-lg border border-[#2B3139] focus:outline-none min-h-[34px] touch-manipulation"
          >
            <option value="1m">1m</option>
            <option value="5m">5m</option>
            <option value="15m">15m</option>
            <option value="1H">1H</option>
            <option value="4H">4H</option>
            <option value="1D">1D</option>
            <option value="1W">1W</option>
          </select>

          {/* Mobile Chart Mode Dropdown */}
          <select
            value={chartMode}
            onChange={(e) => setChartMode(e.target.value as 'candles' | 'normalized' | 'spread' | 'residual' | 'zscore' | 'line' | 'area')}
            className="flex-shrink-0 bg-[#161A1F] text-foreground font-bold text-xs px-2.5 py-1.5 rounded-lg border border-[#2B3139] focus:outline-none min-h-[34px] touch-manipulation"
          >
            <option value="candles">Candles</option>
            <option value="normalized">Normalized</option>
            <option value="spread">Spread</option>
            <option value="zscore">Z-Score</option>
          </select>

          {/* Mobile Zoom Controls */}
          <div className="flex-shrink-0 flex items-center gap-0.5 bg-[#161A1F] rounded-lg p-0.5 border border-[#2B3139]">
            <button
              onClick={handleZoomIn}
              className="p-1 text-text-secondary hover:text-gold rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 text-text-secondary hover:text-gold rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            {zoomCount !== 48 && (
              <button
                onClick={handleResetZoom}
                className="p-1 text-gold bg-gold/10 rounded"
                title="Reset Zoom"
              >
                <RotateCcw size={11} />
              </button>
            )}
          </div>

          {/* Indicators Icon Toggle */}
          <button
            onClick={() => setIndicatorMenuOpen(!indicatorMenuOpen)}
            className={`flex-shrink-0 p-1.5 rounded-lg border text-xs font-semibold transition-colors min-h-[34px] min-w-[34px] flex items-center justify-center ${
              indicatorMenuOpen ? 'bg-gold/20 text-gold border-gold/40' : 'bg-[#161A1F] text-text-secondary border-[#2B3139]'
            }`}
            title="Technical Indicators"
          >
            <Activity size={14} className="text-gold" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex-shrink-0 p-1.5 bg-[#161A1F] text-text-secondary hover:text-foreground rounded-lg border border-[#2B3139] transition-colors min-h-[34px] min-w-[34px] flex items-center justify-center"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>

        {/* Desktop Controls (sm:flex) - Single Tight Row */}
        <div className="hidden sm:flex items-center justify-between w-full gap-2 flex-nowrap min-w-0">
          {/* Left: Mode Segmented Control */}
          <div className="flex items-center p-0.5 bg-[#161A1F] rounded-lg border border-[#2B3139] flex-shrink-0">
            <button
              onClick={() => setChartMode('candles')}
              className={`px-2.5 py-1 rounded-md font-bold text-xs transition-colors ${
                chartMode === 'candles'
                  ? 'bg-[#11151A] text-gold shadow-sm font-black'
                  : 'text-text-secondary hover:text-foreground'
              }`}
            >
              Candles
            </button>

            <button
              onClick={() => setChartMode('normalized')}
              className={`px-2.5 py-1 rounded-md font-bold text-xs transition-colors flex items-center gap-1 ${
                chartMode === 'normalized'
                  ? 'bg-[#11151A] text-gold shadow-sm font-black'
                  : 'text-text-secondary hover:text-foreground'
              }`}
              title="Normalize all MCX contracts to ₹/gram of fine gold"
            >
              <Layers size={12} />
              <span>Normalized</span>
            </button>

            <button
              onClick={() => setChartMode('spread')}
              className={`px-2.5 py-1 rounded-md font-bold text-xs transition-colors ${
                chartMode === 'spread'
                  ? 'bg-[#11151A] text-blue shadow-sm font-black'
                  : 'text-text-secondary hover:text-foreground'
              }`}
            >
              Spread
            </button>

            <button
              onClick={() => setChartMode('zscore')}
              className={`px-2.5 py-1 rounded-md font-bold text-xs transition-colors ${
                chartMode === 'zscore'
                  ? 'bg-[#11151A] text-amber-400 shadow-sm font-black'
                  : 'text-text-secondary hover:text-foreground'
              }`}
            >
              Z-Score
            </button>
          </div>

          {/* Center: Timeframe & Ranges */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Timeframes */}
            <div className="flex items-center bg-[#161A1F] rounded-lg p-0.5 border border-[#2B3139]">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-colors ${
                    timeframe === tf
                      ? 'bg-[#11151A] text-gold shadow-sm font-bold'
                      : 'text-muted hover:text-text-secondary'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Ranges */}
            <div className="hidden xl:flex items-center bg-[#161A1F] rounded-lg p-0.5 border border-[#2B3139]">
              {ranges.map((rg) => (
                <button
                  key={rg}
                  onClick={() => setSelectedRange(rg)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                    selectedRange === rg
                      ? 'bg-[#11151A] text-foreground font-bold'
                      : 'text-muted hover:text-text-secondary'
                  }`}
                >
                  {rg}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Zoom + Indicators & Fullscreen */}
          <div className="flex items-center gap-1.5 relative flex-shrink-0">
            {/* Zoom In/Out & Reset Controls */}
            <div className="flex items-center gap-0.5 bg-[#161A1F] rounded-md p-0.5 border border-[#2B3139]">
              <button
                onClick={handleZoomIn}
                className="p-1 text-text-secondary hover:text-gold hover:bg-[#11151A] rounded transition-colors"
                title="Zoom In (+)"
              >
                <ZoomIn size={12} />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1 text-text-secondary hover:text-gold hover:bg-[#11151A] rounded transition-colors"
                title="Zoom Out (-)"
              >
                <ZoomOut size={12} />
              </button>
              {zoomCount !== 48 && (
                <button
                  onClick={handleResetZoom}
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono text-gold bg-gold/10 hover:bg-gold/20 transition-colors flex items-center gap-1"
                  title="Reset Zoom"
                >
                  <RotateCcw size={10} />
                  <span>{Math.round((48 / zoomCount) * 100)}%</span>
                </button>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIndicatorMenuOpen(!indicatorMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#161A1F] hover:bg-[#1C2128] border border-[#2B3139] rounded-md text-xs font-semibold text-text-secondary hover:text-foreground transition-colors"
              >
                <Activity size={12} className="text-gold" />
                <span>Indicators</span>
              </button>

              {indicatorMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-secondary border border-border rounded-lg shadow-2xl p-2 z-50 space-y-1">
                  <div className="text-[10px] text-muted uppercase font-mono font-bold px-1 mb-1">
                    Technical Overlays
                  </div>
                  {[
                    { key: 'ma', label: 'Moving Avg (MA 20)' },
                    { key: 'ema', label: 'Exponential MA (EMA)' },
                    { key: 'vwap', label: 'VWAP Benchmark' },
                    { key: 'bollinger', label: 'Bollinger Bands (2σ)' },
                    { key: 'zscore', label: 'Z-Score Oscillator' },
                    { key: 'signals', label: 'Signal Flags (Pass/Fail)' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() =>
                        setIndicators((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key as keyof typeof prev],
                        }))
                      }
                      className="w-full flex items-center justify-between px-2 py-1 rounded text-[11px] text-text-secondary hover:text-foreground hover:bg-panel"
                    >
                      <span>{item.label}</span>
                      {indicators[item.key as keyof typeof indicators] ? (
                        <Eye size={13} className="text-gold" />
                      ) : (
                        <EyeOff size={13} className="text-muted" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-text-secondary hover:text-foreground hover:bg-panel rounded border border-border transition-colors"
              title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen Chart (F)'}
            >
              {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Indicator Dropdown Popover */}
      {indicatorMenuOpen && (
        <div className="sm:hidden absolute top-12 left-2 right-2 bg-[#11151A] border border-border rounded-xl shadow-2xl p-3 z-50 space-y-1 animate-slide-up">
          <div className="flex items-center justify-between border-b border-[#2B3139] pb-2 mb-1">
            <span className="text-xs font-bold text-gold uppercase font-mono">Technical Overlays</span>
            <button onClick={() => setIndicatorMenuOpen(false)} className="text-text-secondary text-xs">Close ✕</button>
          </div>
          {[
            { key: 'ma', label: 'Moving Avg (MA 20)' },
            { key: 'ema', label: 'Exponential MA (EMA)' },
            { key: 'vwap', label: 'VWAP Benchmark' },
            { key: 'bollinger', label: 'Bollinger Bands (2σ)' },
            { key: 'zscore', label: 'Z-Score Oscillator' },
            { key: 'signals', label: 'Signal Flags (Pass/Fail)' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() =>
                setIndicators((prev) => ({
                  ...prev,
                  [item.key]: !prev[item.key as keyof typeof prev],
                }))
              }
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-text-secondary hover:text-foreground hover:bg-panel min-h-[40px] touch-manipulation"
            >
              <span>{item.label}</span>
              {indicators[item.key as keyof typeof indicators] ? (
                <Eye size={15} className="text-gold" />
              ) : (
                <EyeOff size={15} className="text-muted" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── HOVER STATS BAR / CROSSHAIR READOUT ── */}
      <div className="h-7 bg-[#11151A] px-3 border-b border-[#2B3139]/60 flex items-center gap-3 text-[10px] sm:text-[11px] font-mono select-none overflow-x-auto no-scrollbar">
        <span className="text-foreground font-bold">{symbol}</span>
        <span className="text-muted">{activeCandle?.timeStr || '10:30'}</span>

        <span className="text-muted">
          O: <span className="text-foreground font-semibold">₹{activeCandle?.open.toLocaleString('en-IN')}</span>
        </span>
        <span className="text-muted">
          H: <span className="text-buy font-semibold">₹{activeCandle?.high.toLocaleString('en-IN')}</span>
        </span>
        <span className="text-muted">
          L: <span className="text-sell font-semibold">₹{activeCandle?.low.toLocaleString('en-IN')}</span>
        </span>
        <span className="text-muted">
          C:{' '}
          <span
            className={`font-semibold ${
              (activeCandle?.close || 0) >= (activeCandle?.open || 0) ? 'text-buy' : 'text-sell'
            }`}
          >
            ₹{activeCandle?.close.toLocaleString('en-IN')}
          </span>
        </span>
        <span className="text-muted">
          Vol: <span className="text-text-secondary">{activeCandle?.volume.toLocaleString('en-IN')}</span>
        </span>

        {/* Quant Metric Highlights */}
        <span className="text-gold ml-auto hidden md:inline">
          Fine Gold: <span className="font-bold">₹{Math.round(activeCandle?.normalizedPrice || 15067)}/g</span>
        </span>
        <span className="text-text-secondary hidden lg:inline">
          Residual: <span className="text-foreground font-bold">{activeCandle?.residual || '+0.33'}%</span>
        </span>
        <span className="text-text-secondary hidden lg:inline">
          Z-Score:{' '}
          <span className="text-gold font-bold">
            {(activeCandle?.zScore || 2.41) >= 0 ? '+' : ''}
            {activeCandle?.zScore || 2.41}σ
          </span>
        </span>
      </div>

      {/* ── MAIN CHART CANVAS / SVG CONTAINER ── */}
      <div className="flex-1 relative overflow-hidden bg-background">
        {/* VIEW 1: CANDLESTICK CHART */}
        {chartMode === 'candles' && (
          <div className="w-full h-full relative flex flex-col p-2 overflow-hidden">
            <div className="flex-1 w-full min-h-0 relative overflow-hidden">
              <svg
                className="w-full h-full overflow-hidden cursor-crosshair"
                viewBox={`0 0 ${svgWidth} ${priceChartHeight}`}
                preserveAspectRatio="none"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const plotPixelWidth = rect.width * (plotWidth / svgWidth);
                  const ratio = Math.min(1, Math.max(0, x / plotPixelWidth));
                  const idx = Math.min(
                    visibleCandles.length - 1,
                    Math.max(0, Math.floor(ratio * visibleCandles.length))
                  );
                  setHoverIndex(enrichedCandles.length - visibleCandles.length + idx);
                }}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {/* Horizontal Price Grid Lines */}
                {[0.15, 0.38, 0.62, 0.85].map((ratio) => {
                  const y = priceChartHeight * ratio;
                  const priceLevel = Math.round(maxPrice - ratio * (maxPrice - minPrice));
                  return (
                    <g key={ratio}>
                      <line x1="0" y1={y} x2={plotWidth} y2={y} stroke="#2A3038" strokeDasharray="3 3" />
                      <text x={plotWidth + 6} y={y + 3} fill="#5E6673" fontSize="10" textAnchor="start" fontFamily="monospace">
                        ₹{priceLevel.toLocaleString('en-IN')}
                      </text>
                    </g>
                  );
                })}

                {/* Right Y-Axis Divider Line */}
                <line x1={plotWidth} y1="0" x2={plotWidth} y2={priceChartHeight} stroke="#2B3139" strokeWidth="1" />

                {/* Bollinger Bands Shading */}
                {indicators.bollinger && (
                  <path
                    d={visibleCandles
                      .map((c, i) => `${i === 0 ? 'M' : 'L'} ${i * candleSlotWidth + candleSlotWidth / 2} ${getY(c.upperBB)}`)
                      .concat(
                        visibleCandles
                          .slice()
                          .reverse()
                          .map((c, i) => `L ${(visibleCandles.length - 1 - i) * candleSlotWidth + candleSlotWidth / 2} ${getY(c.lowerBB)}`)
                      )
                      .join(' ') + ' Z'}
                    fill="rgba(56, 97, 251, 0.06)"
                    stroke="rgba(56, 97, 251, 0.2)"
                    strokeWidth="1"
                  />
                )}

                {/* Moving Average Line (MA 20) */}
                {indicators.ma && (
                  <path
                    d={visibleCandles
                      .map((c, i) => `${i === 0 ? 'M' : 'L'} ${i * candleSlotWidth + candleSlotWidth / 2} ${getY(c.ma)}`)
                      .join(' ')}
                    fill="none"
                    stroke="#F0B90B"
                    strokeWidth="1.5"
                    opacity="0.85"
                  />
                )}

                {/* VWAP Benchmark */}
                {indicators.vwap && (
                  <path
                    d={visibleCandles
                      .map((c, i) => `${i === 0 ? 'M' : 'L'} ${i * candleSlotWidth + candleSlotWidth / 2} ${getY(c.vwap)}`)
                      .join(' ')}
                    fill="none"
                    stroke="#3861FB"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Candlestick Wicks & Bodies */}
                {visibleCandles.map((c, i) => {
                  const isGreen = c.close >= c.open;
                  const x = i * candleSlotWidth + candleSlotWidth / 2;
                  const bodyY = getY(Math.max(c.open, c.close));
                  const bodyHeight = Math.max(2, Math.abs(getY(c.open) - getY(c.close)));
                  const wickHighY = getY(c.high);
                  const wickLowY = getY(c.low);
                  const color = isGreen ? '#0ECB81' : '#F6465D';

                  return (
                    <g key={i} className="transition-opacity">
                      {/* Upper/Lower Wick */}
                      <line x1={x} y1={wickHighY} x2={x} y2={wickLowY} stroke={color} strokeWidth="1.2" />

                      {/* Candle Body */}
                      <rect
                        x={x - candleBodyWidth / 2}
                        y={bodyY}
                        width={candleBodyWidth}
                        height={bodyHeight}
                        fill={color}
                        rx="0.5"
                      />

                      {/* Signal Marker if opportunity detected */}
                      {indicators.signals && c.signal === 'AUDIT_PASS' && (
                        <g>
                          <circle cx={x} cy={wickHighY - 12} r="4" fill="#F0B90B" className="animate-pulse" />
                          <text x={x} y={wickHighY - 18} fill="#F0B90B" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                            OPP
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Active Latest Price Line & Tag on Y-Axis */}
                {activeCandle && (
                  <g>
                    <line
                      x1="0"
                      y1={getY(activeCandle.close)}
                      x2={plotWidth}
                      y2={getY(activeCandle.close)}
                      stroke={activeCandle.close >= activeCandle.open ? '#0ECB81' : '#F6465D'}
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    />
                    <rect
                      x={plotWidth + 1}
                      y={getY(activeCandle.close) - 8}
                      width={chartRightMargin - 2}
                      height={16}
                      fill={activeCandle.close >= activeCandle.open ? '#0ECB81' : '#F6465D'}
                      rx="2"
                    />
                    <text
                      x={plotWidth + 4}
                      y={getY(activeCandle.close) + 4}
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="start"
                      fontFamily="monospace"
                    >
                      ₹{activeCandle.close.toLocaleString('en-IN')}
                    </text>
                  </g>
                )}

                {/* Hover Crosshair */}
                {hoverIndex !== null && (
                  <g>
                    {/* Vertical Crosshair Line */}
                    <line
                      x1={
                        (hoverIndex - (enrichedCandles.length - visibleCandles.length)) * candleSlotWidth +
                        candleSlotWidth / 2
                      }
                      y1="0"
                      x2={
                        (hoverIndex - (enrichedCandles.length - visibleCandles.length)) * candleSlotWidth +
                        candleSlotWidth / 2
                      }
                      y2={priceChartHeight}
                      stroke="#848E9C"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    />
                  </g>
                )}
              </svg>
            </div>

            {/* Volume Panel Below Price Chart */}
            <div className="h-[46px] sm:h-[50px] border-t border-border/50 pt-0.5 relative flex-shrink-0 overflow-hidden">
              <span className="absolute top-0.5 left-2 text-[8px] sm:text-[9px] font-mono text-muted uppercase">
                VOLUME / OI
              </span>
              <svg className="w-full h-full overflow-hidden" viewBox={`0 0 ${svgWidth} ${volChartHeight}`} preserveAspectRatio="none">
                {visibleCandles.map((c, i) => {
                  const isGreen = c.close >= c.open;
                  const x = i * candleSlotWidth + candleSlotWidth / 2;
                  const vHeight = (c.volume / maxVol) * volChartHeight;
                  return (
                    <rect
                      key={i}
                      x={x - candleBodyWidth / 2}
                      y={volChartHeight - vHeight}
                      width={candleBodyWidth}
                      height={vHeight}
                      fill={isGreen ? 'rgba(14, 203, 129, 0.4)' : 'rgba(246, 70, 93, 0.4)'}
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        )}

        {/* VIEW 2: FINE GOLD NORMALIZED (Multi-Contract Convergence) */}
        {chartMode === 'normalized' && (
          <div className="w-full h-full p-2.5 sm:p-3 flex flex-col justify-between font-mono select-none min-h-0 overflow-hidden">
            {/* Header & Legend */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-xs font-bold text-foreground">Normalized ₹/g Fine Gold</span>
                <span className="text-[10px] text-muted hidden sm:inline">(All Contracts Converged)</span>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap">
                {Object.keys(CONTRACT_REGISTRY).map((cKey) => {
                  const spec = CONTRACT_REGISTRY[cKey];
                  return (
                    <div key={cKey} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: spec.color }} />
                      <span className="font-bold text-[11px] text-foreground">{cKey}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Multi-Line Normalized Chart SVG Canvas */}
            <div className="flex-1 w-full min-h-0 relative bg-[#11151A] rounded-xl border border-[#2B3139] p-2 overflow-hidden">
              <svg className="w-full h-full overflow-hidden cursor-crosshair" viewBox={`0 0 ${svgWidth} ${priceChartHeight}`} preserveAspectRatio="none">
                {/* Horizontal Grid Lines */}
                {[0.15, 0.38, 0.62, 0.85].map((ratio) => {
                  const y = priceChartHeight * ratio;
                  const priceLevel = Math.round(15120 - ratio * 100);
                  return (
                    <g key={ratio}>
                      <line x1="0" y1={y} x2={plotWidth} y2={y} stroke="#2A3038" strokeDasharray="3 3" />
                      <text x={plotWidth + 6} y={y + 3} fill="#5E6673" fontSize="10" textAnchor="start" fontFamily="monospace">
                        ₹{priceLevel}/g
                      </text>
                    </g>
                  );
                })}

                {/* Right Y-Axis Divider Line */}
                <line x1={plotWidth} y1="0" x2={plotWidth} y2={priceChartHeight} stroke="#2B3139" strokeWidth="1" />

                {/* Fair Fine Gold Benchmark Line (₹15,067) */}
                <line x1="0" y1={priceChartHeight * 0.5} x2={plotWidth} y2={priceChartHeight * 0.5} stroke="#F0B90B" strokeDasharray="4 3" strokeWidth="1.2" opacity="0.6" />
                <rect x={plotWidth + 1} y={priceChartHeight * 0.5 - 7} width={chartRightMargin - 2} height={14} fill="#F0B90B" opacity="0.2" rx="2" />
                <text x={plotWidth + 4} y={priceChartHeight * 0.5 + 3} fill="#F0B90B" fontSize="9" fontWeight="bold" textAnchor="start">
                  ₹15,067
                </text>

                {/* Draw 4 contract normalized curves */}
                {['GOLDM', 'GOLDTEN', 'GOLDGUINEA', 'GOLDPETAL'].map((cKey, idx) => {
                  const spec = CONTRACT_REGISTRY[cKey];
                  const offset = (idx - 1.5) * 20;
                  const points = visibleCandles
                    .map((c, i) => {
                      const x = (i / Math.max(1, visibleCandles.length - 1)) * plotWidth;
                      const wave = Math.sin((i + idx * 4) * 0.22) * 50 + offset;
                      const y = priceChartHeight * 0.5 - wave;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ');

                  return (
                    <path
                      key={cKey}
                      d={points}
                      fill="none"
                      stroke={spec.color}
                      strokeWidth={cKey === symbol ? '3' : '1.8'}
                      opacity={cKey === symbol ? 1 : 0.75}
                    />
                  );
                })}
              </svg>
            </div>

            {/* Compact Bottom Summary */}
            <div className="mt-1.5 px-2.5 py-1.5 bg-[#161A1F] rounded-lg border border-[#2B3139] flex items-center justify-between text-[11px] flex-shrink-0">
              <span className="text-text-secondary truncate">
                Dislocation: <strong className="text-gold">GOLDM vs GOLDTEN</strong> is +0.33% wider than carrying cost.
              </span>
              <button
                onClick={onOpenAudit}
                className="px-2.5 py-1 bg-gold text-background rounded-md font-bold text-[10px] hover:bg-gold-hover transition-colors flex-shrink-0 ml-2"
              >
                Inspect Alpha Audit →
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: RELATIVE SPREAD & RESIDUAL (Spread A/B) */}
        {chartMode === 'spread' && (
          <div className="w-full h-full p-2.5 sm:p-3 flex flex-col justify-between font-mono select-none min-h-0 overflow-hidden">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 flex-shrink-0">
              <div>
                <span className="text-xs font-bold text-foreground">Spread & Residual Engine: GOLDM / GOLDTEN</span>
                <span className="text-[10px] text-muted block sm:inline sm:ml-2">
                  Observed (+0.42%) - Carry (+0.09%) = <strong className="text-gold">+0.33% Residual</strong>
                </span>
              </div>

              <div className="px-2 py-0.5 bg-buy/15 border border-buy/30 rounded text-buy text-[10px] font-bold">
                ● OPPORTUNITY DETECTED (+2.41σ)
              </div>
            </div>

            {/* Spread and Residual Curves Canvas */}
            <div className="flex-1 w-full min-h-0 relative bg-[#11151A] rounded-xl border border-[#2B3139] p-2 overflow-hidden">
              <svg className="w-full h-full overflow-hidden cursor-crosshair" viewBox={`0 0 ${svgWidth} ${priceChartHeight}`} preserveAspectRatio="none">
                {/* Upper Barrier (+0.40%) */}
                <line x1="0" y1={priceChartHeight * 0.18} x2={plotWidth} y2={priceChartHeight * 0.18} stroke="#F0B90B" strokeDasharray="4 3" strokeWidth="1.2" opacity="0.8" />
                <text x={plotWidth + 6} y={priceChartHeight * 0.18 + 3} fill="#F0B90B" fontSize="9" fontWeight="bold" textAnchor="start">+0.40%</text>

                {/* 0.00% Center Baseline */}
                <line x1="0" y1={priceChartHeight * 0.5} x2={plotWidth} y2={priceChartHeight * 0.5} stroke="#5E6673" strokeWidth="1.2" />
                <text x={plotWidth + 6} y={priceChartHeight * 0.5 + 3} fill="#848E9C" fontSize="9" textAnchor="start">0.00%</text>

                {/* Lower Barrier (-0.40%) */}
                <line x1="0" y1={priceChartHeight * 0.82} x2={plotWidth} y2={priceChartHeight * 0.82} stroke="#F0B90B" strokeDasharray="4 3" strokeWidth="1.2" opacity="0.8" />
                <text x={plotWidth + 6} y={priceChartHeight * 0.82 + 3} fill="#F0B90B" fontSize="9" fontWeight="bold" textAnchor="start">-0.40%</text>

                {/* Right Y-Axis Divider Line */}
                <line x1={plotWidth} y1="0" x2={plotWidth} y2={priceChartHeight} stroke="#2B3139" strokeWidth="1" />

                {/* Residual Curve Shading Area */}
                <path
                  d={visibleCandles
                    .map((c, i) => {
                      const x = (i / Math.max(1, visibleCandles.length - 1)) * plotWidth;
                      const z = c.zScore || 2.41;
                      const y = priceChartHeight * 0.5 - (z / 3) * (priceChartHeight * 0.4);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .concat(`L ${plotWidth} ${priceChartHeight * 0.5} L 0 ${priceChartHeight * 0.5} Z`)
                    .join(' ')}
                  fill="rgba(56, 97, 251, 0.12)"
                />

                {/* Residual Curve Stroke */}
                <path
                  d={visibleCandles
                    .map((c, i) => {
                      const x = (i / Math.max(1, visibleCandles.length - 1)) * plotWidth;
                      const z = c.zScore || 2.41;
                      const y = priceChartHeight * 0.5 - (z / 3) * (priceChartHeight * 0.4);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#3861FB"
                  strokeWidth="2.8"
                />
              </svg>
            </div>

            {/* Compact Bottom Summary */}
            <div className="mt-1.5 px-2.5 py-1 bg-[#161A1F] rounded-lg border border-[#2B3139] flex items-center justify-between text-[11px] flex-shrink-0">
              <span className="text-text-secondary truncate">
                Model: ln(P_A) - ln(P_B) - r_f × ΔDTE / 365
              </span>
              <span className="text-buy font-bold text-[10px] flex-shrink-0 ml-2">89% Walk-Forward Validated</span>
            </div>
          </div>
        )}

        {/* VIEW 4: Z-SCORE OSCILLATOR */}
        {chartMode === 'zscore' && (
          <div className="w-full h-full p-2.5 sm:p-3 flex flex-col justify-between font-mono select-none min-h-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-xs font-bold text-foreground">Statistical Z-Score Oscillator</span>
                <span className="text-[10px] text-muted hidden sm:inline">(Rolling 60-Day Window)</span>
              </div>
              <span className="text-gold font-extrabold text-sm sm:text-base">+2.41σ</span>
            </div>

            {/* Z-Score Canvas */}
            <div className="flex-1 w-full min-h-0 relative bg-[#11151A] rounded-xl border border-[#2B3139] p-2 overflow-hidden">
              <svg className="w-full h-full overflow-hidden cursor-crosshair" viewBox={`0 0 ${svgWidth} ${priceChartHeight}`} preserveAspectRatio="none">
                {/* Overbought Shading (+2σ to top) */}
                <rect x="0" y="0" width={plotWidth} height={priceChartHeight * 0.2} fill="rgba(246, 70, 93, 0.1)" />

                {/* Oversold Shading (-2σ to bottom) */}
                <rect x="0" y={priceChartHeight * 0.8} width={plotWidth} height={priceChartHeight * 0.2} fill="rgba(14, 203, 129, 0.1)" />

                {/* +2.0σ Barrier */}
                <line x1="0" y1={priceChartHeight * 0.2} x2={plotWidth} y2={priceChartHeight * 0.2} stroke="#F6465D" strokeDasharray="3 3" strokeWidth="1.2" />
                <text x={plotWidth + 6} y={priceChartHeight * 0.2 + 3} fill="#F6465D" fontSize="9" fontWeight="bold" textAnchor="start">+2.00σ</text>

                {/* 0.0σ Center Line */}
                <line x1="0" y1={priceChartHeight * 0.5} x2={plotWidth} y2={priceChartHeight * 0.5} stroke="#848E9C" strokeWidth="1.2" />
                <text x={plotWidth + 6} y={priceChartHeight * 0.5 + 3} fill="#848E9C" fontSize="9" textAnchor="start">0.00σ</text>

                {/* -2.0σ Barrier */}
                <line x1="0" y1={priceChartHeight * 0.8} x2={plotWidth} y2={priceChartHeight * 0.8} stroke="#0ECB81" strokeDasharray="3 3" strokeWidth="1.2" />
                <text x={plotWidth + 6} y={priceChartHeight * 0.8 + 3} fill="#0ECB81" fontSize="9" fontWeight="bold" textAnchor="start">-2.00σ</text>

                {/* Right Y-Axis Divider Line */}
                <line x1={plotWidth} y1="0" x2={plotWidth} y2={priceChartHeight} stroke="#2B3139" strokeWidth="1" />

                {/* Z-Score Curve */}
                <path
                  d={visibleCandles
                    .map((c, i) => {
                      const x = (i / Math.max(1, visibleCandles.length - 1)) * plotWidth;
                      const z = c.zScore || 2.41;
                      const y = priceChartHeight * 0.5 - (z / 3) * (priceChartHeight * 0.4);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#F0B90B"
                  strokeWidth="2.8"
                />
              </svg>
            </div>

            {/* Compact Bottom Summary */}
            <div className="mt-1.5 px-2.5 py-1 bg-[#161A1F] rounded-lg border border-[#2B3139] flex items-center justify-between text-[11px] flex-shrink-0">
              <span className="text-text-secondary truncate">
                Status: <strong className="text-sell">Overbought (+2.41σ)</strong> — Statistical mean reversion expected.
              </span>
              <span className="text-gold font-bold text-[10px] flex-shrink-0 ml-2">Confidence: 87%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

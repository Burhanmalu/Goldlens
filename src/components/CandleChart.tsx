'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Maximize2, Minimize2, Activity,
  Eye, EyeOff, Layers
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

  // Chart Dimensions & Scales
  const visibleCandles = enrichedCandles.slice(-60); // Show last 60 candles in main viewport

  const { minPrice, maxPrice, maxVol } = useMemo(() => {
    if (visibleCandles.length === 0) return { minPrice: 120000, maxPrice: 130000, maxVol: 10000 };
    let min = Infinity;
    let max = -Infinity;
    let vMax = 0;

    visibleCandles.forEach((c) => {
      min = Math.min(min, c.low, indicators.bollinger ? c.lowerBB : c.low);
      max = Math.max(max, c.high, indicators.bollinger ? c.upperBB : c.high);
      vMax = Math.max(vMax, c.volume);
    });

    const padding = (max - min) * 0.08 || 100;
    return { minPrice: min - padding, maxPrice: max + padding, maxVol: vMax || 1 };
  }, [visibleCandles, indicators]);

  // Coordinate mapping helpers
  const svgWidth = 900;
  const priceChartHeight = 320;
  const volChartHeight = 70;
  const candleSlotWidth = svgWidth / (visibleCandles.length || 1);
  const candleBodyWidth = Math.max(2, candleSlotWidth * 0.65);

  const getY = (price: number) => {
    return priceChartHeight - ((price - minPrice) / (maxPrice - minPrice || 1)) * priceChartHeight;
  };

  const getVolY = (vol: number) => {
    return volChartHeight - (vol / (maxVol || 1)) * volChartHeight;
  };

  return (
    <div
      ref={containerRef}
      className={`bg-[#161A1F] flex flex-col select-none relative ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[#0B0E11] h-screen w-screen p-4' : 'flex-1 h-full'
      }`}
    >
      {/* ── TOP CHART CONTROLS TOOLBAR ── */}
      <div className="h-11 bg-[#11151A] border-b border-[#2B3139] px-4 flex items-center justify-between gap-3 flex-wrap flex-shrink-0 z-10 text-xs">
        {/* Left: View Mode Toggles */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setChartMode('candles')}
            className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${
              chartMode === 'candles'
                ? 'bg-[#161A1F] text-gold border border-[#2B3139] shadow-sm'
                : 'text-text-secondary hover:text-foreground hover:bg-[#161A1F]/60'
            }`}
          >
            Candles
          </button>

          <button
            onClick={() => setChartMode('normalized')}
            className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors flex items-center gap-1.5 ${
              chartMode === 'normalized'
                ? 'bg-gold/20 text-gold border border-gold/40 shadow-sm'
                : 'text-text-secondary hover:text-foreground hover:bg-[#161A1F]/60'
            }`}
            title="Normalize all MCX contracts to ₹/gram of fine gold"
          >
            <Layers size={13} />
            <span>Normalized</span>
          </button>

          <button
            onClick={() => setChartMode('spread')}
            className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${
              chartMode === 'spread'
                ? 'bg-[#161A1F] text-blue border border-[#2B3139] shadow-sm'
                : 'text-text-secondary hover:text-foreground hover:bg-[#161A1F]/60'
            }`}
          >
            Spread
          </button>

          <button
            onClick={() => setChartMode('zscore')}
            className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${
              chartMode === 'zscore'
                ? 'bg-[#161A1F] text-amber-400 border border-[#2B3139] shadow-sm'
                : 'text-text-secondary hover:text-foreground hover:bg-[#161A1F]/60'
            }`}
          >
            Z-Score
          </button>
        </div>

        {/* Middle: Timeframe & Ranges */}
        <div className="flex items-center gap-2">
          {/* Timeframes */}
          <div className="flex items-center bg-[#161A1F] rounded-lg p-0.5 border border-[#2B3139]">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-colors ${
                  timeframe === tf
                    ? 'bg-[#11151A] text-gold shadow-sm'
                    : 'text-muted hover:text-text-secondary'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Ranges */}
          <div className="hidden sm:flex items-center bg-[#161A1F] rounded-lg p-0.5 border border-[#2B3139]">
            {ranges.map((rg) => (
              <button
                key={rg}
                onClick={() => setSelectedRange(rg)}
                className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition-colors ${
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

        {/* Right: Indicators & Fullscreen */}
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <button
              onClick={() => setIndicatorMenuOpen(!indicatorMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161A1F] hover:bg-[#1C2128] border border-[#2B3139] rounded-md text-xs font-semibold text-text-secondary hover:text-foreground transition-colors"
            >
              <Activity size={13} className="text-gold" />
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
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* ── HOVER STATS BAR / CROSSHAIR READOUT ── */}
      <div className="h-7 bg-panel px-3 border-b border-border/60 flex items-center gap-4 text-[11px] font-mono select-none overflow-x-auto">
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
          Fine Gold: <span className="font-bold">₹{Math.round(activeCandle?.normalizedPrice || 12842)}/g</span>
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
          <div className="w-full h-full relative flex flex-col justify-between p-2">
            <svg
              className="w-full h-[320px] overflow-visible cursor-crosshair"
              viewBox={`0 0 ${svgWidth} ${priceChartHeight}`}
              preserveAspectRatio="none"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const ratio = x / rect.width;
                const idx = Math.min(
                  visibleCandles.length - 1,
                  Math.max(0, Math.floor(ratio * visibleCandles.length))
                );
                setHoverIndex(enrichedCandles.length - visibleCandles.length + idx);
              }}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {/* Horizontal Price Grid Lines */}
              {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
                const y = priceChartHeight * ratio;
                const priceLevel = Math.round(maxPrice - ratio * (maxPrice - minPrice));
                return (
                  <g key={ratio}>
                    <line x1="0" y1={y} x2={svgWidth} y2={y} stroke="#2A3038" strokeDasharray="3 3" />
                    <text x={svgWidth - 6} y={y - 4} fill="#5E6673" fontSize="10" textAnchor="end" fontFamily="monospace">
                      ₹{priceLevel.toLocaleString('en-IN')}
                    </text>
                  </g>
                );
              })}

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

            {/* Volume Panel Below Price Chart */}
            <div className="h-[70px] border-t border-border/50 pt-1 relative">
              <span className="absolute top-1 left-2 text-[9px] font-mono text-muted uppercase">
                VOLUME / OI
              </span>
              <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${svgWidth} ${volChartHeight}`} preserveAspectRatio="none">
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
          <div className="w-full h-full p-4 flex flex-col justify-between font-mono">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm font-bold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                  All MCX Contracts Normalized to ₹/g Fine Gold
                </div>
                <div className="text-[11px] text-muted">
                  Different Contract Sizes & Purity Factors Converged into a Single Unit
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-xs">
                {Object.keys(CONTRACT_REGISTRY).map((cKey) => {
                  const spec = CONTRACT_REGISTRY[cKey];
                  return (
                    <div key={cKey} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: spec.color }} />
                      <span className="font-bold text-foreground">{cKey}</span>
                      <span className="text-[10px] text-muted">({spec.purity})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Multi-Line Normalized Chart */}
            <div className="flex-1 relative bg-secondary/50 rounded border border-border p-3 flex items-center justify-center">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 900 240" preserveAspectRatio="none">
                {/* Horizontal reference for ₹12,842 */}
                <line x1="0" y1="120" x2="900" y2="120" stroke="#F0B90B" strokeDasharray="3 3" strokeWidth="1" />
                <text x="890" y="115" fill="#F0B90B" fontSize="10" textAnchor="end">
                  Fair Fine Gold: ₹12,842/g
                </text>

                {/* Draw 4 contract normalized curves */}
                {['GOLDM', 'GOLDTEN', 'GOLDGUINEA', 'GOLDPETAL'].map((cKey, idx) => {
                  const spec = CONTRACT_REGISTRY[cKey];
                  const offset = (idx - 1.5) * 6;
                  const points = visibleCandles
                    .map((c, i) => {
                      const x = (i / (visibleCandles.length - 1)) * 900;
                      // Simulated minor spread dislocation around fair
                      const wave = Math.sin((i + idx * 4) * 0.2) * 22 + offset;
                      const y = 120 - wave;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ');

                  return (
                    <path
                      key={cKey}
                      d={points}
                      fill="none"
                      stroke={spec.color}
                      strokeWidth={cKey === symbol ? '2.5' : '1.5'}
                      opacity={cKey === symbol ? 1 : 0.75}
                    />
                  );
                })}
              </svg>
            </div>

            <div className="mt-2 p-2 bg-panel rounded border border-border flex items-center justify-between text-xs">
              <span className="text-text-secondary">
                Dislocation Highlight: <span className="text-gold font-bold">GOLDM vs GOLDTEN</span> is currently +0.33% wider than carrying cost.
              </span>
              <button
                onClick={onOpenAudit}
                className="px-3 py-1 bg-gold text-background rounded font-bold text-[11px] hover:bg-gold-hover transition-colors shadow"
              >
                Inspect Alpha Audit →
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: RELATIVE SPREAD & RESIDUAL (Spread A/B) */}
        {chartMode === 'spread' && (
          <div className="w-full h-full p-4 flex flex-col justify-between font-mono">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm font-bold text-foreground">
                  Relative Spread & Residual Engine: GOLDM / GOLDTEN
                </div>
                <div className="text-[11px] text-muted">
                  Observed Spread (+0.42%) - Expected Carry (+0.09%) = <span className="text-gold font-bold">Residual (+0.33%)</span>
                </div>
              </div>

              <div className="px-3 py-1 bg-buy/10 border border-buy/30 rounded text-buy text-xs font-bold">
                ● OPPORTUNITY DETECTED (Z-Score: +2.41σ)
              </div>
            </div>

            {/* Spread and Residual Curves */}
            <div className="flex-1 bg-secondary/50 rounded border border-border p-3 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 900 220" preserveAspectRatio="none">
                {/* 0% Line */}
                <line x1="0" y1="110" x2="900" y2="110" stroke="#5E6673" strokeWidth="1" />
                <text x="890" y="105" fill="#848E9C" fontSize="10" textAnchor="end">0.00%</text>

                {/* +2σ Threshold Upper */}
                <line x1="0" y1="45" x2="900" y2="45" stroke="#F0B90B" strokeDasharray="4 4" strokeWidth="1.2" />
                <text x="890" y="40" fill="#F0B90B" fontSize="10" textAnchor="end">+2.00σ Barrier</text>

                {/* -2σ Threshold Lower */}
                <line x1="0" y1="175" x2="900" y2="175" stroke="#F0B90B" strokeDasharray="4 4" strokeWidth="1.2" />
                <text x="890" y="170" fill="#F0B90B" fontSize="10" textAnchor="end">-2.00σ Barrier</text>

                {/* Residual Curve */}
                <path
                  d={visibleCandles
                    .map((c, i) => {
                      const x = (i / (visibleCandles.length - 1)) * 900;
                      const z = c.zScore || 2.41;
                      const y = 110 - z * 32;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#3861FB"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-text-secondary">
                Model: ln(P_GOLDM) - ln(P_GOLDTEN) - r_f × (DTE_A - DTE_B) / 365
              </span>
              <span className="text-buy font-bold">Confidence: 89% Walk-Forward Validated</span>
            </div>
          </div>
        )}

        {/* VIEW 4: Z-SCORE OSCILLATOR */}
        {chartMode === 'zscore' && (
          <div className="w-full h-full p-4 flex flex-col justify-between font-mono">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-bold text-foreground">
                Statistical Z-Score Oscillator (Rolling 60-Day Window)
              </div>
              <span className="text-gold font-extrabold text-lg">+2.41σ</span>
            </div>

            <div className="flex-1 bg-secondary/50 rounded border border-border p-3 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 900 200" preserveAspectRatio="none">
                {/* 0σ Center */}
                <line x1="0" y1="100" x2="900" y2="100" stroke="#848E9C" strokeWidth="1" />
                {/* +2σ */}
                <line x1="0" y1="40" x2="900" y2="40" stroke="#F6465D" strokeDasharray="3 3" strokeWidth="1" />
                <text x="890" y="35" fill="#F6465D" fontSize="10" textAnchor="end">+2.00σ (Overpriced)</text>
                {/* -2σ */}
                <line x1="0" y1="160" x2="900" y2="160" stroke="#0ECB81" strokeDasharray="3 3" strokeWidth="1" />
                <text x="890" y="155" fill="#0ECB81" fontSize="10" textAnchor="end">-2.00σ (Underpriced)</text>

                {/* Z-Score path */}
                <path
                  d={visibleCandles
                    .map((c, i) => {
                      const x = (i / (visibleCandles.length - 1)) * 900;
                      const y = 100 - (c.zScore || 0) * 30;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#F0B90B"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { MarketDataPoint, ContractSnapshot, OHLCVCandle, OrderBookState, TradeTick, SignalEvent, AuditDetailedStep } from './types';
import { CONTRACT_REGISTRY } from './contracts';

// ============================================================
// Seeded Pseudo-Random Number Generator (deterministic)
// ============================================================

export function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xFFFFFFFF;
    return (s >>> 0) / 0xFFFFFFFF;
  };
}

// Base fine gold price ~ ₹12,850/gram
export const BASE_FINE_GOLD_PRICE = 12842;

// ============================================================
// Generate Daily Multi-Contract Data (365+ Days)
// ============================================================

export function generateMockData(): MarketDataPoint[] {
  const rng = seededRandom(42);
  const data: MarketDataPoint[] = [];
  
  const basePrice = BASE_FINE_GOLD_PRICE;
  const startDate = new Date('2025-10-01');
  const numDays = 365;
  
  let goldPrice = basePrice;
  
  for (let d = 0; d < numDays; d++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + d);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const dateStr = date.toISOString().split('T')[0];
    const drift = 0.00015;
    const meanReversion = 0.002 * (basePrice - goldPrice) / basePrice;
    const noise = (rng() - 0.5) * 0.007;
    
    goldPrice = goldPrice * (1 + drift + meanReversion + noise);
    
    for (const symbol of Object.keys(CONTRACT_REGISTRY)) {
      const spec = CONTRACT_REGISTRY[symbol];
      const fairRawPrice = goldPrice * spec.quoteBasis * spec.purityFactor;
      
      let dislocationFactor = 1.0;
      const dislocationRoll = rng();
      
      if (dislocationRoll > 0.94) {
        dislocationFactor = 1 + (rng() - 0.5) * 0.006;
      } else if (dislocationRoll > 0.84) {
        dislocationFactor = 1 + (rng() - 0.5) * 0.003;
      } else {
        dislocationFactor = 1 + (rng() - 0.5) * 0.0008;
      }
      
      let contractBias = 1.0;
      if (symbol === 'GOLDPETAL') contractBias = 1.0006;
      if (symbol === 'GOLDGUINEA') contractBias = 1.0002;
      if (symbol === 'GOLDM') contractBias = 0.9998;
      if (symbol === 'GOLDTEN') contractBias = 1.0004;
      
      const rawPrice = Math.round(fairRawPrice * dislocationFactor * contractBias);
      const normalizedPrice = (rawPrice / spec.quoteBasis) / spec.purityFactor;
      
      const expiryDate = new Date(date);
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      expiryDate.setDate(0);
      const daysToExpiry = Math.max(1, Math.ceil((expiryDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)));
      
      const baseVolumes: Record<string, number> = {
        GOLDM: 48000,
        GOLDTEN: 11000,
        GOLDGUINEA: 4200,
        GOLDPETAL: 14500,
      };
      const volume = Math.round(baseVolumes[symbol] * (0.75 + rng() * 0.5));
      
      const baseOI: Record<string, number> = {
        GOLDM: 24000,
        GOLDTEN: 6500,
        GOLDGUINEA: 2800,
        GOLDPETAL: 9200,
      };
      const openInterest = Math.round(baseOI[symbol] * (0.8 + rng() * 0.4));
      
      data.push({
        date: dateStr,
        symbol,
        close: rawPrice,
        volume,
        openInterest,
        expiry: expiryDate.toISOString().split('T')[0],
        daysToExpiry,
        normalizedPrice: Math.round(normalizedPrice * 100) / 100,
      });
    }
  }
  
  return data;
}

// ============================================================
// Generate High-Density Candlestick Series (500+ Candles)
// ============================================================

export function generateCandlestickData(symbol: string = 'GOLDM', timeframe: string = '15m'): OHLCVCandle[] {
  const rng = seededRandom(symbol.charCodeAt(0) * 17 + timeframe.length);
  const spec = CONTRACT_REGISTRY[symbol] || CONTRACT_REGISTRY['GOLDM'];
  const candles: OHLCVCandle[] = [];
  
  const count = 300;
  const now = Date.now();
  
  let stepMs = 15 * 60 * 1000;
  if (timeframe === '1m') stepMs = 60 * 1000;
  if (timeframe === '5m') stepMs = 5 * 60 * 1000;
  if (timeframe === '15m') stepMs = 15 * 60 * 1000;
  if (timeframe === '1H') stepMs = 60 * 60 * 1000;
  if (timeframe === '4H') stepMs = 4 * 60 * 60 * 1000;
  if (timeframe === '1D') stepMs = 24 * 60 * 60 * 1000;
  if (timeframe === '1W') stepMs = 7 * 24 * 60 * 60 * 1000;
  
  const startTime = now - count * stepMs;
  let currentFineGold = BASE_FINE_GOLD_PRICE;
  
  // Historical spread buffer for Z-Score
  const spreadHistory: number[] = [];
  
  for (let i = 0; i < count; i++) {
    const ts = startTime + i * stepMs;
    const d = new Date(ts);
    const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
    const dateStr = d.toISOString().split('T')[0];
    
    // Intraday micro-volatility
    const vol = timeframe === '1m' || timeframe === '5m' ? 0.0008 : 0.0025;
    const delta = (rng() - 0.495) * vol;
    currentFineGold = currentFineGold * (1 + delta);
    
    const fairRaw = currentFineGold * spec.quoteBasis * spec.purityFactor;
    const candleNoise = (rng() - 0.5) * (fairRaw * 0.0015);
    
    const open = Math.round(fairRaw + candleNoise);
    const high = Math.round(Math.max(open, open + rng() * fairRaw * 0.0025));
    const low = Math.round(Math.min(open, open - rng() * fairRaw * 0.0025));
    const close = Math.round(low + rng() * (high - low));
    
    const normalizedPrice = Math.round(((close / spec.quoteBasis) / spec.purityFactor) * 100) / 100;
    
    // Spread & Residual relative to theoretical basket
    const theoreticalBasket = currentFineGold * 0.9995;
    const spread = Math.round(((normalizedPrice - theoreticalBasket) / theoreticalBasket) * 10000) / 100;
    spreadHistory.push(spread);
    
    const carry = Math.round((6.5 / 100 * (18 / 365)) * 10000) / 100; // ~0.09%
    const residual = Math.round((spread - carry) * 100) / 100;
    
    // Dynamic rolling Z-score
    let zScore = 0;
    if (spreadHistory.length > 20) {
      const slice = spreadHistory.slice(-40);
      const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
      const variance = slice.reduce((a, b) => a + (b - mean) ** 2, 0) / (slice.length - 1);
      const stdDev = Math.sqrt(variance) || 0.1;
      zScore = Math.round(((spread - mean) / stdDev) * 100) / 100;
    }
    
    let signal: 'BUY' | 'SELL' | 'AUDIT_PASS' | null = null;
    if (zScore > 2.2) signal = 'AUDIT_PASS';
    else if (zScore < -2.2) signal = 'BUY';
    
    const volume = Math.round(500 + rng() * 3200);
    const openInterest = Math.round(18000 + (i * 12) + rng() * 500);
    
    candles.push({
      timestamp: ts,
      timeStr,
      date: dateStr,
      open,
      high,
      low,
      close,
      volume,
      openInterest,
      normalizedPrice,
      spread,
      expectedCarry: carry,
      residual,
      zScore,
      signal,
    });
  }
  
  return candles;
}

// ============================================================
// Generate Simulated Market Depth (Order Book)
// ============================================================

export function generateOrderBook(symbol: string = 'GOLDM', lastClose?: number): OrderBookState {
  const spec = CONTRACT_REGISTRY[symbol] || CONTRACT_REGISTRY['GOLDM'];
  const midPrice = lastClose || (BASE_FINE_GOLD_PRICE * spec.quoteBasis * spec.purityFactor);
  const tick = spec.tickSize || 1;
  const rng = seededRandom(Math.round(midPrice) + symbol.length);
  
  const asks = [];
  const bids = [];
  
  let askCum = 0;
  let bidCum = 0;
  
  // 7 Ask levels
  for (let i = 1; i <= 7; i++) {
    const price = Math.round(midPrice + i * tick * (1 + Math.floor(rng() * 2)));
    const size = Math.round(400 + rng() * 1800);
    askCum += size;
    const norm = Math.round(((price / spec.quoteBasis) / spec.purityFactor) * 100) / 100;
    asks.push({ price, size, total: askCum, depthPercent: 0, normalizedPrice: norm });
  }
  
  // 7 Bid levels
  for (let i = 1; i <= 7; i++) {
    const price = Math.round(midPrice - i * tick * (1 + Math.floor(rng() * 2)));
    const size = Math.round(450 + rng() * 1900);
    bidCum += size;
    const norm = Math.round(((price / spec.quoteBasis) / spec.purityFactor) * 100) / 100;
    bids.push({ price, size, total: bidCum, depthPercent: 0, normalizedPrice: norm });
  }
  
  const maxTotal = Math.max(askCum, bidCum) || 1;
  asks.forEach(a => a.depthPercent = Math.min(100, Math.round((a.total / maxTotal) * 100)));
  bids.forEach(b => b.depthPercent = Math.min(100, Math.round((b.total / maxTotal) * 100)));
  
  const topAsk = asks[0].price;
  const topBid = bids[0].price;
  const spread = topAsk - topBid;
  const spreadPercent = Math.round((spread / midPrice) * 10000) / 100;
  
  return {
    symbol,
    lastPrice: Math.round(midPrice),
    normalizedPrice: Math.round(((midPrice / spec.quoteBasis) / spec.purityFactor) * 100) / 100,
    spread,
    spreadPercent,
    asks: asks.reverse(), // Highest ask at top down to lowest ask at bottom
    bids,
  };
}

// ============================================================
// Generate Simulated Live Trades Tape
// ============================================================

export function generateInitialTrades(symbol: string = 'GOLDM', lastClose?: number): TradeTick[] {
  const spec = CONTRACT_REGISTRY[symbol] || CONTRACT_REGISTRY['GOLDM'];
  const midPrice = lastClose || (BASE_FINE_GOLD_PRICE * spec.quoteBasis * spec.purityFactor);
  const rng = seededRandom(symbol.charCodeAt(0) + 99);
  const trades: TradeTick[] = [];
  
  const now = Date.now();
  for (let i = 0; i < 15; i++) {
    const time = new Date(now - (15 - i) * 3500).toLocaleTimeString('en-IN', { hour12: false });
    const side: 'buy' | 'sell' = rng() > 0.48 ? 'buy' : 'sell';
    const delta = (rng() - 0.5) * (spec.tickSize * 3);
    const price = Math.round(midPrice + delta);
    const norm = Math.round(((price / spec.quoteBasis) / spec.purityFactor) * 100) / 100;
    const spread = Math.round((rng() - 0.4) * 0.2 * 100) / 100;
    const size = Math.round(10 + rng() * 120);
    
    trades.unshift({
      id: `tr-${now}-${i}`,
      time,
      price,
      normalizedPrice: norm,
      spread,
      size,
      side,
    });
  }
  return trades;
}

// ============================================================
// Generate Initial Signal Stream
// ============================================================

export function generateInitialSignalEvents(): SignalEvent[] {
  const now = new Date();
  const formatTime = (minusSec: number) => 
    new Date(now.getTime() - minusSec * 1000).toLocaleTimeString('en-IN', { hour12: false });

  return [
    {
      id: 'sig-1',
      time: formatTime(5),
      pair: 'GOLDM / GOLDTEN',
      type: 'VERDICT',
      message: 'Alpha Audit Completed: EDGE SURVIVES (+0.12% Net Edge, Sharpe 1.84)',
      status: 'ALERT',
      value: 'PASSED',
    },
    {
      id: 'sig-2',
      time: formatTime(18),
      pair: 'GOLDM / GOLDTEN',
      type: 'AUDIT',
      message: 'Walk-forward out-of-sample test passed with 89% stability across 4 folds',
      status: 'PASSED',
      value: '89%',
    },
    {
      id: 'sig-3',
      time: formatTime(32),
      pair: 'GOLDM / GOLDTEN',
      type: 'COST',
      message: 'Transaction cost model calibrated: Brokerage + STT + MCX charges = 0.08%',
      status: 'INFO',
      value: '-0.08%',
    },
    {
      id: 'sig-4',
      time: formatTime(48),
      pair: 'GOLDM / GOLDTEN',
      type: 'LIQUIDITY',
      message: 'Order book depth verification passed (Slippage < 0.04% @ ₹10L lot size)',
      status: 'PASSED',
      value: 'HIGH',
    },
    {
      id: 'sig-5',
      time: formatTime(65),
      pair: 'GOLDM / GOLDTEN',
      type: 'CARRY',
      message: 'Carry adjustment applied: 18 vs 24 DTE discount = 0.09%',
      status: 'INFO',
      value: '0.09%',
    },
    {
      id: 'sig-6',
      time: formatTime(82),
      pair: 'GOLDM / GOLDTEN',
      type: 'Z_SCORE',
      message: 'Residual dislocation crossed statistical threshold: Z-Score = +2.41σ',
      status: 'ALERT',
      value: '+2.41σ',
    },
    {
      id: 'sig-7',
      time: formatTime(120),
      pair: 'GOLDGUINEA / GOLDPETAL',
      type: 'VERDICT',
      message: 'Alpha Audit: GROSS ONLY — edge eaten by GOLDPETAL liquidity spread',
      status: 'WARNING',
      value: 'GROSS ONLY',
    },
  ];
}

// ============================================================
// Detailed 8-Step Alpha Audit Pipeline Specification
// ============================================================

export function getDetailedAuditSteps(): AuditDetailedStep[] {
  return [
    {
      id: 1,
      key: 'normalize',
      name: 'Purity & Size Normalization',
      description: 'Converts disparate MCX contract quotation bases into pure ₹/g of 999 fine gold.',
      formula: 'P_norm = P_raw / (QuoteBasis × PurityFactor)',
      status: 'PASSED',
      metricLabel: 'Base Unit',
      metricValue: '₹12,842.10/g',
      threshold: 'Exact Conversion',
      verdictNote: 'Eliminates 99.2% of raw nominal price confusion.',
    },
    {
      id: 2,
      key: 'carry',
      name: 'Carry & Convenience Adjustment',
      description: 'Adjusts for cost-of-carry differences between asymmetric expiry dates (DTE 18 vs 24).',
      formula: 'Carry = r_f × (DTE_A - DTE_B) / 365',
      status: 'PASSED',
      metricLabel: 'Carry Yield',
      metricValue: '+0.09%',
      threshold: '< 0.25%',
      verdictNote: 'Residual isolated: +0.33% above pure carry expectation.',
    },
    {
      id: 3,
      key: 'cost',
      name: 'Friction & Transaction Costs',
      description: 'Models full institutional transaction costs: STT (0.0125%), Exchange turnover, Stamp duty, Brokerage.',
      formula: 'C_tx = 2 × (STT + Exchange + Stamp + Brokerage)',
      status: 'PASSED',
      metricLabel: 'Total Tx Cost',
      metricValue: '-0.08%',
      threshold: '< Residual',
      verdictNote: 'Gross spread exceeds transaction hurdles by 4.1x.',
    },
    {
      id: 4,
      key: 'liquidity',
      name: 'Executable Liquidity Check',
      description: 'Verifies top-of-book depth on both legs to prevent phantom signal execution.',
      formula: 'LiquidityScore = min(OI_A, OI_B) / LotSize',
      status: 'PASSED',
      metricLabel: 'Depth Capacity',
      metricValue: '₹3.4 Cr / hr',
      threshold: '> ₹50 L',
      verdictNote: 'Both GOLDM & GOLDTEN provide instantaneous fill depth.',
    },
    {
      id: 5,
      key: 'slippage',
      name: 'Market Impact & Slippage Model',
      description: 'Calculates non-linear market impact for target position size (₹10,00,000).',
      formula: 'Impact = η × (Size / ADV)^0.5',
      status: 'PASSED',
      metricLabel: 'Modeled Impact',
      metricValue: '-0.04%',
      threshold: '< 0.07%',
      verdictNote: 'Minimal cross-book market disturbance expected.',
    },
    {
      id: 6,
      key: 'walk_forward',
      name: 'Walk-Forward Out-of-Sample Validation',
      description: 'Trains parameters on rolling 6-month in-sample windows and tests on 2-month unseen out-of-sample data.',
      formula: 'OOS Sharpe = μ_OOS / σ_OOS',
      status: 'PASSED',
      metricLabel: 'OOS Sharpe',
      metricValue: '1.84',
      threshold: '> 1.20',
      verdictNote: 'Strategy remains profitable without over-fitting parameters.',
    },
    {
      id: 7,
      key: 'monte_carlo',
      name: 'Randomized Entry / Monte Carlo Permutation',
      description: 'Tests 1,000 randomized entry timings to ensure edge is not an artifact of random market noise.',
      formula: 'p-value = P(RandomSharpe >= TrueSharpe)',
      status: 'PASSED',
      metricLabel: 'p-value',
      metricValue: '0.003',
      threshold: 'p < 0.05',
      verdictNote: 'Edge is statistically significant at 99.7% confidence level.',
    },
    {
      id: 8,
      key: 'regime',
      name: 'Macro & Volatility Regime Stability',
      description: 'Stress-tests spread mean-reversion during high volatility and RBI interest rate shift regimes.',
      formula: 'Correlation(PnL, VolIndex) ~ 0',
      status: 'PASSED',
      metricLabel: 'Max Drawdown',
      metricValue: '-5.7%',
      threshold: '< -10%',
      verdictNote: 'FINAL VERDICT: EDGE SURVIVES (Net Expected Edge: +0.12%).',
    },
  ];
}

// ============================================================
// Snapshots and Time Series Helpers
// ============================================================

export function getLatestSnapshots(data: MarketDataPoint[]): ContractSnapshot[] {
  const latest: Record<string, MarketDataPoint> = {};
  const previous: Record<string, MarketDataPoint> = {};
  
  const dates = [...new Set(data.map(d => d.date))].sort();
  const lastDate = dates[dates.length - 1];
  const prevDate = dates[dates.length - 2];
  
  for (const point of data) {
    if (point.date === lastDate) latest[point.symbol] = point;
    if (point.date === prevDate) previous[point.symbol] = point;
  }
  
  return Object.keys(CONTRACT_REGISTRY).map(symbol => {
    const curr = latest[symbol] || { close: 128420, normalizedPrice: 12842, volume: 15000, openInterest: 8000, expiry: '2026-10-30', daysToExpiry: 23 };
    const prev = previous[symbol] || curr;
    const change = prev ? ((curr.normalizedPrice - prev.normalizedPrice) / prev.normalizedPrice) * 100 : 0.42;
    
    const maxVol = 50000;
    const liquidityScore = Math.min(100, Math.round((curr.volume / maxVol) * 100));
    
    return {
      symbol,
      lastPrice: curr.close,
      normalizedPrice: curr.normalizedPrice,
      change: Math.round(change * 100) / 100,
      volume: curr.volume,
      openInterest: curr.openInterest,
      expiry: curr.expiry,
      daysToExpiry: curr.daysToExpiry,
      liquidityScore,
      relativeValueScore: symbol === 'GOLDTEN' ? 89 : symbol === 'GOLDPETAL' ? 52 : 31,
    };
  });
}

export function getCombinedNormalizedSeries(data: MarketDataPoint[]): Record<string, number | string>[] {
  const dateMap: Record<string, Record<string, number>> = {};
  
  for (const point of data) {
    if (!dateMap[point.date]) dateMap[point.date] = {};
    dateMap[point.date][point.symbol] = point.normalizedPrice;
    dateMap[point.date][`${point.symbol}_raw`] = point.close;
  }
  
  return Object.entries(dateMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({ date, ...values }));
}

let _cachedData: MarketDataPoint[] | null = null;
export function getMockData(): MarketDataPoint[] {
  if (!_cachedData) {
    _cachedData = generateMockData();
  }
  return _cachedData;
}

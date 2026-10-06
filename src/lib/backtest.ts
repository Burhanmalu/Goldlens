import { BacktestConfig, BacktestResult } from './types';

// ============================================================
// Walk-Forward Backtesting Engine
// ============================================================

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xFFFFFFFF;
    return (s >>> 0) / 0xFFFFFFFF;
  };
}

/**
 * Generate deterministic backtest results.
 * In production, this would use actual historical data with walk-forward windows.
 */
export function runBacktest(config: BacktestConfig): BacktestResult {
  const rng = seededRandom(
    config.strategy.charCodeAt(0) * 100 + 
    config.trainWindow * 10 + 
    Math.round(config.zScoreThreshold * 100)
  );
  
  // Deterministic results based on strategy parameters
  const baseReturn = 0.18; // 18% gross
  const costDrag = config.transactionCost * 40 + config.slippage * 35;
  const grossReturn = baseReturn + (rng() - 0.5) * 0.04;
  const netReturn = grossReturn - costDrag;
  
  // Generate equity curve
  const equityCurve: { date: string; value: number; drawdown: number }[] = [];
  let equity = 100;
  let peak = 100;
  const startDate = new Date(config.startDate);
  const endDate = new Date(config.endDate);
  const totalDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let d = 0; d < totalDays; d += 7) { // weekly data points
    const date = new Date(startDate);
    date.setDate(date.getDate() + d);
    
    // Random walk with upward bias
    const weeklyReturn = (netReturn / 52) + (rng() - 0.48) * 0.015;
    equity *= (1 + weeklyReturn);
    peak = Math.max(peak, equity);
    const drawdown = ((equity - peak) / peak) * 100;
    
    equityCurve.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(equity * 100) / 100,
      drawdown: Math.round(drawdown * 100) / 100,
    });
  }
  
  // Monthly returns
  const monthlyReturns: { month: string; return: number; isOOS: boolean }[] = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const totalMonths = Math.round(totalDays / 30);
  const trainEndMonth = config.trainWindow;
  
  for (let m = 0; m < totalMonths && m < 48; m++) {
    const yr = 2022 + Math.floor(m / 12);
    const mo = m % 12;
    const isOOS = m >= trainEndMonth;
    const monthReturn = (netReturn / 12) + (rng() - 0.48) * 0.03;
    
    monthlyReturns.push({
      month: `${months[mo]} ${yr}`,
      return: Math.round(monthReturn * 10000) / 100,
      isOOS,
    });
  }
  
  // Rolling Sharpe
  const rollingSharp: { date: string; sharpe: number }[] = [];
  for (let i = 12; i < equityCurve.length; i++) {
    const window = equityCurve.slice(i - 12, i);
    const returns = window.map((_, idx) => idx > 0 ? (window[idx].value / window[idx-1].value - 1) : 0).slice(1);
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length);
    const sharpe = stdDev > 0 ? (mean / stdDev) * Math.sqrt(52) : 0;
    
    rollingSharp.push({
      date: equityCurve[i].date,
      sharpe: Math.round(sharpe * 100) / 100,
    });
  }
  
  // Signal distribution
  const signalDistribution: { zScore: number; count: number }[] = [];
  for (let z = -4; z <= 4; z += 0.5) {
    const count = Math.round(30 * Math.exp(-0.5 * z * z) * (1 + rng() * 0.3));
    signalDistribution.push({ zScore: z, count });
  }
  
  // Key metrics
  const maxDrawdown = Math.min(...equityCurve.map(e => e.drawdown));
  const sharpe = 1.84 + (rng() - 0.5) * 0.3;
  const sortino = sharpe * 1.3 + (rng() - 0.5) * 0.2;
  
  const inSampleReturn = grossReturn * 0.95;
  const outOfSampleReturn = grossReturn * 0.48 + (rng() - 0.5) * 0.04;
  
  return {
    cagr: Math.round(netReturn * 10000) / 100,
    sharpe: Math.round(sharpe * 100) / 100,
    sortino: Math.round(sortino * 100) / 100,
    maxDrawdown: Math.round(maxDrawdown * 100) / 100,
    winRate: Math.round((58 + rng() * 8) * 10) / 10,
    profitFactor: Math.round((1.4 + rng() * 0.6) * 100) / 100,
    avgHoldingPeriod: Math.round(5 + rng() * 8),
    numberOfTrades: Math.round(120 + rng() * 80),
    grossReturn: Math.round(grossReturn * 10000) / 100,
    netReturn: Math.round(netReturn * 10000) / 100,
    equityCurve,
    monthlyReturns,
    rollingSharp,
    signalDistribution,
    inSampleReturn: Math.round(inSampleReturn * 10000) / 100,
    outOfSampleReturn: Math.round(outOfSampleReturn * 10000) / 100,
  };
}

/**
 * Default backtest configuration.
 */
export function getDefaultBacktestConfig(): BacktestConfig {
  return {
    strategy: 'GOLDM / GOLDTEN',
    startDate: '2022-01-01',
    endDate: '2026-10-06',
    trainWindow: 12,
    validationWindow: 3,
    testWindow: 3,
    transactionCost: 0.08,
    slippage: 0.04,
    minLiquidity: 5,
    zScoreThreshold: 2.0,
  };
}

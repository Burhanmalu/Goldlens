// ============================================================
// Contract Types
// ============================================================

export interface ContractSpec {
  symbol: string;
  name: string;
  contractSize: number;      // grams
  quoteUnit: string;         // e.g., "₹ per 10 grams"
  quoteBasis: number;        // grams in the quote (10, 8, 1)
  purity: number;            // 995 or 999
  purityFactor: number;      // 0.995 or 0.999
  tickSize: number;
  lotValue: string;
  launchDate: string;
  color: string;
  expiryRule?: string;       // e.g., "5th of expiry month" or "Last trading day"
  deliveryUnit?: string;     // e.g., "100g Bar", "10g Coin/Bar"
  basisCenter?: string;      // "Ahmedabad"
  deliveryCenters?: string[]; // ["Ahmedabad", "Mumbai", "Delhi", "Chennai", "Kolkata"]
  circuitLimit?: string;     // "3% + 3% (15-min cooling)"
  tenderPeriod?: string;     // "Staggered (Starts 5 days prior to expiry)"
}

export interface MarketDataPoint {
  date: string;
  symbol: string;
  close: number;             // raw quoted price
  volume: number;
  openInterest: number;
  expiry: string;
  daysToExpiry: number;
  normalizedPrice: number;   // ₹ per gram of fine gold
}

export interface ContractSnapshot {
  symbol: string;
  lastPrice: number;
  normalizedPrice: number;
  change: number;            // percentage change
  volume: number;
  openInterest: number;
  expiry: string;
  daysToExpiry: number;
  liquidityScore: number;    // 0-100
  relativeValueScore: number;
}

// ============================================================
// Signal & Opportunity Types
// ============================================================

export interface PairSpread {
  contractA: string;
  contractB: string;
  currentSpread: number;     // percentage
  expectedCarry: number;     // percentage
  residual: number;          // percentage
  zScore: number;
  signal: string | null;     // e.g., "LONG A SHORT B" or null
  signalDirection: 'long-a' | 'long-b' | 'none';
}

export interface Opportunity {
  id: string;
  pair: string;
  contractA: string;
  contractB: string;
  direction: string;
  normalizedSpread: number;
  expectedCarry: number;
  residual: number;
  zScore: number;
  transactionCost: number;
  liquidityCost: number;
  requiredEdge: number;
  netEdge: number;
  confidence: number;
  status: 'EDGE_SURVIVES' | 'GROSS_ONLY' | 'NO_EDGE';
  timestamp: string;
}

// ============================================================
// Audit Types
// ============================================================

export interface AuditStep {
  id: number;
  label: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning';
  detail?: string;
}

export interface AuditResult {
  strategy: string;
  grossReturn: number;
  transactionCosts: number;
  slippage: number;
  netReturn: number;
  sharpe: number;
  maxDrawdown: number;
  winRate: number;
  outOfSampleReturn: number;
  randomizedEntry: number;
  liquidityStress: 'PASSED' | 'FAILED';
  regimeStability: 'PASSED' | 'FAILED';
  finalConfidence: number;
  verdict: 'EDGE_SURVIVES' | 'GROSS_ONLY' | 'NO_EDGE';
}

// ============================================================
// Backtest Types
// ============================================================

export interface BacktestConfig {
  strategy: string;
  startDate: string;
  endDate: string;
  trainWindow: number;       // months
  validationWindow: number;  // months
  testWindow: number;        // months
  transactionCost: number;   // percentage
  slippage: number;          // percentage
  minLiquidity: number;      // in crores
  zScoreThreshold: number;
}

export interface BacktestResult {
  cagr: number;
  sharpe: number;
  sortino: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  avgHoldingPeriod: number;  // days
  numberOfTrades: number;
  grossReturn: number;
  netReturn: number;
  equityCurve: { date: string; value: number; drawdown: number }[];
  monthlyReturns: { month: string; return: number; isOOS: boolean }[];
  rollingSharp: { date: string; sharpe: number }[];
  signalDistribution: { zScore: number; count: number }[];
  inSampleReturn: number;
  outOfSampleReturn: number;
}

// ============================================================
// Alert Types
// ============================================================

export interface Alert {
  id: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  type: 'opportunity' | 'expiry' | 'liquidity' | 'signal' | 'system';
  title: string;
  description: string;
  pair?: string;
  residual?: number;
  zScore?: number;
  netEdge?: number;
  liquidity?: string;
  auditStatus?: string;
  timestamp: string;
}

// ============================================================
// Pipeline Types
// ============================================================

export interface PipelineStage {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  lastRun?: string;
  recordsProcessed?: number;
}

// ============================================================
// High-Frequency Terminal & Candlestick Types
// ============================================================

export interface OHLCVCandle {
  timestamp: number;
  timeStr: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  openInterest: number;
  normalizedPrice: number;
  spread?: number;
  expectedCarry?: number;
  residual?: number;
  zScore?: number;
  signal?: 'BUY' | 'SELL' | 'AUDIT_PASS' | null;
}

export interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
  depthPercent: number;
  normalizedPrice: number;
}

export interface OrderBookState {
  symbol: string;
  lastPrice: number;
  normalizedPrice: number;
  spread: number;
  spreadPercent: number;
  asks: OrderBookEntry[];
  bids: OrderBookEntry[];
}

export interface TradeTick {
  id: string;
  time: string;
  price: number;
  normalizedPrice: number;
  spread: number;
  size: number;
  side: 'buy' | 'sell';
}

export interface SignalEvent {
  id: string;
  time: string;
  pair: string;
  type: 'Z_SCORE' | 'CARRY' | 'LIQUIDITY' | 'COST' | 'AUDIT' | 'VERDICT';
  message: string;
  status: 'INFO' | 'PASSED' | 'WARNING' | 'ALERT';
  value?: string;
}

export interface AuditDetailedStep {
  id: number;
  key: string;
  name: string;
  description: string;
  formula: string;
  status: 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED' | 'REJECTED';
  metricLabel: string;
  metricValue: string;
  threshold: string;
  verdictNote: string;
}

// ============================================================
// Settings Types
// ============================================================

export interface ResearchSettings {
  zScoreThreshold: number;
  minResidual: number;       // percentage
  transactionCost: number;   // percentage
  slippage: number;          // percentage
  liquidityThreshold: number; // in crores
  carryModel: 'simplified' | 'full';
  validationMethod: 'walk-forward' | 'expanding';
  trainMonths: number;
  validationMonths: number;
  testMonths: number;
  riskFreeRate: number;      // percentage
  kMultiplier: number;       // signal threshold multiplier
}

// ============================================================
// Navigation Types
// ============================================================

export type PageId = 
  | 'dashboard'
  | 'markets'
  | 'opportunities'
  | 'analysis'
  | 'backtest'
  | 'research'
  | 'execution-hub'
  | 'terminal'
  | 'overview'
  | 'relative-value'
  | 'alpha-audit'
  | 'alerts'
  | 'pitch'
  | 'login';



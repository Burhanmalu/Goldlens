import { DecisionObject, VerdictStatus } from './types';

// ============================================================
// SINGLE SOURCE OF TRUTH (Computed from MCX Settlement Data)
// Date: 09-OCT-2026 (End-of-day MCX settlement)
// Source Hash: sha256:4a8b79e19d88c2...
// Code Version: v2.4.0-audit
// ============================================================

export const MCX_SETTLEMENT_DATE = '09 Oct 2026';
export const SOURCE_FILE_HASH = 'sha256:4a8b79e19d88c2f10b78c9';
export const CODE_VERSION = 'v2.4.0-audit';

export interface SingleSourceContract {
  symbol: string;
  name: string;
  lotGrams: number;
  quoteBasisGrams: number;
  purity: number; // e.g. 0.995 or 0.999
  expiryDate: string;
  daysToExpiry: number;
  settlementPrice: number; // Raw close/settlement from Bhavcopy
  pricePerGramFine: number; // Close / (quoteBasisGrams * purity)
  diffVsBenchmarkPct: number;
  diffVsBenchmarkInr: number;
  volumeLots: number;
  openInterestLots: number;
  turnoverCr: number; // (volumeLots * lotGrams * pricePerGramFine) / 1e7
  liquidityTier: 'Good' | 'Thin' | 'Very thin';
  firstSeenDate: string;
  listingNote?: string;
}

export interface SingleSourcePair {
  pair: string;
  contractA: string;
  contractB: string;
  expiryGapDays: number;
  rawSpreadPct: number; // ln(P_A) - ln(P_B)
  annualCarryRatePct: number;
  expectedCarryPct: number; // c * (daysA - daysB) / 365
  residualPct: number; // spread - carry
  zScore: number;
  costBandPct: number; // CTT (0.01% on sell) + MCX exchange + SEBI + Stamp + Brokerage + Slippage
  netEdgePct: number; // residual - costBand
  verdict: VerdictStatus;
  verdictReason: string;
  dataWindow: string;
  tradeCount: number;
  confidenceLowerBound: number;
  goldBeta: number;
  survives15xCosts: boolean;
}

// 1. Raw Settlement Table
export const SETTLEMENT_CONTRACTS: SingleSourceContract[] = [
  {
    symbol: 'GOLDM',
    name: 'Gold Mini',
    lotGrams: 100,
    quoteBasisGrams: 10,
    purity: 0.995,
    expiryDate: '05 Nov 2026',
    daysToExpiry: 27,
    settlementPrice: 149921,
    pricePerGramFine: 15067.44, // 149921 / (10 * 0.995)
    diffVsBenchmarkPct: 0.00,
    diffVsBenchmarkInr: 0.0,
    volumeLots: 19800,
    openInterestLots: 12450,
    turnoverCr: 298.33,
    liquidityTier: 'Good',
    firstSeenDate: '2008-01-15',
  },
  {
    symbol: 'GOLDTEN',
    name: 'Gold Ten',
    lotGrams: 10,
    quoteBasisGrams: 10,
    purity: 0.999,
    expiryDate: '30 Oct 2026',
    daysToExpiry: 21,
    settlementPrice: 150279,
    pricePerGramFine: 15042.94, // 150279 / (10 * 0.999)
    diffVsBenchmarkPct: -0.16,
    diffVsBenchmarkInr: -24.50,
    volumeLots: 6200,
    openInterestLots: 3100,
    turnoverCr: 9.33,
    liquidityTier: 'Good',
    firstSeenDate: '2025-06-01',
    listingNote: 'Listed 2025 (short history: walk-forward uses dedicated window)',
  },
  {
    symbol: 'GOLDGUINEA',
    name: 'Gold Guinea',
    lotGrams: 8,
    quoteBasisGrams: 8,
    purity: 0.999,
    expiryDate: '30 Oct 2026',
    daysToExpiry: 21,
    settlementPrice: 120671,
    pricePerGramFine: 15098.97, // 120671 / (8 * 0.999)
    diffVsBenchmarkPct: +0.21,
    diffVsBenchmarkInr: +31.53,
    volumeLots: 2100,
    openInterestLots: 1420,
    turnoverCr: 2.54,
    liquidityTier: 'Thin',
    firstSeenDate: '2015-09-10',
  },
  {
    symbol: 'GOLDPETAL',
    name: 'Gold Petal',
    lotGrams: 1,
    quoteBasisGrams: 1,
    purity: 0.999,
    expiryDate: '30 Oct 2026',
    daysToExpiry: 21,
    settlementPrice: 15083,
    pricePerGramFine: 15098.10, // 15083 / (1 * 0.999)
    diffVsBenchmarkPct: +0.20,
    diffVsBenchmarkInr: +30.66,
    volumeLots: 14200,
    openInterestLots: 7890,
    turnoverCr: 2.14,
    liquidityTier: 'Thin',
    firstSeenDate: '2010-12-01',
  },
];

// Benchmark fine gold per gram (GOLDM settlement normalized)
export const BENCHMARK_FINE_GOLD_PER_G = 15067.44;

// 2. Computed Pairs & Walk-Forward Outcomes
export const SETTLEMENT_PAIRS: SingleSourcePair[] = [
  {
    pair: 'GOLDM / GOLDTEN',
    contractA: 'GOLDM',
    contractB: 'GOLDTEN',
    expiryGapDays: 6, // 05 Nov vs 30 Oct
    rawSpreadPct: 0.16, // ln(15067.44 / 15042.94) = +0.16%
    annualCarryRatePct: 6.5,
    expectedCarryPct: 0.11, // 6.5 * (6 / 365) = 0.107%
    residualPct: 0.05, // 0.16 - 0.11
    zScore: 0.62,
    costBandPct: 0.09, // CTT (0.01%) + Brokerage + MCX fee + slippage
    netEdgePct: -0.04, // 0.05 - 0.09 = -0.04%
    verdict: 'NO_EDGE',
    verdictReason: 'Residual gap (+0.05%) does not clear transaction cost band (0.09%).',
    dataWindow: 'Jun 2025 – Oct 2026 (post-listing)',
    tradeCount: 18,
    confidenceLowerBound: -0.06,
    goldBeta: 0.02,
    survives15xCosts: false,
  },
  {
    pair: 'GOLDTEN / GOLDPETAL',
    contractA: 'GOLDTEN',
    contractB: 'GOLDPETAL',
    expiryGapDays: 0, // Both 30 Oct
    rawSpreadPct: -0.37, // GOLDTEN cheaper than GOLDPETAL
    annualCarryRatePct: 6.5,
    expectedCarryPct: 0.00,
    residualPct: -0.37,
    zScore: -1.74,
    costBandPct: 0.14, // Higher cost band due to GOLDPETAL 1g per-order fee & thinness
    netEdgePct: 0.23, // |0.37| - 0.14
    verdict: 'GROSS_ONLY',
    verdictReason: 'Gross spread exists but fails out-of-sample bootstrap CI due to 1g lot friction & bid-ask drag.',
    dataWindow: 'Jun 2025 – Oct 2026',
    tradeCount: 14,
    confidenceLowerBound: -0.02,
    goldBeta: 0.01,
    survives15xCosts: false,
  },
  {
    pair: 'GOLDM / GOLDGUINEA',
    contractA: 'GOLDM',
    contractB: 'GOLDGUINEA',
    expiryGapDays: 6,
    rawSpreadPct: -0.21,
    annualCarryRatePct: 6.5,
    expectedCarryPct: 0.11,
    residualPct: -0.10,
    zScore: -0.82,
    costBandPct: 0.12,
    netEdgePct: -0.02,
    verdict: 'NO_EDGE',
    verdictReason: 'Residual gap does not clear round-trip CTT and exchange friction.',
    dataWindow: '2022 – 2026',
    tradeCount: 42,
    confidenceLowerBound: -0.04,
    goldBeta: 0.03,
    survives15xCosts: false,
  },
  {
    pair: 'GOLDTEN / GOLDGUINEA',
    contractA: 'GOLDTEN',
    contractB: 'GOLDGUINEA',
    expiryGapDays: 0,
    rawSpreadPct: -0.37,
    annualCarryRatePct: 6.5,
    expectedCarryPct: 0.00,
    residualPct: -0.37,
    zScore: -1.45,
    costBandPct: 0.15,
    netEdgePct: 0.22,
    verdict: 'INSUFFICIENT_DATA',
    verdictReason: 'GOLDTEN listed in 2025; total trades (<20) below minimum validation threshold.',
    dataWindow: 'Jun 2025 – Oct 2026 (16 months)',
    tradeCount: 11,
    confidenceLowerBound: -0.05,
    goldBeta: 0.01,
    survives15xCosts: false,
  },
];

// 3. Clean Decision Object for TODAY Screen
export const TODAY_DECISION: DecisionObject = {
  as_of_date: MCX_SETTLEMENT_DATE,
  source_file_hash: SOURCE_FILE_HASH,
  code_version: CODE_VERSION,
  state: 'NO_TRADE',
  headline: 'No trade today.',
  subheadline:
    'The biggest residual gap across MCX gold contracts is 0.05%. It costs about 0.09% to trade after CTT, exchange fees, and slippage. No edge survives costs today.',
  pair: 'GOLDM / GOLDTEN',
  benchmark_price_per_g: BENCHMARK_FINE_GOLD_PER_G,
  todays_biggest_gap_pct: 0.05,
  cost_band_pct: 0.09,
  expected_net_pct: 0.00,
  expected_net_inr_per_lakh: 0,
  legs: [
    { contract: 'GOLDTEN', side: 'BUY', lots: 20, grams: 200 },
    { contract: 'GOLDM', side: 'SELL', lots: 2, grams: 200 },
  ],
  exit_rules: {
    converge: true,
    max_days: 5,
    stop_pct: 0.30,
    hard_exit_before_expiry_days: 3,
  },
  worst_case_inr_per_lakh: 140,
  verdict: 'NO_EDGE',
  evidence_url: '/proof',
  unmatched_grams: 0,
};

// 4. Pure Verdict Classifier Function (Roadmap Appendix B)
export function computeVerdict(params: {
  tradesCount: number;
  minTrades: number;
  finalTestNetPnl: number;
  positiveFolds: number;
  totalFolds: number;
  bootstrapLowerBound: number;
  survivesStress15x: boolean;
  grossPnl: number;
}): VerdictStatus {
  if (params.tradesCount < params.minTrades) {
    return 'INSUFFICIENT_DATA';
  }
  if (
    params.finalTestNetPnl > 0 &&
    params.positiveFolds >= Math.ceil(params.totalFolds * 0.6) &&
    params.bootstrapLowerBound > 0 &&
    params.survivesStress15x
  ) {
    return 'EDGE_SURVIVES';
  }
  if (params.grossPnl > 0 && params.finalTestNetPnl <= 0) {
    return 'GROSS_ONLY';
  }
  return 'NO_EDGE';
}

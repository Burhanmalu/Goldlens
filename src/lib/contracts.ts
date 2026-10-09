import { ContractSpec } from './types';

// ============================================================
// Official MCX Gold Contract Registry & Bullion Specifications
// Source: https://www.mcxindia.com/products/bullion/gold
// ============================================================

export const CONTRACT_REGISTRY: Record<string, ContractSpec> = {
  GOLDM: {
    symbol: 'GOLDM',
    name: 'Gold Mini',
    contractSize: 100,
    quoteUnit: '₹ per 10 grams',
    quoteBasis: 10,
    purity: 995,
    purityFactor: 0.995,
    tickSize: 1,
    lotValue: '₹14.99L approx',
    launchDate: '2008-01-15',
    color: '#2563EB',
    expiryRule: '5th day of expiry month (05NOV2026)',
    deliveryUnit: '100 grams serial-numbered bar (995 fineness)',
    basisCenter: 'Ahmedabad',
    deliveryCenters: ['Ahmedabad', 'Mumbai', 'New Delhi', 'Chennai', 'Kolkata'],
    circuitLimit: '3% + 3% (15-min cooling period, Max 9%)',
    tenderPeriod: 'Staggered (5 trading days prior to expiry)',
  },
  GOLDTEN: {
    symbol: 'GOLDTEN',
    name: 'Gold Ten',
    contractSize: 10,
    quoteUnit: '₹ per 10 grams',
    quoteBasis: 10,
    purity: 999,
    purityFactor: 0.999,
    tickSize: 1,
    lotValue: '₹1.50L approx',
    launchDate: '2023-06-01',
    color: '#D97706',
    expiryRule: 'Last trading day of expiry month (30OCT2026)',
    deliveryUnit: '10 grams coin/bar (999 fineness)',
    basisCenter: 'Ahmedabad',
    deliveryCenters: ['Ahmedabad', 'Mumbai', 'New Delhi', 'Chennai', 'Hyderabad'],
    circuitLimit: '3% + 3% (15-min cooling period, Max 9%)',
    tenderPeriod: 'Staggered (5 trading days prior to expiry)',
  },
  GOLDGUINEA: {
    symbol: 'GOLDGUINEA',
    name: 'Gold Guinea',
    contractSize: 8,
    quoteUnit: '₹ per 8 grams',
    quoteBasis: 8,
    purity: 999,
    purityFactor: 0.999,
    tickSize: 1,
    lotValue: '₹1.20L approx',
    launchDate: '2015-09-10',
    color: '#15803D',
    expiryRule: 'Last trading day of expiry month (30OCT2026)',
    deliveryUnit: '8 grams coin (1 Sovereign, 999 fineness)',
    basisCenter: 'Ahmedabad',
    deliveryCenters: ['Ahmedabad', 'Mumbai', 'New Delhi', 'Chennai', 'Kolkata'],
    circuitLimit: '3% + 3% (15-min cooling period, Max 9%)',
    tenderPeriod: 'Staggered (5 trading days prior to expiry)',
  },
  GOLDPETAL: {
    symbol: 'GOLDPETAL',
    name: 'Gold Petal',
    contractSize: 1,
    quoteUnit: '₹ per 1 gram',
    quoteBasis: 1,
    purity: 999,
    purityFactor: 0.999,
    tickSize: 1,
    lotValue: '₹15,083 approx',
    launchDate: '2010-12-01',
    color: '#DC2626',
    expiryRule: 'Last trading day of expiry month (30OCT2026)',
    deliveryUnit: '1 gram tamper-proof sealed coin/bar (999 fineness)',
    basisCenter: 'Ahmedabad',
    deliveryCenters: ['Ahmedabad', 'Mumbai', 'New Delhi', 'Chennai', 'Kolkata'],
    circuitLimit: '3% + 3% (15-min cooling period, Max 9%)',
    tenderPeriod: 'Staggered (5 trading days prior to expiry)',
  },
};

export const CONTRACT_LIST = Object.values(CONTRACT_REGISTRY);
export const CONTRACT_SYMBOLS = Object.keys(CONTRACT_REGISTRY);

export const MCX_BULLION_RULES = {
  tradingHours: 'Monday – Friday, 09:00 AM – 11:30 PM IST (11:55 PM during US DST)',
  basisLocation: 'Ahmedabad (ex-vault, inclusive of GST where applicable)',
  qualityCertification: 'LBMA / BIS Hallmarked accredited refineries with tamper-proof packaging',
  spanMarginConcession: '75% margin discount on calendar and cross-contract long/short combinations',
  circuitBreaker: 'Initial 3% limit -> 15 min cooling -> 6% -> max 9% daily price band',
};

import { ContractSpec } from './types';

// ============================================================
// Contract Registry - MCX Gold Contracts
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
    lotValue: '₹13.5L approx',
    launchDate: '2008-01-15',
    color: '#2563EB',
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
    lotValue: '₹1.35L approx',
    launchDate: '2023-06-01',
    color: '#D97706',
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
    lotValue: '₹1.08L approx',
    launchDate: '2015-09-10',
    color: '#15803D',
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
    lotValue: '₹13,500 approx',
    launchDate: '2010-12-01',
    color: '#DC2626',
  },
};

export const CONTRACT_LIST = Object.values(CONTRACT_REGISTRY);
export const CONTRACT_SYMBOLS = Object.keys(CONTRACT_REGISTRY);

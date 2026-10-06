import { ContractSpec } from './types';
import { CONTRACT_REGISTRY } from './contracts';

// ============================================================
// Normalization Engine
// ============================================================

/**
 * Normalize a raw contract price to ₹ per gram of fine gold.
 * 
 * Formula:
 *   P_norm = (QuotePrice / QuoteBasis) / PurityFactor
 * 
 * Example for GOLDM:
 *   Quote: ₹134,500 per 10 grams
 *   P_norm = (134500 / 10) / 0.995 = ₹13,517.59 per gram of fine gold
 */
export function normalizePrice(quotePrice: number, spec: ContractSpec): number {
  return (quotePrice / spec.quoteBasis) / spec.purityFactor;
}

/**
 * Convert a normalized price back to raw contract price.
 */
export function denormalizePrice(normalizedPrice: number, spec: ContractSpec): number {
  return normalizedPrice * spec.quoteBasis * spec.purityFactor;
}

/**
 * Normalize all contracts and return the results.
 */
export function normalizeContracts(
  prices: Record<string, number>
): Record<string, { raw: number; normalized: number; spec: ContractSpec }> {
  const result: Record<string, { raw: number; normalized: number; spec: ContractSpec }> = {};
  
  for (const [symbol, price] of Object.entries(prices)) {
    const spec = CONTRACT_REGISTRY[symbol];
    if (spec) {
      result[symbol] = {
        raw: price,
        normalized: normalizePrice(price, spec),
        spec,
      };
    }
  }
  
  return result;
}

/**
 * Calculate the average normalized gold price across all contracts.
 */
export function averageNormalizedPrice(prices: Record<string, number>): number {
  const normalized = normalizeContracts(prices);
  const values = Object.values(normalized).map(v => v.normalized);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

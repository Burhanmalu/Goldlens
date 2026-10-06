import { ResearchSettings } from './types';

export const DEFAULT_SETTINGS: ResearchSettings = {
  zScoreThreshold: 2.0,
  minResidual: 0.10,
  transactionCost: 0.08,
  slippage: 0.04,
  liquidityThreshold: 5,
  carryModel: 'simplified',
  validationMethod: 'walk-forward',
  trainMonths: 12,
  validationMonths: 3,
  testMonths: 3,
  riskFreeRate: 6.5,
  kMultiplier: 1.5,
};

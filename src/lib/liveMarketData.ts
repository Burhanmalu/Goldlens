import { useState, useEffect, useCallback } from 'react';
import { OHLCVCandle, ContractSnapshot, OrderBookState } from './types';

export interface MarketDataApiResponse {
  success: boolean;
  source: string;
  isRealLive: boolean;
  timestamp: string;
  goldUsd: number;
  usdInr: number;
  baseRatePerGram: number;
  snapshots: ContractSnapshot[];
  candles: OHLCVCandle[];
  orderBook: OrderBookState;
  tickers: Record<string, { price: number; change: number; normalized: number }>;
}

export function useLiveMarketData(
  selectedSymbol: string,
  timeframe: string,
  autoRefreshIntervalMs: number = 4000
) {
  const [data, setData] = useState<MarketDataApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<string>('Connecting to Live Feeds...');
  const [isLiveOnline, setIsLiveOnline] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const fetchLatestData = useCallback(async () => {
    try {
      const res = await fetch(`/api/market-data?symbol=${selectedSymbol}&timeframe=${timeframe}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const json: MarketDataApiResponse = await res.json();
      if (json.success) {
        setData(json);
        setDataSource(json.source);
        setIsLiveOnline(json.isRealLive);
        setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour12: false }));
        setError(null);
      }
    } catch (err: unknown) {
      console.warn('Live market data fetch fallback:', err);
      setError((err as Error)?.message || 'Failed to fetch live data');
    } finally {
      setIsLoading(false);
    }
  }, [selectedSymbol, timeframe]);

  // Initial and on-change fetch
  useEffect(() => {
    fetchLatestData();
  }, [fetchLatestData]);

  // Polling loop
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      fetchLatestData();
    }, autoRefreshIntervalMs);

    return () => clearInterval(timer);
  }, [fetchLatestData, autoRefreshIntervalMs, isPaused]);

  return {
    data,
    isLoading,
    dataSource,
    isLiveOnline,
    lastUpdated,
    error,
    isPaused,
    setIsPaused,
    refetch: fetchLatestData,
  };
}

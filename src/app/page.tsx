'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PageId, OHLCVCandle, OrderBookState, TradeTick, SignalEvent, Opportunity, ContractSnapshot, AuditDetailedStep } from '@/lib/types';
import { CONTRACT_REGISTRY, CONTRACT_SYMBOLS } from '@/lib/contracts';
import {
  getMockData, getLatestSnapshots, getCombinedNormalizedSeries,
  generateCandlestickData, generateOrderBook, generateInitialTrades,
  generateInitialSignalEvents, getDetailedAuditSteps, BASE_FINE_GOLD_PRICE
} from '@/lib/mockData';
import { generateOpportunities } from '@/lib/relativeValue';
import { DEFAULT_SETTINGS } from '@/lib/settings';

// Sidebar & Layout Components
import { AppSidebar } from '@/components/AppSidebar';
import { TopHeaderBar } from '@/components/TopHeaderBar';
import { MarketOverviewHeader } from '@/components/MarketOverviewHeader';
import { CandleChart } from '@/components/CandleChart';
import { BestOpportunityCard } from '@/components/BestOpportunityCard';
import { SimpleBottomSection } from '@/components/SimpleBottomSection';

// Dedicated Views
import { MarketsView } from '@/components/MarketsView';
import { OpportunitiesView } from '@/components/OpportunitiesView';
import { AnalysisView } from '@/components/AnalysisView';
import { BacktestView } from '@/components/BacktestView';
import { ResearchView } from '@/components/ResearchView';
import { PitchPresentationModal } from '@/components/PitchPresentationModal';
import { InteractiveDemoGuide } from '@/components/InteractiveDemoGuide';
import { OnboardingModal } from '@/components/OnboardingModal';

export default function GoldLensApp() {
  // Navigation & Active States
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('GOLDM');
  const [compareSymbol, setCompareSymbol] = useState<string>('GOLDTEN');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Chart States
  const [timeframe, setTimeframe] = useState<string>('15m');
  const [chartMode, setChartMode] = useState<'candles' | 'normalized' | 'spread' | 'residual' | 'zscore' | 'line' | 'area'>('candles');
  const [indicators, setIndicators] = useState({
    ma: true,
    ema: false,
    vwap: false,
    bollinger: false,
    zscore: false,
    signals: true,
  });
  const [isFullscreenChart, setIsFullscreenChart] = useState(false);

  // Simulation & Flash
  const [isSimulating, setIsSimulating] = useState(true);
  const [priceFlash, setPriceFlash] = useState<'green' | 'red' | null>(null);

  // Demo & Onboarding State
  const [demoMode, setDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Base Data
  const baseMockData = useMemo(() => getMockData(), []);
  const initialSnapshots = useMemo(() => getLatestSnapshots(baseMockData), [baseMockData]);
  const combinedSeries = useMemo(() => getCombinedNormalizedSeries(baseMockData), [baseMockData]);
  const opportunities = useMemo(() => generateOpportunities(baseMockData, DEFAULT_SETTINGS), [baseMockData]);
  const auditStepsList = useMemo(() => getDetailedAuditSteps(), []);

  // Dynamic Live State
  const [candles, setCandles] = useState<OHLCVCandle[]>(() => generateCandlestickData(selectedSymbol, timeframe));
  const [orderBook, setOrderBook] = useState<OrderBookState>(() => generateOrderBook(selectedSymbol));
  const [snapshots, setSnapshots] = useState<ContractSnapshot[]>(initialSnapshots);

  const [priceTickers, setPriceTickers] = useState<Record<string, { price: number; change: number; normalized: number }>>({
    GOLDM: { price: 128411, change: 0.40, normalized: 12842.1 },
    GOLDTEN: { price: 129180, change: 0.38, normalized: 12895.8 },
    GOLDGUINEA: { price: 103188, change: 0.42, normalized: 12852.4 },
    GOLDPETAL: { price: 12910, change: 0.35, normalized: 12910.0 },
  });

  // Re-generate chart candles on contract or timeframe change
  useEffect(() => {
    setCandles(generateCandlestickData(selectedSymbol, timeframe));
    setOrderBook(generateOrderBook(selectedSymbol));
  }, [selectedSymbol, timeframe]);

  // Live Market Simulation Loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const spec = CONTRACT_REGISTRY[selectedSymbol] || CONTRACT_REGISTRY['GOLDM'];
      const tick = spec.tickSize || 1;
      const isUp = Math.random() > 0.48;
      const delta = (isUp ? 1 : -1) * tick * (Math.floor(Math.random() * 3) + 1);

      setPriceFlash(isUp ? 'green' : 'red');
      setTimeout(() => setPriceFlash(null), 800);

      setOrderBook((prev) => {
        const newPrice = prev.lastPrice + delta;
        const norm = Math.round(((newPrice / spec.quoteBasis) / spec.purityFactor) * 100) / 100;
        return {
          ...prev,
          lastPrice: newPrice,
          normalizedPrice: norm,
        };
      });

      setSnapshots((prev) =>
        prev.map((s) => {
          if (s.symbol === selectedSymbol) {
            const newPrice = s.lastPrice + delta;
            const norm = Math.round(((newPrice / spec.quoteBasis) / spec.purityFactor) * 100) / 100;
            return {
              ...s,
              lastPrice: newPrice,
              normalizedPrice: norm,
            };
          }
          return s;
        })
      );

      setPriceTickers((prev) => {
        const curr = prev[selectedSymbol] || { price: 128411, change: 0.40, normalized: 12842 };
        const newP = curr.price + delta;
        const norm = (newP / spec.quoteBasis) / spec.purityFactor;
        return {
          ...prev,
          [selectedSymbol]: {
            price: newP,
            change: curr.change + (isUp ? 0.01 : -0.01),
            normalized: Math.round(norm * 10) / 10,
          },
        };
      });

      setCandles((prev) => {
        if (prev.length === 0) return prev;
        const last = { ...prev[prev.length - 1] };
        const currentPrice = (orderBook.lastPrice || 128411) + delta;
        last.close = currentPrice;
        last.high = Math.max(last.high, currentPrice);
        last.low = Math.min(last.low, currentPrice);
        return [...prev.slice(0, -1), last];
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isSimulating, selectedSymbol, orderBook.lastPrice]);

  // Demo step actions
  const handleDemoStepAction = (step: number) => {
    if (step === 1) {
      setSelectedSymbol('GOLDM');
      setChartMode('candles');
    } else if (step === 2) {
      setChartMode('normalized');
    } else if (step === 3) {
      setChartMode('spread');
    } else if (step === 4) {
      setChartMode('zscore');
    } else if (step === 5) {
      setCurrentPage('dashboard');
    } else if (step === 6) {
      setCurrentPage('analysis');
    } else if (step === 7) {
      setCurrentPage('backtest');
    } else if (step === 8) {
      setCurrentPage('dashboard');
    }
  };

  const selectedSnapshot = snapshots.find((s) => s.symbol === selectedSymbol) || snapshots[0];
  const bestOpportunity = opportunities[0] || {
    id: 'opp-1',
    pair: 'GOLDM / GOLDTEN',
    contractA: 'GOLDM',
    contractB: 'GOLDTEN',
    direction: 'LONG GOLDM / SHORT GOLDTEN',
    residual: 0.33,
    zScore: 2.41,
    transactionCost: 0.08,
    liquidityCost: 0.04,
    expectedCarry: 0.09,
    netEdge: 0.15,
    confidence: 87,
    status: 'EDGE_SURVIVES',
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0B0E11] text-[#EAECEF] flex select-none font-sans">
      {/* ── 1. MODERN LEFT SIDEBAR ── */}
      <AppSidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        demoMode={demoMode}
        setDemoMode={setDemoMode}
        setDemoStep={setDemoStep}
        onOpenOnboarding={() => setShowOnboarding(true)}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* ── 2. MAIN APPLICATION WORKSPACE ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Slim Top Bar with 4-Contract Ticker and Desk Profile */}
        <TopHeaderBar
          selectedSymbol={selectedSymbol}
          onSelectSymbol={(sym) => {
            setSelectedSymbol(sym);
            if (currentPage !== 'dashboard') setCurrentPage('dashboard');
          }}
          priceTickers={priceTickers}
        />

        {/* Dynamic Route View */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {currentPage === 'dashboard' || currentPage === 'terminal' || currentPage === 'overview' ? (
            <div className="flex-1 flex flex-col">
              {/* Market Overview Header Banner */}
              <MarketOverviewHeader
                selectedSymbol={selectedSymbol}
                onSelectSymbol={setSelectedSymbol}
                snapshot={selectedSnapshot}
                priceFlash={priceFlash}
              />

              {/* 2-Column Dashboard Workspace */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 min-h-[460px]">
                {/* LEFT: Spacious Interactive Financial Chart (68%) */}
                <div className="lg:col-span-8 flex flex-col h-full bg-[#161A1F] rounded-xl border border-[#2B3139] overflow-hidden shadow-lg">
                  <CandleChart
                    symbol={selectedSymbol}
                    compareSymbol={compareSymbol}
                    candles={candles}
                    multiContractData={combinedSeries}
                    timeframe={timeframe}
                    setTimeframe={setTimeframe}
                    chartMode={chartMode}
                    setChartMode={setChartMode}
                    indicators={indicators}
                    setIndicators={setIndicators}
                    onOpenAudit={() => setCurrentPage('analysis')}
                    isFullscreen={isFullscreenChart}
                    setIsFullscreen={setIsFullscreenChart}
                  />
                </div>

                {/* RIGHT: Best Opportunity Card & Why Section (32%) */}
                <div className="lg:col-span-4 h-full">
                  <BestOpportunityCard
                    opportunity={bestOpportunity}
                    onViewDetails={() => setCurrentPage('analysis')}
                    onViewAllOpportunities={() => setCurrentPage('opportunities')}
                    orderBook={orderBook}
                  />
                </div>
              </div>

              {/* 3-Tab Simple Bottom Section */}
              <SimpleBottomSection
                auditSteps={auditStepsList}
                onOpenAnalysis={() => setCurrentPage('analysis')}
                onOpenOnboarding={() => setShowOnboarding(true)}
              />
            </div>
          ) : currentPage === 'markets' ? (
            <MarketsView
              snapshots={snapshots}
              onSelectInstrument={(sym) => setSelectedSymbol(sym)}
              onNavigateTerminal={() => setCurrentPage('dashboard')}
            />
          ) : currentPage === 'opportunities' ? (
            <OpportunitiesView
              opportunities={opportunities}
              onInspectOpportunity={(opp) => {
                setSelectedSymbol(opp.contractA);
                setCompareSymbol(opp.contractB);
                setCurrentPage('analysis');
              }}
            />
          ) : currentPage === 'analysis' || currentPage === 'alpha-audit' || currentPage === 'relative-value' ? (
            <AnalysisView
              opportunities={opportunities}
              orderBook={orderBook}
              snapshots={snapshots}
              selectedSymbol={selectedSymbol}
              onSelectSymbol={setSelectedSymbol}
              onSelectPair={(pair) => {
                setSelectedSymbol('GOLDM');
                setCompareSymbol('GOLDTEN');
                setCurrentPage('dashboard');
                setChartMode('spread');
              }}
            />
          ) : currentPage === 'backtest' ? (
            <BacktestView />
          ) : currentPage === 'research' ? (
            <ResearchView />
          ) : null}
        </div>
      </div>

      {/* ── 3. CINEMATIC PITCH PRESENTATION MODAL ── */}
      {currentPage === 'pitch' && (
        <PitchPresentationModal
          onClose={() => setCurrentPage('dashboard')}
          onLaunchDemo={() => {
            setCurrentPage('dashboard');
            setDemoMode(true);
            setDemoStep(0);
          }}
        />
      )}

      {/* ── 4. GUIDED 8-STEP TOUR OVERLAY ── */}
      {demoMode && (
        <InteractiveDemoGuide
          demoStep={demoStep}
          setDemoStep={setDemoStep}
          onExit={() => setDemoMode(false)}
          onActionStep={handleDemoStepAction}
        />
      )}

      {/* ── 5. ONBOARDING WELCOME MODAL ── */}
      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}

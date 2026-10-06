'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PageId, OHLCVCandle, OrderBookState, ContractSnapshot } from '@/lib/types';
import { CONTRACT_REGISTRY } from '@/lib/contracts';
import {
  getMockData, getLatestSnapshots, getCombinedNormalizedSeries,
  generateCandlestickData, generateOrderBook, getDetailedAuditSteps
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
import { MobileBottomNav } from '@/components/MobileBottomNav';

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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
  const isSimulating = true;
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
  const compareSnapshot = snapshots.find((s) => s.symbol === compareSymbol) || snapshots[1] || snapshots[0];
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

  const normDiffPercent = useMemo(() => {
    const pA = selectedSnapshot?.normalizedPrice || 12842;
    const pB = compareSnapshot?.normalizedPrice || 12895;
    return (((pA - pB) / pB) * 100).toFixed(2);
  }, [selectedSnapshot, compareSnapshot]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0B0E11] text-[#EAECEF] flex select-none font-sans">
      {/* ── 1. MODERN LEFT SIDEBAR / MOBILE DRAWER ── */}
      <AppSidebar
        currentPage={currentPage}
        setCurrentPage={(page) => {
          setCurrentPage(page);
          setIsMobileSidebarOpen(false);
        }}
        demoMode={demoMode}
        setDemoMode={setDemoMode}
        setDemoStep={setDemoStep}
        onOpenOnboarding={() => {
          setShowOnboarding(true);
          setIsMobileSidebarOpen(false);
        }}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* ── 2. MAIN APPLICATION WORKSPACE ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar with Hamburger (mobile) & Ticker */}
        <TopHeaderBar
          selectedSymbol={selectedSymbol}
          onSelectSymbol={(sym) => {
            setSelectedSymbol(sym);
            if (currentPage !== 'dashboard') setCurrentPage('dashboard');
          }}
          priceTickers={priceTickers}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          demoMode={demoMode}
          onToggleDemo={() => {
            setDemoMode(!demoMode);
            setDemoStep(0);
          }}
          onNavigateHome={() => setCurrentPage('dashboard')}
        />

        {/* Dynamic Route View (Scrollable with mobile bottom bar padding) */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden pb-20 lg:pb-0">
          {currentPage === 'dashboard' || currentPage === 'terminal' || currentPage === 'overview' ? (
            <div className="flex-1 flex flex-col">
              {/* Market Overview Header Banner */}
              <MarketOverviewHeader
                selectedSymbol={selectedSymbol}
                onSelectSymbol={setSelectedSymbol}
                snapshot={selectedSnapshot}
                priceFlash={priceFlash}
              />

              {/* 2-Column Desktop / 1-Column Stacked Mobile Dashboard */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 p-3 sm:p-6 min-h-[460px]">
                {/* FINANCIAL CHART (Top on mobile, 8 cols on desktop) */}
                <div className="lg:col-span-8 flex flex-col h-full bg-[#161A1F] rounded-2xl border border-[#2B3139] overflow-hidden shadow-lg min-h-[380px] sm:min-h-[440px]">
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

                {/* BEST OPPORTUNITY & WHY SECTION (Right side on desktop, stacked below chart on mobile) */}
                <div className="lg:col-span-4 h-full space-y-4">
                  <BestOpportunityCard
                    opportunity={bestOpportunity}
                    onViewDetails={() => setCurrentPage('analysis')}
                    onViewAllOpportunities={() => setCurrentPage('opportunities')}
                    orderBook={orderBook}
                  />

                  {/* Mobile Quick Cross-Contract Comparator (Requirement #15) */}
                  <div className="p-4 bg-[#161A1F] rounded-2xl border border-[#2B3139] space-y-3 font-mono text-xs">
                    <div className="text-[10px] text-gold uppercase tracking-wider font-bold">
                      QUICK CROSS-CONTRACT COMPARATOR
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-muted block text-[10px] mb-1 font-sans">CONTRACT A</label>
                        <select
                          value={selectedSymbol}
                          onChange={(e) => setSelectedSymbol(e.target.value)}
                          className="w-full bg-[#11151A] text-foreground font-bold px-2.5 py-2 rounded-xl border border-[#2B3139] focus:outline-none min-h-[38px] touch-manipulation"
                        >
                          <option value="GOLDM">GOLDM (100g)</option>
                          <option value="GOLDTEN">GOLDTEN (10g)</option>
                          <option value="GOLDGUINEA">GOLDGUINEA (8g)</option>
                          <option value="GOLDPETAL">GOLDPETAL (1g)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-muted block text-[10px] mb-1 font-sans">CONTRACT B</label>
                        <select
                          value={compareSymbol}
                          onChange={(e) => setCompareSymbol(e.target.value)}
                          className="w-full bg-[#11151A] text-foreground font-bold px-2.5 py-2 rounded-xl border border-[#2B3139] focus:outline-none min-h-[38px] touch-manipulation"
                        >
                          <option value="GOLDTEN">GOLDTEN (10g)</option>
                          <option value="GOLDM">GOLDM (100g)</option>
                          <option value="GOLDGUINEA">GOLDGUINEA (8g)</option>
                          <option value="GOLDPETAL">GOLDPETAL (1g)</option>
                        </select>
                      </div>
                    </div>

                    {/* Normalized Comparison Readout */}
                    <div className="p-2.5 bg-[#11151A] rounded-xl border border-[#2B3139] space-y-1">
                      <div className="flex justify-between text-muted text-[11px]">
                        <span>{selectedSymbol} Fine Gold:</span>
                        <span className="text-foreground font-bold">₹{Math.round(selectedSnapshot?.normalizedPrice || 12842)}/g</span>
                      </div>
                      <div className="flex justify-between text-muted text-[11px]">
                        <span>{compareSymbol} Fine Gold:</span>
                        <span className="text-foreground font-bold">₹{Math.round(compareSnapshot?.normalizedPrice || 12895)}/g</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-[#2B3139] text-xs font-bold">
                        <span className="text-gold">Normalized Spread:</span>
                        <span className={Number(normDiffPercent) >= 0 ? 'text-buy' : 'text-sell'}>
                          {Number(normDiffPercent) >= 0 ? '+' : ''}{normDiffPercent}%
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setChartMode('spread');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full py-2 bg-[#11151A] hover:bg-[#1C2128] text-gold border border-gold/40 rounded-xl text-xs font-bold transition-colors min-h-[38px] touch-manipulation"
                    >
                      View Spread on Chart →
                    </button>
                  </div>
                </div>
              </div>

              {/* 3-Tab Bottom Section (Activity, Validation, Contract Specs) */}
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
              onSelectPair={() => {
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

      {/* ── 3. FIXED MOBILE BOTTOM NAVIGATION BAR ── */}
      <MobileBottomNav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenOnboarding={() => setShowOnboarding(true)}
        demoMode={demoMode}
        setDemoMode={setDemoMode}
        setDemoStep={setDemoStep}
      />

      {/* ── 4. CINEMATIC PITCH PRESENTATION MODAL ── */}
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

      {/* ── 5. GUIDED 8-STEP TOUR OVERLAY ── */}
      {demoMode && (
        <InteractiveDemoGuide
          demoStep={demoStep}
          setDemoStep={setDemoStep}
          onExit={() => setDemoMode(false)}
          onActionStep={handleDemoStepAction}
        />
      )}

      {/* ── 6. ONBOARDING WELCOME MODAL ── */}
      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}


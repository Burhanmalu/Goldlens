'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PageId, OHLCVCandle, OrderBookState, ContractSnapshot } from '@/lib/types';
import {
  getMockData, getLatestSnapshots, getCombinedNormalizedSeries,
  generateCandlestickData, generateOrderBook, getDetailedAuditSteps
} from '@/lib/mockData';
import { generateOpportunities } from '@/lib/relativeValue';
import { DEFAULT_SETTINGS } from '@/lib/settings';
import { useLiveMarketData } from '@/lib/liveMarketData';

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
import { ExecutionHubView } from '@/components/ExecutionHubView';
import { PitchPresentationModal } from '@/components/PitchPresentationModal';
import { InteractiveDemoGuide } from '@/components/InteractiveDemoGuide';
import { OnboardingModal } from '@/components/OnboardingModal';
import { LoginPage } from '@/components/LoginPage';
import { TradeAdvisorPanel } from '@/components/TradeAdvisorPanel';

export default function GoldLensApp() {
  // Authentication State (Login page opens first by default)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; deskId: string; role: string }>({
    email: 'desk.alpha@goldlens.quant',
    deskId: 'QUANT_DESK_ALPHA',
    role: 'Senior Arbitrage Quant',
  });

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

  // Flash state
  const [priceFlash, setPriceFlash] = useState<'green' | 'red' | null>(null);

  // Demo & Onboarding State
  const [demoMode, setDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);

  // Base Data
  const baseMockData = useMemo(() => getMockData(), []);
  const initialSnapshots = useMemo(() => getLatestSnapshots(baseMockData), [baseMockData]);
  const combinedSeries = useMemo(() => getCombinedNormalizedSeries(baseMockData), [baseMockData]);
  const auditStepsList = useMemo(() => getDetailedAuditSteps(), []);

  // Live Market Data Integration
  const liveMarket = useLiveMarketData(selectedSymbol, timeframe, 3500);

  // Dynamic Live State
  const [candles, setCandles] = useState<OHLCVCandle[]>(() => generateCandlestickData(selectedSymbol, timeframe));
  const [orderBook, setOrderBook] = useState<OrderBookState>(() => generateOrderBook(selectedSymbol));
  const [snapshots, setSnapshots] = useState<ContractSnapshot[]>(initialSnapshots);

  const [priceTickers, setPriceTickers] = useState<Record<string, { price: number; change: number; normalized: number }>>({
    GOLDM: { price: 149921, change: 1.07, normalized: 15067.4 },
    GOLDTEN: { price: 150279, change: 1.07, normalized: 15042.9 },
    GOLDGUINEA: { price: 120671, change: 1.05, normalized: 15099.0 },
    GOLDPETAL: { price: 15083, change: 1.02, normalized: 15098.1 },
  });

  // Sync state whenever real online market data arrives
  useEffect(() => {
    if (liveMarket.data) {
      if (liveMarket.data.snapshots && liveMarket.data.snapshots.length > 0) {
        setSnapshots(liveMarket.data.snapshots);
      }
      if (liveMarket.data.tickers) {
        setPriceTickers(liveMarket.data.tickers);
      }
      if (liveMarket.data.candles && liveMarket.data.candles.length > 0) {
        setCandles(liveMarket.data.candles);
      }
      if (liveMarket.data.orderBook) {
        setOrderBook(liveMarket.data.orderBook);
      }

      setPriceFlash('green');
      const t = setTimeout(() => setPriceFlash(null), 800);
      return () => clearTimeout(t);
    }
  }, [liveMarket.data]);

  // Re-generate chart candles on contract or timeframe change when offline
  useEffect(() => {
    if (!liveMarket.data) {
      setCandles(generateCandlestickData(selectedSymbol, timeframe));
      setOrderBook(generateOrderBook(selectedSymbol));
    }
  }, [selectedSymbol, timeframe, liveMarket.data]);

  // Dynamic Opportunity Generation based on live snapshots
  const opportunities = useMemo(() => {
    return generateOpportunities(baseMockData, DEFAULT_SETTINGS);
  }, [baseMockData]);

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

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="h-screen w-full min-h-screen overflow-hidden bg-[#0B0E11] text-[#EAECEF] flex select-none font-sans">
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
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* ── 2. MAIN APPLICATION WORKSPACE ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar with Live Stream Status, Hamburger & Ticker */}
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
          onLogout={() => setIsAuthenticated(false)}
          userName={currentUser.role}
          deskId={currentUser.deskId}
          isLiveOnline={liveMarket.isLiveOnline}
          dataSource={liveMarket.dataSource}
          lastUpdated={liveMarket.lastUpdated}
          onManualRefresh={liveMarket.refetch}
          isLoading={liveMarket.isLoading}
        />

        {/* Dynamic Route View (Scrollable with mobile bottom bar padding) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-20 lg:pb-8">
          {currentPage === 'dashboard' || currentPage === 'terminal' || currentPage === 'overview' ? (
            <div className="w-full flex flex-col">
              {/* Market Overview Header Banner */}
              <MarketOverviewHeader
                selectedSymbol={selectedSymbol}
                onSelectSymbol={setSelectedSymbol}
                snapshot={selectedSnapshot}
                priceFlash={priceFlash}
              />

              {/* 2-Column Desktop / 1-Column Stacked Mobile Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 p-2.5 sm:p-3 lg:p-4 pb-2 items-stretch">
                {/* FINANCIAL CHART (8 cols on desktop) */}
                <div className="lg:col-span-8 flex flex-col bg-[#161A1F] rounded-2xl border border-[#2B3139] overflow-hidden shadow-lg min-h-[460px]">
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

                {/* BEST OPPORTUNITY & UNIFIED COMPARATOR/DEPTH PANEL (4 cols on desktop) */}
                <div className="lg:col-span-4 flex flex-col min-h-[460px]">
                  <BestOpportunityCard
                    opportunity={bestOpportunity}
                    onViewDetails={() => setCurrentPage('analysis')}
                    onViewAllOpportunities={() => setCurrentPage('opportunities')}
                    onOpenAdvisor={() => setShowAdvisorModal(true)}
                    orderBook={orderBook}
                    selectedSymbol={selectedSymbol}
                    setSelectedSymbol={setSelectedSymbol}
                    compareSymbol={compareSymbol}
                    setCompareSymbol={setCompareSymbol}
                    selectedSnapshot={selectedSnapshot}
                    compareSnapshot={compareSnapshot}
                    normDiffPercent={normDiffPercent}
                    onViewSpreadOnChart={() => {
                      setChartMode('spread');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </div>
              </div>

              {/* Live MCX Gold Arbitrage & Carry Dislocation Matrix Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-2.5 sm:px-3 lg:px-4 py-2">
                {/* Pair 1: GOLDM vs GOLDTEN */}
                <div
                  onClick={() => {
                    setSelectedSymbol('GOLDM');
                    setCompareSymbol('GOLDTEN');
                    setChartMode('spread');
                  }}
                  className="p-3 bg-[#161A1F] hover:bg-[#1C2128] cursor-pointer rounded-2xl border border-gold/40 transition-all space-y-1 font-mono shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-foreground">GOLDM / GOLDTEN</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-buy/15 text-buy font-bold">● +2.41σ</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-muted font-sans">Observed Spread:</span>
                    <span className="text-xs font-bold text-buy">+0.33% (₹42/g)</span>
                  </div>
                  <div className="text-[10px] text-text-secondary flex justify-between pt-1 border-t border-[#2B3139]/60 font-sans">
                    <span>Friction Hurdle: 0.08%</span>
                    <span className="text-gold font-bold">EDGE SURVIVES</span>
                  </div>
                </div>

                {/* Pair 2: GOLDM vs GOLDGUINEA */}
                <div
                  onClick={() => {
                    setSelectedSymbol('GOLDM');
                    setCompareSymbol('GOLDGUINEA');
                    setChartMode('spread');
                  }}
                  className="p-3 bg-[#161A1F] hover:bg-[#1C2128] cursor-pointer rounded-2xl border border-[#2B3139] transition-all space-y-1 font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-foreground">GOLDM / GUINEA</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#11151A] text-muted font-bold">+0.82σ</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-muted font-sans">Observed Spread:</span>
                    <span className="text-xs font-bold text-foreground">+0.09% (₹11/g)</span>
                  </div>
                  <div className="text-[10px] text-text-secondary flex justify-between pt-1 border-t border-[#2B3139]/60 font-sans">
                    <span>Friction Hurdle: 0.09%</span>
                    <span className="text-muted">Fair Value</span>
                  </div>
                </div>

                {/* Pair 3: GOLDTEN vs GOLDPETAL */}
                <div
                  onClick={() => {
                    setSelectedSymbol('GOLDTEN');
                    setCompareSymbol('GOLDPETAL');
                    setChartMode('spread');
                  }}
                  className="p-3 bg-[#161A1F] hover:bg-[#1C2128] cursor-pointer rounded-2xl border border-gold/30 transition-all space-y-1 font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-foreground">GOLDTEN / PETAL</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-buy/15 text-buy font-bold">● +1.94σ</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-muted font-sans">Observed Spread:</span>
                    <span className="text-xs font-bold text-buy">+0.26% (₹33/g)</span>
                  </div>
                  <div className="text-[10px] text-text-secondary flex justify-between pt-1 border-t border-[#2B3139]/60 font-sans">
                    <span>Friction Hurdle: 0.11%</span>
                    <span className="text-gold font-bold">ACTIONABLE</span>
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
          ) : currentPage === 'execution-hub' ? (
            <ExecutionHubView />
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

      {/* ── 7. AI TRADE ADVISOR & PREDICTIVE SIZING MODAL ── */}
      {showAdvisorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <TradeAdvisorPanel
            selectedSymbol={selectedSymbol}
            compareSymbol={compareSymbol}
            opportunity={bestOpportunity}
            snapshots={snapshots}
            isModal={true}
            onClose={() => setShowAdvisorModal(false)}
            onExecuteTrade={() => {
              setShowAdvisorModal(false);
              setCurrentPage('execution-hub');
            }}
          />
        </div>
      )}
    </div>
  );
}

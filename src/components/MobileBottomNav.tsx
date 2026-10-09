'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard, Layers, Zap, MoreHorizontal,
  ShieldCheck, TrendingUp, BookOpen, Maximize2,
  HelpCircle, Sparkles, X, Cpu
} from 'lucide-react';
import { PageId } from '@/lib/types';

interface MobileBottomNavProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  onOpenOnboarding: () => void;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  setDemoStep: (val: number) => void;
}

export function MobileBottomNav({
  currentPage,
  setCurrentPage,
  onOpenOnboarding,
  demoMode,
  setDemoMode,
  setDemoStep,
}: MobileBottomNavProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainTabs = [
    { id: 'dashboard' as PageId, label: 'Home', icon: LayoutDashboard },
    { id: 'markets' as PageId, label: 'Markets', icon: Layers },
    { id: 'opportunities' as PageId, label: 'Opp.', icon: Zap, badge: '1' },
  ];

  const moreItems = [
    { id: 'execution-hub' as PageId, label: 'Execution & Quant Hub', icon: Cpu, desc: '1-click broker algo, SPAN relief & OU' },
    { id: 'analysis' as PageId, label: 'Analysis & Alpha Audit', icon: ShieldCheck, desc: '8-step signal validation & RV matrix' },
    { id: 'backtest' as PageId, label: 'Walk-Forward Backtest', icon: TrendingUp, desc: 'Out-of-sample statistical simulation' },
    { id: 'research' as PageId, label: 'Research Whitepaper', icon: BookOpen, desc: 'Mathematical normalization formulas' },
    { id: 'pitch' as PageId, label: 'Pitch Presentation', icon: Maximize2, desc: 'Hackathon deck & product vision' },
  ];

  const handleSelectMore = (id: PageId) => {
    setCurrentPage(id);
    setShowMoreMenu(false);
  };

  const isMoreActive =
    currentPage === 'execution-hub' ||
    currentPage === 'analysis' ||
    currentPage === 'alpha-audit' ||
    currentPage === 'relative-value' ||
    currentPage === 'backtest' ||
    currentPage === 'research' ||
    currentPage === 'pitch';

  return (
    <>
      {/* ── FIXED MOBILE BOTTOM NAVIGATION BAR ── */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#11151A]/95 backdrop-blur-lg border-t border-[#2B3139] px-2 py-1 flex items-center justify-around select-none pb-safe"
      >
        {mainTabs.map((tab) => {
          const isActive =
            currentPage === tab.id ||
            (currentPage === 'terminal' && tab.id === 'dashboard') ||
            (currentPage === 'overview' && tab.id === 'dashboard');
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setCurrentPage(tab.id);
                setShowMoreMenu(false);
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-all min-h-[48px] touch-manipulation relative ${
                isActive
                  ? 'text-gold font-bold'
                  : 'text-text-secondary hover:text-foreground'
              }`}
            >
              <div className="relative">
                <Icon size={18} className={isActive ? 'text-gold' : 'text-text-secondary'} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-gold text-background rounded-full text-[9px] font-mono font-black flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-sans leading-none">{tab.label}</span>
            </button>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-all min-h-[48px] touch-manipulation relative ${
            isMoreActive || showMoreMenu
              ? 'text-gold font-bold'
              : 'text-text-secondary hover:text-foreground'
          }`}
        >
          <MoreHorizontal size={18} className={isMoreActive || showMoreMenu ? 'text-gold' : 'text-text-secondary'} />
          <span className="text-[10px] mt-1 font-sans leading-none">More</span>
        </button>
      </nav>

      {/* ── MOBILE "MORE" BOTTOM SHEET MODAL ── */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setShowMoreMenu(false)}
          />

          {/* Sheet */}
          <div className="relative bg-[#161A1F] border-t border-[#2B3139] rounded-t-2xl p-5 space-y-4 max-h-[80vh] overflow-y-auto z-10 animate-slide-up pb-safe shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2B3139] pb-3">
              <div>
                <h3 className="text-base font-black text-foreground font-sans">GoldLens Intelligence</h3>
                <p className="text-xs text-text-secondary font-mono">Advanced Terminal & Analytics</p>
              </div>

              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-2 rounded-lg text-text-secondary hover:text-foreground hover:bg-[#1C2128] min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="space-y-1.5">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectMore(item.id)}
                    className={`w-full flex items-center gap-3.5 p-3 rounded-xl transition-all text-left min-h-[48px] touch-manipulation ${
                      isActive
                        ? 'bg-gold/15 text-gold border border-gold/40'
                        : 'bg-[#11151A] hover:bg-[#1C2128] text-foreground border border-[#2B3139]/60'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isActive ? 'bg-gold text-background' : 'bg-[#161A1F] text-gold border border-[#2B3139]'
                    }`}>
                      <Icon size={18} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">{item.label}</div>
                      <div className="text-[10px] text-text-secondary truncate mt-0.5">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2B3139]">
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onOpenOnboarding();
                }}
                className="py-2.5 px-3 bg-[#11151A] hover:bg-[#1C2128] border border-[#2B3139] rounded-xl text-xs font-semibold text-text-secondary hover:text-foreground flex items-center justify-center gap-1.5 min-h-[44px] touch-manipulation"
              >
                <HelpCircle size={14} className="text-gold" />
                <span>How It Works</span>
              </button>

              {!demoMode ? (
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    setDemoMode(true);
                    setDemoStep(0);
                    setCurrentPage('dashboard');
                  }}
                  className="py-2.5 px-3 bg-gold hover:bg-gold-hover text-background rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md min-h-[44px] touch-manipulation"
                >
                  <Sparkles size={14} />
                  <span>Start Demo</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    setDemoMode(false);
                    setDemoStep(0);
                  }}
                  className="py-2.5 px-3 bg-[#11151A] text-gold border border-gold/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px] touch-manipulation"
                >
                  <span>Exit Demo</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

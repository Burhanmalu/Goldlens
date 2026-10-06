'use client';

import React, { useState, useEffect } from 'react';
import {
  Hexagon, LayoutDashboard, Layers, Zap, ShieldCheck,
  TrendingUp, BookOpen, Sparkles, HelpCircle, Maximize2,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { PageId } from '@/lib/types';

interface AppSidebarProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  setDemoStep: (val: number) => void;
  onOpenOnboarding: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export function AppSidebar({
  currentPage,
  setCurrentPage,
  demoMode,
  setDemoMode,
  setDemoStep,
  onOpenOnboarding,
  isCollapsed,
  setIsCollapsed,
}: AppSidebarProps) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard' as PageId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'markets' as PageId, label: 'Markets', icon: Layers },
    { id: 'opportunities' as PageId, label: 'Opportunities', icon: Zap, badge: '1 Hot' },
    { id: 'analysis' as PageId, label: 'Analysis', icon: ShieldCheck },
    { id: 'backtest' as PageId, label: 'Backtest', icon: TrendingUp },
    { id: 'research' as PageId, label: 'Research', icon: BookOpen },
  ];

  return (
    <aside
      className={`h-screen bg-[#11151A] border-r border-[#2B3139] flex flex-col justify-between select-none transition-all duration-300 z-40 flex-shrink-0 ${
        isCollapsed ? 'w-16 min-w-[4rem]' : 'w-60 min-w-[15rem]'
      }`}
    >
      {/* ── TOP: BRANDING & TOGGLE ── */}
      <div>
        <div className="h-14 px-4 border-b border-[#2B3139] flex items-center justify-between">
          {!isCollapsed ? (
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="flex items-center gap-2.5 text-foreground font-bold tracking-tight hover:opacity-90 transition-opacity"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center text-background font-black shadow-md flex-shrink-0">
                <Hexagon size={16} className="fill-background stroke-background" />
              </div>
              <div className="text-left font-sans">
                <div className="font-extrabold text-sm tracking-wider text-foreground leading-none">
                  GOLD<span className="text-gold">LENS</span>
                </div>
                <div className="text-[10px] text-muted font-mono mt-0.5">MCX QUANT</div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="w-7 h-7 mx-auto rounded-lg bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center text-background font-black shadow-md flex-shrink-0"
              title="GoldLens Dashboard"
            >
              <Hexagon size={16} className="fill-background stroke-background" />
            </button>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md text-text-secondary hover:text-foreground hover:bg-[#161A1F] transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* ── NAVIGATION LINKS ── */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              currentPage === item.id ||
              (currentPage === 'terminal' && item.id === 'dashboard') ||
              (currentPage === 'overview' && item.id === 'dashboard') ||
              (currentPage === 'alpha-audit' && item.id === 'analysis') ||
              (currentPage === 'relative-value' && item.id === 'analysis');

            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#161A1F] text-gold border border-gold/40 shadow-sm'
                    : 'text-text-secondary hover:text-foreground hover:bg-[#161A1F]/60'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={17} className={isActive ? 'text-gold' : 'text-text-secondary flex-shrink-0'} />
                {!isCollapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto px-1.5 py-0.2 bg-gold/15 text-gold border border-gold/30 rounded text-[10px] font-mono font-bold">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── BOTTOM CONTROLS & UTILITIES ── */}
      <div className="p-3 border-t border-[#2B3139] space-y-2">
        {/* Start Guided Demo Button */}
        {!demoMode ? (
          <button
            onClick={() => {
              setDemoMode(true);
              setDemoStep(0);
              setCurrentPage('dashboard');
            }}
            className={`w-full py-2 bg-gold hover:bg-gold-hover text-background font-bold text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-2 ${
              isCollapsed ? 'px-1' : 'px-3'
            }`}
            title="Start Guided Demo"
          >
            <Sparkles size={14} className="flex-shrink-0" />
            {!isCollapsed && <span>Start Demo</span>}
          </button>
        ) : (
          <button
            onClick={() => {
              setDemoMode(false);
              setDemoStep(0);
            }}
            className="w-full py-2 bg-[#161A1F] text-gold border border-gold/50 rounded-lg text-xs font-bold hover:bg-[#1C2128] transition-all flex items-center justify-center gap-1.5"
            title="Exit Demo"
          >
            <span>Exit Demo</span>
          </button>
        )}

        {/* How It Works Guide */}
        <button
          onClick={onOpenOnboarding}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-foreground hover:bg-[#161A1F] transition-colors"
          title="How GoldLens Works"
        >
          <HelpCircle size={15} className="text-gold flex-shrink-0" />
          {!isCollapsed && <span>How It Works</span>}
        </button>

        {/* Pitch Mode Presentation */}
        <button
          onClick={() => setCurrentPage('pitch')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-foreground hover:bg-[#161A1F] transition-colors"
          title="Pitch Presentation Mode"
        >
          <Maximize2 size={15} className="flex-shrink-0" />
          {!isCollapsed && <span>Pitch Deck</span>}
        </button>

        {/* Live Feed Status Pill */}
        {!isCollapsed && (
          <div className="pt-2 border-t border-[#2B3139]/60 px-2 py-1 text-[11px] font-mono text-muted flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-buy animate-pulse" />
              <span className="text-buy font-bold">MCX Live</span>
            </div>
            <span>{timeStr} IST</span>
          </div>
        )}
      </div>
    </aside>
  );
}

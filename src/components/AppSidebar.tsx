'use client';

import React, { useState, useEffect } from 'react';
import {
  Hexagon, LayoutDashboard, Layers, Zap, ShieldCheck,
  TrendingUp, BookOpen, Sparkles, HelpCircle, Maximize2,
  ChevronLeft, ChevronRight, LogOut, Cpu
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
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onLogout?: () => void;
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
  isMobileOpen = false,
  onCloseMobile,
  onLogout,
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
    { id: 'execution-hub' as PageId, label: 'Execution & Quant Hub', icon: Cpu, badge: 'New' },
    { id: 'analysis' as PageId, label: 'Analysis & Alpha Audit', icon: ShieldCheck },
    { id: 'backtest' as PageId, label: 'Backtest Station', icon: TrendingUp },
    { id: 'research' as PageId, label: 'Research Whitepaper', icon: BookOpen },
  ];

  const handleSelectPage = (id: PageId) => {
    setCurrentPage(id);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (isMobile: boolean) => (
    <div className="h-full flex flex-col justify-between">
      {/* ── TOP: BRANDING & TOGGLE ── */}
      <div>
        <div className="h-14 px-4 border-b border-[#2B3139] flex items-center justify-between">
          {!isCollapsed || isMobile ? (
            <button
              onClick={() => handleSelectPage('dashboard')}
              className="flex items-center gap-2.5 text-foreground font-bold tracking-tight hover:opacity-90 transition-opacity"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center text-background font-black shadow-md flex-shrink-0">
                <Hexagon size={16} className="fill-background stroke-background" />
              </div>
              <div className="text-left font-sans">
                <div className="font-extrabold text-sm tracking-wider text-foreground leading-none">
                  GOLD<span className="text-gold">LENS</span>
                </div>
                <div className="text-[10px] text-muted font-mono mt-0.5">MCX QUANT TERMINAL</div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => handleSelectPage('dashboard')}
              className="w-7 h-7 mx-auto rounded-lg bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center text-background font-black shadow-md flex-shrink-0"
              title="GoldLens Dashboard"
            >
              <Hexagon size={16} className="fill-background stroke-background" />
            </button>
          )}

          {isMobile ? (
            <button
              onClick={onCloseMobile}
              className="p-2 rounded-lg text-text-secondary hover:text-foreground hover:bg-[#161A1F] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <ChevronLeft size={20} />
            </button>
          ) : (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-md text-text-secondary hover:text-foreground hover:bg-[#161A1F] transition-colors"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </button>
          )}
        </div>

        {/* ── NAVIGATION LINKS ── */}
        <nav className="p-3 space-y-1.5">
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
                onClick={() => handleSelectPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[44px] touch-manipulation ${
                  isActive
                    ? 'bg-[#161A1F] text-gold border border-gold/40 shadow-sm ring-1 ring-gold/20'
                    : 'text-text-secondary hover:text-foreground hover:bg-[#161A1F]/60'
                }`}
                title={isCollapsed && !isMobile ? item.label : undefined}
              >
                <Icon size={18} className={isActive ? 'text-gold flex-shrink-0' : 'text-text-secondary flex-shrink-0'} />
                {(!isCollapsed || isMobile) && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto px-1.5 py-0.5 bg-gold/15 text-gold border border-gold/30 rounded text-[10px] font-mono font-bold">
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
              handleSelectPage('dashboard');
            }}
            className={`w-full py-2.5 bg-gold hover:bg-gold-hover text-background font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 min-h-[44px] touch-manipulation ${
              isCollapsed && !isMobile ? 'px-1' : 'px-3'
            }`}
            title="Start Guided Demo"
          >
            <Sparkles size={15} className="flex-shrink-0" />
            {(!isCollapsed || isMobile) && <span>Start Demo</span>}
          </button>
        ) : (
          <button
            onClick={() => {
              setDemoMode(false);
              setDemoStep(0);
            }}
            className="w-full py-2.5 bg-[#161A1F] text-gold border border-gold/50 rounded-xl text-xs font-bold hover:bg-[#1C2128] transition-all flex items-center justify-center gap-1.5 min-h-[44px] touch-manipulation"
            title="Exit Demo"
          >
            <span>Exit Demo</span>
          </button>
        )}

        {/* How It Works Guide */}
        <button
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            onOpenOnboarding();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-text-secondary hover:text-foreground hover:bg-[#161A1F] transition-colors min-h-[44px] touch-manipulation"
          title="How GoldLens Works"
        >
          <HelpCircle size={16} className="text-gold flex-shrink-0" />
          {(!isCollapsed || isMobile) && <span>How It Works</span>}
        </button>

        {/* Pitch Mode Presentation */}
        <button
          onClick={() => handleSelectPage('pitch')}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-text-secondary hover:text-foreground hover:bg-[#161A1F] transition-colors min-h-[44px] touch-manipulation"
          title="Pitch Presentation Mode"
        >
          <Maximize2 size={16} className="flex-shrink-0" />
          {(!isCollapsed || isMobile) && <span>Pitch Deck</span>}
        </button>

        {/* Lock Terminal / Logout Button */}
        {onLogout && (
          <button
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              onLogout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-sell hover:bg-sell/10 transition-colors min-h-[40px] touch-manipulation"
            title="Lock Terminal & Sign Out"
          >
            <LogOut size={16} className="text-muted group-hover:text-sell flex-shrink-0" />
            {(!isCollapsed || isMobile) && <span>Lock Terminal</span>}
          </button>
        )}

        {/* Live Feed Status Pill */}
        {(!isCollapsed || isMobile) && (
          <div className="pt-2 border-t border-[#2B3139]/60 px-2 py-1 text-[11px] font-mono text-muted flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-buy animate-pulse" />
              <span className="text-buy font-bold">MCX Live</span>
            </div>
            <span>{timeStr} IST</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR (1024px+) ── */}
      <aside
        className={`app-desktop-sidebar hidden lg:flex h-screen bg-[#11151A] border-r border-[#2B3139] flex-col justify-between select-none transition-all duration-300 z-30 flex-shrink-0 ${
          isCollapsed ? 'w-16 min-w-[4rem]' : 'w-60 min-w-[15rem]'
        }`}
      >
        {sidebarContent(false)}
      </aside>

      {/* ── MOBILE SLIDE-IN DRAWER (< 1024px) ── */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer container */}
          <div className="relative w-72 max-w-[85vw] h-full bg-[#11151A] border-r border-[#2B3139] shadow-2xl z-10 animate-slide-left flex flex-col">
            {sidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
}

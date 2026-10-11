'use client';

import React from 'react';
import { Menu, Hexagon, User, Bell, Sparkles, RefreshCw } from 'lucide-react';
import { TickerRibbon } from './TickerRibbon';

interface TopHeaderBarProps {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  priceTickers: Record<string, { price: number; change: number; normalized: number }>;
  onOpenMobileMenu?: () => void;
  demoMode?: boolean;
  onToggleDemo?: () => void;
  onNavigateHome?: () => void;
  onLogout?: () => void;
  userName?: string;
  deskId?: string;
  isLiveOnline?: boolean;
  dataSource?: string;
  lastUpdated?: string;
  onManualRefresh?: () => void;
  isLoading?: boolean;
  onOpenAiAssistant?: () => void;
}

export function TopHeaderBar({
  selectedSymbol,
  onSelectSymbol,
  priceTickers,
  onOpenMobileMenu,
  demoMode = false,
  onToggleDemo,
  onNavigateHome,
  onLogout,
  userName = 'Trader',
  deskId = 'QUANT_DESK',
  isLiveOnline = true,
  dataSource = 'MCX Low-Latency Feed Engine',
  lastUpdated = '',
  onManualRefresh,
  isLoading = false,
  onOpenAiAssistant,
}: TopHeaderBarProps) {
  return (
    <div className="flex flex-col flex-shrink-0 z-20 select-none w-full">
      {/* ── MOBILE TOP BAR (< 1024px) ── */}
      <header className="h-12 bg-[#11151A] border-b border-[#2B3139] flex lg:hidden items-center justify-between px-3 text-xs">
        {/* Left: Hamburger Button & Status */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 -ml-1 text-text-secondary hover:text-foreground hover:bg-[#161A1F] rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Open Navigation Menu"
          >
            <Menu size={20} className="text-foreground" />
          </button>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#161A1F] border border-[#2B3139]">
            <span className="w-2 h-2 rounded-full bg-gold" />
            <span className="text-[10px] font-mono font-bold text-foreground">
              MCX SETTLEMENT
            </span>
          </div>
        </div>

        {/* Center: GoldLens Logo */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-foreground font-bold tracking-tight hover:opacity-90 transition-opacity"
        >
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center text-background font-black shadow-sm">
            <Hexagon size={14} className="fill-background stroke-background" />
          </div>
          <span className="font-extrabold text-sm tracking-wider text-foreground font-sans">
            GOLD<span className="text-gold">LENS</span>
          </span>
        </button>

        {/* Right: AI Assistant & Profile */}
        <div className="flex items-center gap-1.5">
          {onOpenAiAssistant && (
            <button
              onClick={onOpenAiAssistant}
              className="px-2 py-1 rounded-lg bg-gold/15 text-gold border border-gold/30 flex items-center gap-1 text-[11px] font-bold"
            >
              <Sparkles size={12} />
              <span>AI</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 bg-[#161A1F] hover:bg-sell/20 text-text-secondary hover:text-sell rounded-lg border border-[#2B3139] transition-colors"
              title="Sign Out / Lock Terminal"
            >
              <User size={14} />
            </button>
          )}
        </div>
      </header>

      {/* ── DESKTOP TOP BAR (1024px+) ── */}
      <header className="hidden lg:flex h-12 bg-[#11151A] border-b border-[#2B3139] items-center justify-between px-5 text-xs">
        {/* Left: Terminal Header Title & Honest Settlement Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            <span className="font-mono font-bold text-xs text-foreground uppercase tracking-wider">
              MCX GOLD SETTLEMENT ANALYTICS
            </span>
          </div>
          <span className="text-muted font-mono text-xs">•</span>
          <span className="text-text-secondary font-mono text-xs">
            Based on MCX settlement of 09 Oct 2026
          </span>
        </div>

        {/* Right: Settlement Data Badge, AI Quant Assistant & User Desk */}
        <div className="flex items-center gap-3">
          {/* Settlement Badge */}
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#161A1F] border border-[#2B3139] font-mono text-xs"
            title="Data source: Official MCX Bhavcopy End-of-Day Settlement"
          >
            <span className="w-2 h-2 rounded-full bg-buy" />
            <span className="text-foreground font-semibold">
              SETTLEMENT DATA (09-OCT-2026)
            </span>
          </div>

          {/* AI Quant Assistant Trigger Button */}
          {onOpenAiAssistant && (
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/15 hover:bg-gold/25 text-gold border border-gold/40 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Sparkles size={13} className="text-gold" />
              <span>AI Quant Analyst</span>
            </button>
          )}

          <button
            className="relative p-2 text-text-secondary hover:text-foreground hover:bg-[#161A1F] rounded-xl border border-[#2B3139] transition-colors"
            title="Notifications"
          >
            <Bell size={14} />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-sell text-white font-mono font-bold text-[9px] rounded-full flex items-center justify-center">
              1
            </span>
          </button>

          <div className="flex items-center gap-2 bg-[#161A1F] px-3 py-1 rounded-xl border border-[#2B3139]">
            <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center text-gold font-mono font-bold text-[10px]">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="font-mono text-xs text-foreground font-semibold">
              {deskId}
            </span>
            {onLogout && (
              <button
                onClick={onLogout}
                className="ml-1 text-xs text-muted hover:text-sell transition-colors font-mono"
                title="Sign Out"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── FULL-WIDTH RESPONSIVE TICKER RIBBON (Spans cleanly across entire workspace) ── */}
      <TickerRibbon
        selectedSymbol={selectedSymbol}
        onSelectSymbol={onSelectSymbol}
        priceTickers={priceTickers}
      />
    </div>
  );
}

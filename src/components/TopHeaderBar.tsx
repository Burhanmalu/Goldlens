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
            <span className={`w-2 h-2 rounded-full ${isLiveOnline ? 'bg-buy animate-pulse' : 'bg-gold'}`} />
            <span className="text-[10px] font-mono font-bold text-foreground">
              {isLiveOnline ? 'LIVE' : 'SYNC'}
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

        {/* Right: Refresh & Profile */}
        <div className="flex items-center gap-1.5">
          {onManualRefresh && (
            <button
              onClick={onManualRefresh}
              className={`p-1.5 text-text-secondary hover:text-gold hover:bg-[#161A1F] rounded-lg border border-[#2B3139] transition-all ${
                isLoading ? 'animate-spin text-gold' : ''
              }`}
              title="Refresh Live Data"
            >
              <RefreshCw size={13} />
            </button>
          )}

          {onToggleDemo && (
            <button
              onClick={onToggleDemo}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] flex items-center gap-1 ${
                demoMode
                  ? 'bg-gold/20 text-gold border border-gold/40'
                  : 'text-text-secondary hover:text-foreground'
              }`}
              title={demoMode ? 'Exit Demo' : 'Start Demo'}
            >
              <Sparkles size={14} className={demoMode ? 'text-gold' : 'text-text-secondary'} />
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
        {/* Left: Terminal Header Title & Live Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-buy animate-pulse" />
            <span className="font-mono font-bold text-xs text-foreground uppercase tracking-wider">
              MCX GOLD QUANT TERMINAL
            </span>
          </div>
          <span className="text-muted font-mono text-xs">•</span>
          <span className="text-text-secondary font-mono text-xs">
            Multi-Contract Arbitrage Engine
          </span>
        </div>

        {/* Right: Live Feed Status, Refresh, Notifications & User Desk */}
        <div className="flex items-center gap-3">
          {/* Live Data Badge */}
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#161A1F] border border-[#2B3139] font-mono text-xs"
            title={`Source: ${dataSource}${lastUpdated ? ` • Last sync: ${lastUpdated}` : ''}`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLiveOnline ? 'bg-buy' : 'bg-gold'} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveOnline ? 'bg-buy' : 'bg-gold'}`} />
            </span>
            <span className="text-foreground font-semibold flex items-center gap-1">
              {isLiveOnline ? 'REAL-TIME LIVE' : 'SYNCED FEED'}
            </span>
            {lastUpdated && (
              <span className="text-[11px] text-muted hidden xl:inline">
                {lastUpdated}
              </span>
            )}
            {onManualRefresh && (
              <button
                onClick={onManualRefresh}
                className={`ml-1 text-muted hover:text-gold transition-colors ${isLoading ? 'animate-spin text-gold' : ''}`}
                title="Force Refresh Data Now"
              >
                <RefreshCw size={12} />
              </button>
            )}
          </div>

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

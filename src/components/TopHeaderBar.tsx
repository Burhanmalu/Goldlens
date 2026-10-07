import React from 'react';
import { Menu, Hexagon, User, Bell, Sparkles } from 'lucide-react';
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
}: TopHeaderBarProps) {
  return (
    <div className="flex flex-col flex-shrink-0 z-20 select-none">
      {/* ── MOBILE TOP BAR (Only on < 1024px) ── */}
      <header className="h-12 bg-[#11151A] border-b border-[#2B3139] flex lg:hidden items-center justify-between px-3 text-xs">
        {/* Left: Hamburger Button */}
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-1 text-text-secondary hover:text-foreground hover:bg-[#161A1F] rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} className="text-foreground" />
        </button>

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

        {/* Right: Demo Toggle & User Profile */}
        <div className="flex items-center gap-2">
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

          {onLogout ? (
            <button
              onClick={onLogout}
              className="p-1.5 bg-[#161A1F] hover:bg-sell/20 text-text-secondary hover:text-sell rounded-lg border border-[#2B3139] transition-colors"
              title="Sign Out / Lock Terminal"
            >
              <User size={14} />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-[#2B3139]">
              <span className="w-2 h-2 rounded-full bg-buy animate-pulse" title="MCX Live Feed Active" />
              <div className="w-6 h-6 rounded-full bg-[#161A1F] border border-[#2B3139] flex items-center justify-center text-text-secondary">
                <User size={12} />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── DESKTOP TOP BAR & TICKER RIBBON (1024px+) ── */}
      <header className="hidden lg:flex h-12 bg-[#11151A] border-b border-[#2B3139] items-center justify-between px-4 text-xs">
        {/* LEFT: 4-Contract Quick Ticker */}
        <div className="flex-1 overflow-x-auto flex items-center">
          <TickerRibbon
            selectedSymbol={selectedSymbol}
            onSelectSymbol={onSelectSymbol}
            priceTickers={priceTickers}
          />
        </div>

        {/* RIGHT: Notifications & User Desk */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#2B3139] flex-shrink-0">
          <button
            className="relative p-1.5 text-text-secondary hover:text-foreground hover:bg-[#161A1F] rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell size={15} />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-sell text-white font-mono font-bold text-[9px] rounded-full flex items-center justify-center">
              1
            </span>
          </button>

          <div className="flex items-center gap-2 bg-[#161A1F] px-2.5 py-1 rounded-xl border border-[#2B3139]">
            <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center text-gold font-mono font-bold text-[10px]">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="font-mono text-[11px] text-foreground font-semibold">
              {deskId}
            </span>
            {onLogout && (
              <button
                onClick={onLogout}
                className="ml-1 text-[10px] text-muted hover:text-sell transition-colors font-mono"
                title="Sign Out"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── MOBILE HORIZONTAL TICKER RIBBON (Visible below top bar on mobile) ── */}
      <div className="block lg:hidden">
        <TickerRibbon
          selectedSymbol={selectedSymbol}
          onSelectSymbol={onSelectSymbol}
          priceTickers={priceTickers}
        />
      </div>
    </div>
  );
}

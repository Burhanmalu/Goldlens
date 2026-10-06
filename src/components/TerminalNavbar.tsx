'use client';

import React, { useState, useEffect } from 'react';
import {
  Hexagon, Sparkles, User, HelpCircle
} from 'lucide-react';
import { PageId } from '@/lib/types';

interface TerminalNavbarProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  setDemoStep: (val: number) => void;
  onOpenOnboarding: () => void;
}

export function TerminalNavbar({
  currentPage,
  setCurrentPage,
  demoMode,
  setDemoMode,
  setDemoStep,
  onOpenOnboarding,
}: TerminalNavbarProps) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks: { id: PageId; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'markets', label: 'Markets' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'backtest', label: 'Backtest' },
    { id: 'research', label: 'Research' },
  ];

  return (
    <header className="h-14 bg-[#11151A] border-b border-[#2B3139] flex items-center justify-between px-5 select-none flex-shrink-0 z-40">
      {/* LEFT: Clean Branding & Simple Navigation */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="flex items-center gap-2.5 text-foreground font-bold tracking-tight hover:opacity-90 transition-opacity"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center text-background font-black shadow-md">
            <Hexagon size={16} className="fill-background stroke-background" />
          </div>
          <span className="font-extrabold text-base tracking-wider text-foreground font-sans">
            GOLD<span className="text-gold">LENS</span>
          </span>
        </button>

        {/* Simplified Nav Tabs */}
        <nav className="flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive =
              currentPage === link.id ||
              (currentPage === 'terminal' && link.id === 'dashboard') ||
              (currentPage === 'overview' && link.id === 'dashboard') ||
              (currentPage === 'alpha-audit' && link.id === 'analysis') ||
              (currentPage === 'relative-value' && link.id === 'analysis');

            return (
              <button
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#161A1F] text-gold border border-[#2B3139] shadow-sm'
                    : 'text-text-secondary hover:text-foreground hover:bg-[#161A1F]/60'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* RIGHT: Demo Mode, Onboarding, Time & User */}
      <div className="flex items-center gap-3.5">
        {/* Live Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-[#161A1F] rounded-full border border-[#2B3139] text-xs font-medium text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-buy animate-pulse" />
          <span>MCX Live Feed</span>
          <span className="text-muted font-mono text-[11px] ml-1">{timeStr}</span>
        </div>

        {/* How It Works Guide Button */}
        <button
          onClick={onOpenOnboarding}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161A1F] hover:bg-[#1C2128] text-text-secondary hover:text-foreground rounded-lg border border-[#2B3139] text-xs font-medium transition-colors"
          title="How GoldLens Works"
        >
          <HelpCircle size={14} className="text-gold" />
          <span className="hidden sm:inline">How It Works</span>
        </button>

        {/* Start Guided Demo Mode Button */}
        {!demoMode ? (
          <button
            onClick={() => {
              setDemoMode(true);
              setDemoStep(0);
              setCurrentPage('dashboard');
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gold hover:bg-gold-hover text-background font-bold text-xs rounded-lg transition-all shadow-md"
          >
            <Sparkles size={13} />
            <span>Start Demo</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setDemoMode(false);
              setDemoStep(0);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161A1F] text-gold border border-gold/50 rounded-lg text-xs font-bold hover:bg-[#1C2128] transition-all"
          >
            <span>Exit Demo</span>
          </button>
        )}

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#2B3139]">
          <div className="w-7 h-7 rounded-full bg-[#161A1F] border border-[#2B3139] flex items-center justify-center text-text-secondary">
            <User size={14} />
          </div>
        </div>
      </div>
    </header>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Hexagon, Lock, Mail, Eye, EyeOff,
  ArrowRight, Sparkles, CheckCircle2, AlertCircle,
  Terminal, Zap, Shield
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (userData: { email: string; deskId: string; role: string }) => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('desk.alpha@goldlens.quant');
  const [password, setPassword] = useState('••••••••••••');
  const [deskId, setDeskId] = useState('DESK_ALPHA_01');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter valid terminal credentials.');
      return;
    }

    setIsLoading(true);

    // Simulate ultra-fast high-frequency terminal authentication handshake
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email: email || 'desk.alpha@goldlens.quant',
        deskId: deskId || 'QUANT_DESK_ALPHA',
        role: 'Senior Arbitrage Quant',
      });
    }, 700);
  };

  const handleInstantDemoLogin = () => {
    setIsLoading(true);
    setEmail('guest.trader@goldlens.quant');
    setPassword('demopassword123');
    setDeskId('QUANT_DEMO_DESK');

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email: 'guest.trader@goldlens.quant',
        deskId: 'QUANT_DEMO_DESK',
        role: 'Institutional Guest Trader',
      });
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0E11] text-foreground flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* ── BACKGROUND AMBIENT GLOWS & GRID ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Golden radial gradient top center */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gold/10 rounded-full blur-[140px]" />
        {/* Blue carry glow bottom right */}
        <div className="absolute -bottom-40 right-10 w-[500px] h-[400px] bg-[#3861FB]/10 rounded-full blur-[120px]" />

        {/* Subtle Bloomberg/Trading grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#F0B90B 1px, transparent 1px), linear-gradient(90deg, #F0B90B 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* ── TOP LIVE TICKER HEADER ── */}
      <header className="relative z-10 w-full border-b border-[#2B3139]/70 bg-[#11151A]/80 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center text-background font-black shadow-md shadow-gold/20">
            <Hexagon size={18} className="fill-background stroke-background" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-wider text-foreground font-sans">
              GOLD<span className="text-gold">LENS</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase text-muted tracking-widest border-l border-[#2B3139] pl-2">
              MCX QUANT DESK
            </span>
          </div>
        </div>

        {/* Top Right Live Telemetry */}
        <div className="flex items-center gap-3 sm:gap-6 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-buy">
            <span className="w-2 h-2 rounded-full bg-buy animate-pulse" />
            <span className="hidden sm:inline text-muted">FEED:</span>
            <span className="font-bold">MCX LIVE (0.01ms)</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-gold bg-gold/10 px-2.5 py-1 rounded-full border border-gold/30 text-[11px] font-bold">
            <Zap size={12} />
            <span>DISLOCATION ACTIVE (+2.41σ)</span>
          </div>
        </div>
      </header>

      {/* ── MAIN LOGIN CONTAINER ── */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-[440px] bg-[#161A1F]/90 backdrop-blur-2xl border border-[#2B3139] shadow-2xl rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle top border gold accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

          {/* Header & Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 mb-3 shadow-inner">
              <Terminal size={24} className="text-gold" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {authMode === 'signin' ? 'Institutional Terminal Access' : 'Create Desk Account'}
            </h1>
            <p className="text-xs text-text-secondary mt-1 max-w-xs mx-auto">
              Real-time multi-contract MCX gold arbitrage & statistical carry execution platform.
            </p>
          </div>

          {/* Quick Demo Instant Access Button */}
          <button
            type="button"
            onClick={handleInstantDemoLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 mb-5 bg-gradient-to-r from-gold/20 via-gold/30 to-amber-500/20 hover:from-gold/30 hover:to-amber-500/30 text-gold border border-gold/50 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-gold/10 group"
          >
            <Sparkles size={15} className="text-gold group-hover:rotate-12 transition-transform" />
            <span>INSTANT ONE-CLICK DEMO LOGIN</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="w-full border-t border-[#2B3139]" />
            <span className="absolute bg-[#161A1F] px-3 text-[10px] font-mono text-muted uppercase tracking-wider">
              Or Sign In With Key
            </span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-sell/15 border border-sell/30 text-sell text-xs flex items-center gap-2 animate-shake">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-sans">
            {/* Email / Desk ID Input */}
            <div>
              <label className="block text-[11px] font-semibold text-muted uppercase font-mono mb-1.5">
                Quant Desk ID / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Mail size={16} />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@goldlens.quant"
                  required
                  className="w-full bg-[#11151A] text-foreground font-mono text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#2B3139] focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/40 transition-all placeholder:text-muted/60"
                />
              </div>
            </div>

            {/* Password / Security Key */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-semibold text-muted uppercase font-mono">
                  Security Key / Passphrase
                </label>
                <button
                  type="button"
                  onClick={() => alert('Demo Key: Enter any password or click Instant One-Click Demo Login.')}
                  className="text-[10px] text-gold hover:underline font-mono"
                >
                  Forgot Key?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#11151A] text-foreground font-mono text-xs pl-10 pr-10 py-2.5 rounded-xl border border-[#2B3139] focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/40 transition-all placeholder:text-muted/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Terminal Session Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-text-secondary hover:text-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#2B3139] bg-[#11151A] text-gold focus:ring-0 focus:ring-offset-0 cursor-pointer w-3.5 h-3.5"
                />
                <span className="text-[11px]">Remember terminal session</span>
              </label>

              <span className="text-[10px] font-mono text-buy flex items-center gap-1 font-semibold">
                <Shield size={11} />
                <span>256-Bit Encrypted</span>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gold hover:bg-gold-hover text-background font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/20 active:scale-[0.99] disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Feed...</span>
                </>
              ) : (
                <>
                  <span>AUTHENTICATE & ENTER TERMINAL</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Mode Switch Footer */}
          <div className="mt-5 pt-4 border-t border-[#2B3139] flex items-center justify-between text-xs text-text-secondary">
            <span>
              {authMode === 'signin' ? 'New institutional desk?' : 'Already have desk credentials?'}
            </span>
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                setErrorMessage(null);
              }}
              className="text-gold font-bold hover:underline font-mono"
            >
              {authMode === 'signin' ? 'Request Access →' : 'Sign In →'}
            </button>
          </div>
        </div>
      </main>

      {/* ── FOOTER LIVE MARKET TICKER STRIP ── */}
      <footer className="relative z-10 w-full border-t border-[#2B3139]/70 bg-[#11151A]/80 backdrop-blur-md px-4 py-2.5 font-mono text-[11px] text-muted flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full sm:w-auto justify-center sm:justify-start">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="font-bold text-foreground">GOLDM:</span>
            <span className="text-buy">₹1,28,411 (+0.43%)</span>
          </div>
          <span className="text-[#2B3139]">|</span>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="font-bold text-foreground">GOLDTEN:</span>
            <span className="text-buy">₹1,29,180 (+0.38%)</span>
          </div>
          <span className="text-[#2B3139] hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap">
            <span className="font-bold text-gold">SPREAD DISLOCATION:</span>
            <span className="text-buy font-bold">+0.33% (Survives Friction)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-text-secondary flex-shrink-0">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={11} className="text-buy" />
            <span>Audit Validated</span>
          </span>
          <span>•</span>
          <span>MCX Regulatory Compliant</span>
        </div>
      </footer>
    </div>
  );
}

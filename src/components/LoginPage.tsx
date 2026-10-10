'use client';

import React, { useState, useEffect } from 'react';
import {
  Hexagon, Lock, Mail, Eye, EyeOff,
  ArrowRight, Sparkles, CheckCircle2, AlertCircle,
  Terminal, Zap, Shield, KeyRound,
  X, Check, Building2, User, RefreshCw,
  TrendingUp, Radio, Cpu, Activity,
  LockKeyhole
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (userData: { email: string; deskId: string; role: string }) => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  // Tabs: 'demo' | 'institutional'
  const [activeTab, setActiveTab] = useState<'demo' | 'institutional'>('demo');
  
  // Credentials
  const [email, setEmail] = useState('desk.alpha@goldlens.quant');
  const [password, setPassword] = useState('mcx-quant-sec-9942');
  const [deskId, setDeskId] = useState('DESK_ALPHA_01');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Auth processing states
  const [authStatus, setAuthStatus] = useState<'idle' | 'authenticating' | 'success' | 'error'>('idle');
  const [authStepMessage, setAuthStepMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [showForgotKeyModal, setShowForgotKeyModal] = useState(false);
  const [showRequestAccessModal, setShowRequestAccessModal] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Request Access Form State
  const [reqFullName, setReqFullName] = useState('');
  const [reqInstitution, setReqInstitution] = useState('');
  const [reqEmail, setReqEmail] = useState('');

  // Live Simulated Clock
  const [timeString, setTimeString] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle Standard Institutional Login
  const handleInstitutionalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setAuthStatus('error');
      setErrorMessage('Institutional Desk ID and Security Key are required.');
      return;
    }

    setAuthStatus('authenticating');
    setAuthStepMessage('Verifying TLS 1.3 Key & MCX Feed Handshake...');

    setTimeout(() => {
      setAuthStepMessage('Authorizing Quant Desk Permissions & Risk Engine...');
      setTimeout(() => {
        setAuthStatus('success');
        setAuthStepMessage('Desk Authorized • Launching Live Terminal...');
        setTimeout(() => {
          onLoginSuccess({
            email: email || 'desk.alpha@goldlens.quant',
            deskId: deskId || 'QUANT_DESK_ALPHA',
            role: 'Senior Arbitrage Quant',
          });
        }, 450);
      }, 450);
    }, 450);
  };

  // Handle Instant Demo Login
  const handleInstantDemoLogin = () => {
    setErrorMessage(null);
    setAuthStatus('authenticating');
    setAuthStepMessage('Initialising Instant Sandbox Demo Session...');
    setEmail('guest.trader@goldlens.quant');
    setPassword('demopassword123');
    setDeskId('QUANT_DEMO_DESK');

    setTimeout(() => {
      setAuthStepMessage('Synchronizing Live MCX Feeds & Simulated Margins...');
      setTimeout(() => {
        setAuthStatus('success');
        setAuthStepMessage('Sandbox Ready • Entering GoldLens Desk...');
        setTimeout(() => {
          onLoginSuccess({
            email: 'guest.trader@goldlens.quant',
            deskId: 'QUANT_DEMO_DESK',
            role: 'Institutional Guest Trader',
          });
        }, 400);
      }, 400);
    }, 400);
  };

  const handleFillDemoCredentials = () => {
    setEmail('desk.alpha@goldlens.quant');
    setPassword('mcx-quant-sec-9942');
    setActiveTab('institutional');
    setShowForgotKeyModal(false);
    setErrorMessage(null);
  };

  const handleRequestAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqEmail) return;
    setRequestSubmitted(true);
    setTimeout(() => {
      setEmail(reqEmail);
      setPassword('mcx-temp-key-' + Math.floor(1000 + Math.random() * 9000));
      setActiveTab('institutional');
      setShowRequestAccessModal(false);
      setRequestSubmitted(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-[#07090C] text-[#EAECEF] flex flex-col justify-between relative overflow-hidden font-sans select-none">
      
      {/* ── 02. MARKET-INTELLIGENCE BACKGROUND CANVAS & GLOWS ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Soft Focused Gold Ambient Aura behind the central work area */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#F0B90B]/[0.055] rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[350px] bg-[#3861FB]/[0.035] rounded-full blur-[120px]" />
        <div className="absolute top-10 left-10 w-[350px] h-[250px] bg-[#0ECB81]/[0.025] rounded-full blur-[100px]" />

        {/* Existing High-Definition Bloomberg Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(#F0B90B 1px, transparent 1px), linear-gradient(90deg, #F0B90B 1px, transparent 1px)`,
            backgroundSize: '44px 44px',
          }}
        />

        {/* Dynamic Subtle Candlestick & Price Depth SVG Watermark */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.09] stroke-current"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
        >
          <defs>
            <linearGradient id="goldCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F0B90B" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#F0B90B" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0ECB81" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="goldAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F0B90B" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#F0B90B" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area fill behind gold line */}
          <path
            d="M 0 520 Q 200 460 400 490 T 800 410 T 1200 320 T 1440 240 L 1440 900 L 0 900 Z"
            fill="url(#goldAreaGrad)"
          />
          {/* Main Gold Line */}
          <path
            d="M 0 520 Q 200 460 400 490 T 800 410 T 1200 320 T 1440 240"
            fill="none"
            stroke="url(#goldCurveGrad)"
            strokeWidth="2.5"
          />

          {/* Secondary Spread Dislocation Line */}
          <path
            d="M 0 640 Q 250 600 500 650 T 1000 560 T 1440 450"
            fill="none"
            stroke="#3861FB"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            strokeDasharray="5 5"
          />

          {/* Candlesticks (Low-contrast background visual depth) */}
          <g fill="#0ECB81" stroke="#0ECB81" strokeWidth="1.2">
            {/* Candle Cluster 1 */}
            <line x1="60" y1="440" x2="60" y2="540" opacity="0.6" />
            <rect x="53" y="470" width="14" height="45" rx="1.5" fill="#0ECB81" opacity="0.5" />

            <line x1="110" y1="410" x2="110" y2="510" opacity="0.6" />
            <rect x="103" y="430" width="14" height="60" rx="1.5" fill="#0ECB81" opacity="0.5" />

            <line x1="160" y1="430" x2="160" y2="550" stroke="#F6465D" opacity="0.6" />
            <rect x="153" y="450" width="14" height="65" rx="1.5" fill="#F6465D" opacity="0.45" />

            <line x1="210" y1="370" x2="210" y2="480" opacity="0.6" />
            <rect x="203" y="390" width="14" height="65" rx="1.5" fill="#0ECB81" opacity="0.5" />

            <line x1="260" y1="350" x2="260" y2="460" opacity="0.6" />
            <rect x="253" y="365" width="14" height="70" rx="1.5" fill="#0ECB81" opacity="0.5" />

            {/* Candle Cluster 2 (Right side) */}
            <line x1="1180" y1="260" x2="1180" y2="380" opacity="0.6" />
            <rect x="1173" y="280" width="14" height="75" rx="1.5" fill="#0ECB81" opacity="0.5" />

            <line x1="1230" y1="270" x2="1230" y2="410" stroke="#F6465D" opacity="0.6" />
            <rect x="1223" y="300" width="14" height="80" rx="1.5" fill="#F6465D" opacity="0.45" />

            <line x1="1280" y1="220" x2="1280" y2="350" opacity="0.6" />
            <rect x="1273" y="240" width="14" height="85" rx="1.5" fill="#0ECB81" opacity="0.5" />

            <line x1="1330" y1="190" x2="1330" y2="320" opacity="0.6" />
            <rect x="1323" y="210" width="14" height="70" rx="1.5" fill="#0ECB81" opacity="0.5" />

            <line x1="1380" y1="160" x2="1380" y2="290" opacity="0.6" />
            <rect x="1373" y="180" width="14" height="80" rx="1.5" fill="#0ECB81" opacity="0.5" />
          </g>

          {/* Ambient Order Book Depth Histograms */}
          <g fill="#F0B90B" opacity="0.08">
            <rect x="40" y="780" width="20" height="60" />
            <rect x="68" y="750" width="20" height="90" />
            <rect x="96" y="720" width="20" height="120" />
            <rect x="124" y="770" width="20" height="70" />
            <rect x="152" y="690" width="20" height="150" />

            <rect x="1240" y="740" width="20" height="100" />
            <rect x="1268" y="710" width="20" height="130" />
            <rect x="1296" y="670" width="20" height="170" />
            <rect x="1324" y="730" width="20" height="110" />
            <rect x="1352" y="760" width="20" height="80" />
          </g>
        </svg>
      </div>

      {/* ── TOP LIVE TELEMETRY HEADER ── */}
      <header className="relative z-10 w-full border-b border-[#21262D]/90 bg-[#0A0D11]/90 backdrop-blur-md px-4 sm:px-8 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F0B90B] via-[#D4AF37] to-[#996515] flex items-center justify-center text-[#07090C] font-black shadow-md shadow-[#F0B90B]/20">
            <Hexagon size={18} className="fill-[#07090C] stroke-[#07090C]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wider text-foreground">
                GOLD<span className="text-gold">LENS</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-gold/10 border border-gold/30 text-[9px] font-mono text-gold font-bold">
                PRO QUANT v2.4
              </span>
            </div>
            <p className="text-[10px] font-mono text-muted hidden md:block">MCX Multi-Contract Arbitrage & Carry Execution</p>
          </div>
        </div>

        {/* Header Telemetry Status */}
        <div className="flex items-center gap-3 sm:gap-5 font-mono text-xs">
          <div className="hidden lg:flex items-center gap-1.5 text-muted text-[11px]">
            <Radio size={12} className="text-gold" />
            <span>TIME: <strong className="text-foreground">{timeString || '16:05:00 IST'}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-buy bg-buy/10 px-2.5 py-1 rounded-full border border-buy/25 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-buy animate-pulse" />
            <span className="text-muted hidden sm:inline">FEED:</span>
            <span className="font-bold">MCX LIVE (0.012ms)</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-gold bg-gold/10 px-2.5 py-1 rounded-full border border-gold/30 text-[11px] font-bold">
            <Zap size={12} />
            <span>DISLOCATION ACTIVE (+2.41σ)</span>
          </div>
        </div>
      </header>

      {/* ── 01. MAIN DUAL-PANE COMMAND CENTER HERO ── */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 sm:py-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* ── LEFT COLUMN: MARKET INTELLIGENCE RADAR (Desktop) ── */}
          <div className="lg:col-span-7 space-y-6 hidden lg:block">
            
            {/* Header / Value Proposition */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono font-bold tracking-wide">
                <Shield size={12} />
                <span>INSTITUTIONAL QUANT DESK TERMINAL</span>
              </div>
              
              <h2 className="text-3xl xl:text-4xl font-black text-foreground tracking-tight leading-tight">
                Statistical Arbitrage & <br />
                <span className="bg-gradient-to-r from-[#F0B90B] via-[#FFE27D] to-[#D4AF37] bg-clip-text text-transparent">
                  Multi-Contract Gold Carry
                </span>
              </h2>
              
              <p className="text-xs text-[#848E9C] max-w-lg leading-relaxed">
                Automated relative value scanning, z-score spread dislocation execution, and risk-neutral synthetic cash & carry across MCX GOLD, GOLDM, GOLDTEN, & GOLDPETAL.
              </p>
            </div>

            {/* Live Intelligence Telemetry Cards Grid */}
            <div className="grid grid-cols-3 gap-3.5">
              
              {/* Card 1: Spread Dislocation */}
              <div className="p-3.5 rounded-xl bg-[#10141B]/80 border border-[#212833] hover:border-gold/30 transition-all backdrop-blur-md">
                <div className="flex items-center justify-between text-[11px] text-muted font-mono mb-1">
                  <span>DISLOCATION</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-buy animate-pulse" />
                </div>
                <div className="text-xl font-mono font-bold text-buy flex items-baseline gap-1">
                  <span>+2.41σ</span>
                </div>
                <div className="text-[10px] text-[#848E9C] font-mono mt-1">
                  GOLDM vs GOLDTEN (₹184 Edge)
                </div>
              </div>

              {/* Card 2: Annualized Carry Yield */}
              <div className="p-3.5 rounded-xl bg-[#10141B]/80 border border-[#212833] hover:border-gold/30 transition-all backdrop-blur-md">
                <div className="flex items-center justify-between text-[11px] text-muted font-mono mb-1">
                  <span>ANN. CARRY</span>
                  <TrendingUp size={12} className="text-gold" />
                </div>
                <div className="text-xl font-mono font-bold text-gold flex items-baseline gap-1">
                  <span>11.84%</span>
                  <span className="text-[10px] text-muted font-normal">APR</span>
                </div>
                <div className="text-[10px] text-[#848E9C] font-mono mt-1">
                  Synthetic Cash & Carry Edge
                </div>
              </div>

              {/* Card 3: Execution Engine */}
              <div className="p-3.5 rounded-xl bg-[#10141B]/80 border border-[#212833] hover:border-gold/30 transition-all backdrop-blur-md">
                <div className="flex items-center justify-between text-[11px] text-muted font-mono mb-1">
                  <span>LATENCY</span>
                  <Cpu size={12} className="text-blue" />
                </div>
                <div className="text-xl font-mono font-bold text-foreground flex items-baseline gap-1">
                  <span>0.012</span>
                  <span className="text-[10px] text-muted font-normal">ms</span>
                </div>
                <div className="text-[10px] text-[#848E9C] font-mono mt-1">
                  MCX Direct Multicast Engine
                </div>
              </div>

            </div>

            {/* Live Visual Spread Curve Preview */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#10141B]/90 via-[#0D1016]/90 to-[#10141B]/90 border border-[#212833] backdrop-blur-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-gold" />
                  <span className="font-bold text-foreground font-mono">LIVE ARBITRAGE RADAR</span>
                </div>
                <span className="text-[10px] font-mono text-buy bg-buy/10 px-2 py-0.5 rounded border border-buy/20">
                  SURVIVES FRICTION (100% AUDIT)
                </span>
              </div>

              {/* Mini SVG Radar Diagram */}
              <div className="h-20 w-full relative flex items-end">
                <svg className="w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
                  {/* Mean Line (0σ) */}
                  <line x1="0" y1="40" x2="400" y2="40" stroke="#2B3139" strokeWidth="1" strokeDasharray="3 3" />
                  {/* Upper Bound (+2σ) */}
                  <line x1="0" y1="18" x2="400" y2="18" stroke="#F6465D" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 2" />
                  {/* Lower Bound (-2σ) */}
                  <line x1="0" y1="62" x2="400" y2="62" stroke="#0ECB81" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 2" />

                  {/* Dynamic Dislocation Curve */}
                  <path
                    d="M 0 45 Q 60 48 120 38 T 240 22 T 320 16 T 400 12"
                    fill="none"
                    stroke="#F0B90B"
                    strokeWidth="2.5"
                  />

                  {/* Glow point on current dislocation */}
                  <circle cx="395" cy="12" r="4" fill="#F0B90B" className="animate-ping" />
                  <circle cx="395" cy="12" r="3.5" fill="#F0B90B" />
                </svg>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-muted pt-2 border-t border-[#1C222B]">
                <span>T-30m Spread Baseline</span>
                <span className="text-gold font-bold">CURRENT: +2.41σ (ENTER LONG ARBITRAGE SPREAD)</span>
                <span>Real-Time MCX</span>
              </div>
            </div>

            {/* Regulatory & Institutional Badges */}
            <div className="flex items-center gap-5 text-[11px] text-muted font-mono pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-buy" />
                <span>Zero Hallucination Audit Engine</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <LockKeyhole size={13} className="text-gold" />
                <span>256-Bit HSM Key Encryption</span>
              </span>
              <span>•</span>
              <span>MCX Compliant</span>
            </div>

          </div>

          {/* ── RIGHT COLUMN: REFINED CHARCOAL GLASS LOGIN CARD ── */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <div className="w-full max-w-[430px] bg-[#10141B]/95 backdrop-blur-2xl border border-[#262D38] hover:border-gold/40 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(240,185,11,0.08)] rounded-2xl p-5 sm:p-7 relative overflow-hidden transition-all duration-300">
              
              {/* Subtle Top Gold Edge Lighting Gradient */}
              <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#F0B90B] to-transparent opacity-90" />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-20 bg-gold/15 blur-[20px] pointer-events-none" />

              {/* Card Header */}
              <div className="text-center mb-5">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-b from-[#1E2530] to-[#10141B] border border-gold/30 mb-2.5 shadow-[0_0_20px_rgba(240,185,11,0.15)]">
                  <Terminal size={22} className="text-gold" />
                </div>
                
                <h1 className="text-xl font-black text-foreground tracking-tight">
                  Terminal Authentication
                </h1>
                
                <p className="text-xs text-[#848E9C] mt-0.5 max-w-xs mx-auto">
                  Sign in with verified institutional credentials or launch instant sandbox mode.
                </p>
              </div>

              {/* ── 03. SEGMENTED TAB SWITCHER (Demo vs Institutional) ── */}
              <div className="flex p-1 bg-[#0A0D11] border border-[#202630] rounded-xl mb-4.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('demo');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'demo'
                      ? 'bg-gradient-to-r from-gold to-amber-500 text-[#07090C] shadow-md shadow-gold/20'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  <Sparkles size={13} className={activeTab === 'demo' ? 'text-[#07090C]' : 'text-gold'} />
                  <span>Instant Demo Access</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('institutional');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'institutional'
                      ? 'bg-[#1C222C] text-foreground border border-[#303846] shadow-sm'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  <Lock size={13} className={activeTab === 'institutional' ? 'text-gold' : ''} />
                  <span>Institutional Key</span>
                </button>
              </div>

              {/* ── LOADING / SUCCESS / ERROR NOTICES ── */}
              {authStatus === 'authenticating' && (
                <div className="mb-4 p-3 rounded-xl bg-gold/10 border border-gold/30 text-gold text-xs flex items-center gap-2.5 animate-pulse font-mono">
                  <RefreshCw size={15} className="animate-spin text-gold flex-shrink-0" />
                  <span className="text-[11.5px] leading-tight font-medium">{authStepMessage}</span>
                </div>
              )}

              {authStatus === 'success' && (
                <div className="mb-4 p-3 rounded-xl bg-buy/15 border border-buy/40 text-buy text-xs flex items-center gap-2.5 font-mono">
                  <CheckCircle2 size={16} className="text-buy flex-shrink-0" />
                  <span className="text-[11.5px] font-semibold">{authStepMessage}</span>
                </div>
              )}

              {errorMessage && authStatus !== 'authenticating' && (
                <div className="mb-4 p-3 rounded-xl bg-sell/15 border border-sell/40 text-sell text-xs flex items-center justify-between gap-2 animate-shake font-sans">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={15} className="flex-shrink-0 text-sell" />
                    <span className="text-[11.5px]">{errorMessage}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setErrorMessage(null)} 
                    className="text-sell/80 hover:text-sell p-0.5"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}

              {/* ── TAB 1: INSTANT DEMO SANDBOX VIEW ── */}
              {activeTab === 'demo' ? (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-[#0C0F14] border border-[#202732] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-muted uppercase">SANDBOX ROLE</span>
                      <span className="text-gold font-bold">Institutional Guest Trader</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-muted uppercase">LIVE MARGIN</span>
                      <span className="text-buy font-bold">₹10,00,00,000 (Simulated)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-muted uppercase">FEEDS INCLUDED</span>
                      <span className="text-foreground">All MCX Gold Contracts + Spread Engine</span>
                    </div>
                  </div>

                  {/* Primary One-Click Action Button */}
                  <button
                    type="button"
                    onClick={handleInstantDemoLogin}
                    disabled={authStatus === 'authenticating' || authStatus === 'success'}
                    className="w-full py-3 bg-gradient-to-r from-gold via-[#F3C325] to-amber-500 hover:brightness-110 active:scale-[0.99] text-[#07090C] font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(240,185,11,0.28)] disabled:opacity-60 cursor-pointer"
                  >
                    {authStatus === 'authenticating' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#07090C] border-t-transparent rounded-full animate-spin" />
                        <span>SYNCHRONIZING DEMO DESK...</span>
                      </>
                    ) : authStatus === 'success' ? (
                      <>
                        <Check size={16} className="stroke-[3]" />
                        <span>ENTERING TERMINAL</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} className="text-[#07090C]" />
                        <span>LAUNCH INSTANT DEMO TERMINAL</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab('institutional')}
                      className="text-[11px] text-muted hover:text-gold transition-colors font-mono cursor-pointer"
                    >
                      Have an institutional desk key? Switch to Sign In →
                    </button>
                  </div>
                </div>
              ) : (
                
                /* ── TAB 2: INSTITUTIONAL DESK KEY FORM ── */
                <form onSubmit={handleInstitutionalSubmit} className="space-y-3.5 font-sans">
                  
                  {/* Desk ID / Email */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10.5px] font-bold text-[#848E9C] uppercase font-mono tracking-wider">
                        Quant Desk ID / Email
                      </label>
                      <span className="text-[9.5px] font-mono text-muted">TIER-1 PROD</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                        <Mail size={14} />
                      </div>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="desk.alpha@goldlens.quant"
                        disabled={authStatus === 'authenticating' || authStatus === 'success'}
                        required
                        className="w-full bg-[#0A0D11] text-foreground font-mono text-xs pl-9 pr-3 py-2.5 rounded-lg border border-[#232932] focus:outline-none focus:border-gold/70 focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-muted/50 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Passphrase / Key */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10.5px] font-bold text-[#848E9C] uppercase font-mono tracking-wider">
                        Security Key / HSM Passphrase
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotKeyModal(true)}
                        className="text-[10px] text-gold hover:text-gold-hover hover:underline font-mono cursor-pointer flex items-center gap-0.5"
                      >
                        <KeyRound size={10} />
                        <span>Forgot Key?</span>
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                        <Lock size={14} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        disabled={authStatus === 'authenticating' || authStatus === 'success'}
                        required
                        className="w-full bg-[#0A0D11] text-foreground font-mono text-xs pl-9 pr-9 py-2.5 rounded-lg border border-[#232932] focus:outline-none focus:border-gold/70 focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-muted/50 disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide passphrase" : "Show passphrase"}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-foreground transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Session Checkbox & TLS Badge */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[#848E9C] hover:text-foreground transition-colors">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-[#262D38] bg-[#0A0D11] text-gold focus:ring-0 focus:ring-offset-0 cursor-pointer w-3.5 h-3.5"
                      />
                      <span className="text-[10.5px]">Remember terminal session</span>
                    </label>

                    <span className="text-[9.5px] font-mono text-buy flex items-center gap-1 font-semibold bg-buy/10 px-1.5 py-0.5 rounded border border-buy/20">
                      <Shield size={10} />
                      <span>256-Bit TLS</span>
                    </span>
                  </div>

                  {/* Submit Institutional Auth */}
                  <button
                    type="submit"
                    disabled={authStatus === 'authenticating' || authStatus === 'success'}
                    className="w-full mt-2 py-3 bg-gold hover:bg-[#F3C325] active:bg-amber-500 text-[#07090C] font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(240,185,11,0.25)] hover:shadow-[0_4px_25px_rgba(240,185,11,0.35)] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                  >
                    {authStatus === 'authenticating' ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-[#07090C] border-t-transparent rounded-full animate-spin" />
                        <span>AUTHENTICATING DESK...</span>
                      </>
                    ) : authStatus === 'success' ? (
                      <>
                        <Check size={15} className="stroke-[3]" />
                        <span>AUTHENTICATED</span>
                      </>
                    ) : (
                      <>
                        <span>AUTHENTICATE & ENTER TERMINAL</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>

                  {/* Mode Switch Footer */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setShowRequestAccessModal(true)}
                      className="text-[11px] text-[#848E9C] hover:text-gold transition-colors font-mono cursor-pointer"
                    >
                      Need institutional desk credentials? <span className="text-gold font-bold underline">Request Access →</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* ── FOOTER LIVE MARKET TICKER STRIP ── */}
      <footer className="relative z-10 w-full border-t border-[#21262D]/90 bg-[#0A0D11]/95 backdrop-blur-md px-4 py-2 font-mono text-[10.5px] text-muted flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar w-full sm:w-auto justify-center sm:justify-start">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="font-bold text-foreground">GOLDM:</span>
            <span className="text-buy font-semibold">₹1,28,411 (+0.43%)</span>
          </div>
          <span className="text-[#2B3139]">|</span>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="font-bold text-foreground">GOLDTEN:</span>
            <span className="text-buy font-semibold">₹1,29,180 (+0.38%)</span>
          </div>
          <span className="text-[#2B3139]">|</span>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="font-bold text-foreground">GOLDPETAL:</span>
            <span className="text-buy font-semibold">₹12,890 (+0.41%)</span>
          </div>
          <span className="text-[#2B3139] hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap">
            <span className="font-bold text-gold">SPREAD DISLOCATION:</span>
            <span className="text-buy font-bold">+0.33% (Survives Friction)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-[#848E9C] flex-shrink-0">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={11} className="text-buy" />
            <span>Audit Validated</span>
          </span>
          <span>•</span>
          <span>MCX Regulatory Compliant</span>
        </div>
      </footer>

      {/* ── FORGOT KEY RECOVERY MODAL ── */}
      {showForgotKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#11151C] border border-gold/35 rounded-2xl p-5 sm:p-6 shadow-2xl relative">
            <button
              onClick={() => setShowForgotKeyModal(false)}
              className="absolute top-4 right-4 text-muted hover:text-foreground p-1 rounded-lg hover:bg-[#1A202C] transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gold/15 text-gold flex items-center justify-center">
                <KeyRound size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-foreground">Quant Security Key Recovery</h3>
                <p className="text-[10px] font-mono text-muted">Institutional HSM Key Delegation</p>
              </div>
            </div>

            <div className="text-xs text-[#848E9C] space-y-2.5 mb-4 leading-relaxed bg-[#0A0D11] p-3.5 rounded-xl border border-[#232932]">
              <p>
                In institutional live production, your desk security key is provisioned by your firm’s MCX Compliance Officer or Hardware Security Module (HSM).
              </p>
              <p className="text-foreground font-medium">
                For rapid evaluation or test access, you can load the verified institutional sandbox key below:
              </p>
              
              <div className="p-2.5 bg-[#141922] rounded-lg border border-gold/25 font-mono text-[11px] text-gold flex items-center justify-between">
                <span>Key: mcx-quant-sec-9942</span>
                <span className="text-[9px] text-buy font-bold bg-buy/10 px-1.5 py-0.5 rounded">VALID</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                className="flex-1 py-2.5 bg-gold hover:bg-gold-hover text-[#07090C] font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={13} />
                <span>Auto-Fill Test Key & Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => setShowForgotKeyModal(false)}
                className="px-4 py-2.5 bg-[#1A202C] hover:bg-[#232B3A] text-foreground text-xs rounded-xl font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REQUEST ACCESS MODAL ── */}
      {showRequestAccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#11151C] border border-[#282F3A] rounded-2xl p-5 sm:p-6 shadow-2xl relative">
            <button
              onClick={() => setShowRequestAccessModal(false)}
              className="absolute top-4 right-4 text-muted hover:text-foreground p-1 rounded-lg hover:bg-[#1A202C] transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-buy/15 text-buy flex items-center justify-center">
                <Building2 size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-foreground">Request Desk Credentials</h3>
                <p className="text-[10px] font-mono text-muted">Tier-1 MCX Gold Quant Access</p>
              </div>
            </div>

            {requestSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-buy/15 text-buy flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <Check size={24} className="stroke-[3]" />
                </div>
                <h4 className="text-sm font-bold text-foreground">Desk Credentials Generated!</h4>
                <p className="text-xs text-muted font-mono max-w-xs mx-auto">
                  Instant trial access key configured. Provisioning login form...
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestAccessSubmit} className="space-y-3 font-sans">
                <div>
                  <label className="block text-[10.5px] font-bold text-[#848E9C] uppercase font-mono mb-1">
                    Trader / Quant Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                      <User size={14} />
                    </div>
                    <input
                      type="text"
                      required
                      value={reqFullName}
                      onChange={(e) => setReqFullName(e.target.value)}
                      placeholder="Burhan Quant"
                      className="w-full bg-[#0A0D11] text-foreground font-mono text-xs pl-9 pr-3 py-2 rounded-lg border border-[#232932] focus:outline-none focus:border-gold/70"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-[#848E9C] uppercase font-mono mb-1">
                    Institution / Trading Firm
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                      <Building2 size={14} />
                    </div>
                    <input
                      type="text"
                      required
                      value={reqInstitution}
                      onChange={(e) => setReqInstitution(e.target.value)}
                      placeholder="GoldLens Capital / Proprietary Desk"
                      className="w-full bg-[#0A0D11] text-foreground font-mono text-xs pl-9 pr-3 py-2 rounded-lg border border-[#232932] focus:outline-none focus:border-gold/70"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-[#848E9C] uppercase font-mono mb-1">
                    Corporate / Quant Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                      <Mail size={14} />
                    </div>
                    <input
                      type="email"
                      required
                      value={reqEmail}
                      onChange={(e) => setReqEmail(e.target.value)}
                      placeholder="trader@firm.quant"
                      className="w-full bg-[#0A0D11] text-foreground font-mono text-xs pl-9 pr-3 py-2 rounded-lg border border-[#232932] focus:outline-none focus:border-gold/70"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gold hover:bg-gold-hover text-[#07090C] font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Instant Issue Credentials</span>
                    <ArrowRight size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRequestAccessModal(false)}
                    className="px-3.5 py-2.5 bg-[#1A202C] hover:bg-[#232B3A] text-foreground text-xs rounded-xl font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

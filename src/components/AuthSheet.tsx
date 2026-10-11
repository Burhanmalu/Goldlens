'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { setGuestSession, setAuthenticatedSession } from '@/lib/auth';

interface AuthSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthSheet({ isOpen, onClose, onSuccess }: AuthSheetProps) {
  const [tab, setTab] = useState<'signin' | 'create'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccessSplash, setIsSuccessSplash] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setAuthenticatedSession(email, name);
      setIsSuccessSplash(true);
      setTimeout(() => {
        setIsSuccessSplash(false);
        onSuccess();
      }, 1200);
    }, 600);
  };

  const handleGuest = () => {
    setGuestSession();
    setIsSuccessSplash(true);
    setTimeout(() => {
      setIsSuccessSplash(false);
      onSuccess();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
        {/* Success Splash */}
        {isSuccessSplash ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center space-y-4 p-8"
          >
            <div className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#D6B26A" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" fill="#D6B26A" />
              </svg>
              <span className="font-display font-black text-2xl text-text-primary tracking-tight">
                GoldLens
              </span>
            </div>
            <div className="w-48 h-1 bg-gradient-to-r from-transparent via-gold to-transparent animate-pulse" />
            <p className="font-mono text-xs text-text-secondary tracking-widest uppercase">
              Preparing today&apos;s settlement...
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl h-full sm:h-auto sm:max-h-[640px] bg-surface rounded-none sm:rounded-card border border-border shadow-2xl flex flex-col sm:flex-row overflow-hidden relative"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 text-text-muted hover:text-text-primary p-2 text-lg font-mono cursor-pointer"
            >
              ✕
            </button>

            {/* Left 55% Brand Panel */}
            <div className="hidden sm:flex sm:w-[55%] bg-[#0A0A0B] p-10 flex-col justify-between border-r border-border relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#D6B26A" strokeWidth="2" />
                    <circle cx="12" cy="12" r="4" fill="#D6B26A" />
                  </svg>
                  <span className="font-display font-black text-lg text-text-primary">
                    GoldLens
                  </span>
                </div>
                <h2 className="text-3xl font-display font-black uppercase tracking-tight text-text-primary leading-tight pt-6">
                  One price per gram.
                </h2>
                <p className="text-xs text-text-secondary font-mono leading-relaxed max-w-xs">
                  Normalizing GOLDM, GOLDTEN, GOLDGUINEA, and GOLDPETAL into transparent decision support.
                </p>
              </div>

              {/* Decorative mini convergence visual */}
              <div className="h-20 w-full relative">
                <svg viewBox="0 0 300 60" className="w-full h-full" fill="none">
                  <path d="M 10 10 C 100 10, 200 30, 290 30" stroke="#D6B26A" strokeWidth="1" strokeOpacity="0.5" />
                  <path d="M 10 25 C 100 25, 200 30, 290 30" stroke="#D6B26A" strokeWidth="1" strokeOpacity="0.7" />
                  <path d="M 10 45 C 100 45, 200 30, 290 30" stroke="#D6B26A" strokeWidth="1" strokeOpacity="0.5" />
                  <line x1="200" y1="30" x2="290" y2="30" stroke="#D6B26A" strokeWidth="2" />
                </svg>
              </div>

              <div className="text-[11px] font-mono text-text-muted">
                MCX Bhavcopy settlement · CTT tax modeled
              </div>
            </div>

            {/* Right 45% Form Panel */}
            <div className="flex-1 p-8 sm:p-10 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-border pb-3 mb-6 font-mono text-xs">
                  <button
                    onClick={() => { setTab('signin'); setError(null); }}
                    className={`pb-1 cursor-pointer transition-colors ${
                      tab === 'signin'
                        ? 'text-gold border-b-2 border-gold font-bold'
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => { setTab('create'); setError(null); }}
                    className={`pb-1 cursor-pointer transition-colors ${
                      tab === 'create'
                        ? 'text-gold border-b-2 border-gold font-bold'
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    Create account
                  </button>
                </div>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGuest}
                  className="w-full py-2.5 rounded-card bg-elevated hover:bg-border/40 text-text-primary text-xs font-mono font-medium border border-border flex items-center justify-center gap-2 transition-all cursor-pointer mb-4"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[11px] font-mono text-text-muted uppercase">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5 font-mono text-xs">
                  {tab === 'create' && (
                    <div>
                      <label className="text-text-muted block mb-1">Name (optional)</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Yusuf"
                        className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-border text-text-primary focus:border-gold outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-text-muted block mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="trader@domain.com"
                      className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-border text-text-primary focus:border-gold outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-text-muted">Password</label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[10px] text-text-muted hover:text-text-secondary cursor-pointer"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-lg bg-[#0A0A0B] border border-border text-text-primary focus:border-gold outline-none"
                    />
                  </div>

                  {error && (
                    <div className="text-[11px] text-negative font-mono pt-1">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-card bg-gold hover:opacity-90 text-[#0A0A0B] font-bold text-xs font-display tracking-wider transition-all cursor-pointer mt-2"
                  >
                    {isLoading ? 'Authenticating...' : tab === 'signin' ? 'Sign in' : 'Create account'}
                  </button>
                </form>
              </div>

              {/* Guest button & fine print */}
              <div className="pt-6 border-t border-border space-y-3">
                <button
                  type="button"
                  onClick={handleGuest}
                  className="w-full py-2 rounded-pill bg-[#0A0A0B] hover:bg-elevated text-gold text-xs font-mono font-bold border border-gold/30 transition-all cursor-pointer"
                >
                  Continue as guest →
                </button>

                <p className="text-[10px] font-mono text-text-muted text-center leading-tight">
                  By continuing you acknowledge that GoldLens is an analytics tool and does not provide financial advice.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  AlertCircle,
  Key,
  ShieldCheck,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { TODAY_DECISION, BENCHMARK_FINE_GOLD_PER_G } from '@/lib/singleSourceOfTruth';

interface QuantAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuantAssistantDrawer({ isOpen, onClose }: QuantAssistantDrawerProps) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAskAssistant = async (customPrompt?: string) => {
    const textToAsk = customPrompt || query;
    if (!textToAsk.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai-analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToAsk,
          context: {
            pair: TODAY_DECISION.pair,
            benchmarkPrice: BENCHMARK_FINE_GOLD_PER_G,
            gapPct: TODAY_DECISION.todays_biggest_gap_pct,
            costBandPct: TODAY_DECISION.cost_band_pct,
            verdict: TODAY_DECISION.verdict,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to communicate with AI provider.');
        setIsLoading(false);
        return;
      }

      setResponse(data.analysis);
      setProvider(data.provider);
    } catch (err: any) {
      setError(err?.message || 'Network error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'Why does the +0.05% GOLDM/GOLDTEN gap not survive friction today?',
    'What is the effective cost breakdown (CTT, MCX fee, slippage) for small lots?',
    'Explain the 4/1000 purity adjustment between 995 and 999 gold contracts.',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#11151A] border-l border-[#2B3139] shadow-2xl flex flex-col font-sans select-none animate-slide-left">
      
      {/* ── HEADER ── */}
      <div className="p-4 border-b border-[#2B3139] flex items-center justify-between bg-[#161A20]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold/15 text-gold flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <span>Quant Decision-Support Assistant</span>
            </h3>
            <p className="text-[10px] text-muted font-mono">
              Powered by Gemini / OpenRouter Models
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-[#202630] transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── CONTENT BODY ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        
        {/* Guardrail Disclaimer */}
        <div className="p-3 rounded-xl bg-[#0C0F14] border border-[#232932] text-[11px] text-[#848E9C] flex items-start gap-2">
          <ShieldCheck size={16} className="text-buy flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Analytical decision-support model. Evaluates purity normalization, carry calculations, and transaction friction without making speculative buy/sell predictions.
          </p>
        </div>

        {/* Quick Sample Prompts */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-muted font-bold block">
            Suggested Quantitative Audits:
          </span>
          <div className="space-y-1">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(p);
                  handleAskAssistant(p);
                }}
                className="w-full text-left p-2.5 rounded-lg bg-[#161A20] hover:bg-[#1C222C] text-[#848E9C] hover:text-foreground border border-[#232932] transition-colors text-[11px] leading-snug cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-sell/15 border border-sell/40 text-sell space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle size={14} />
              <span>Configuration Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed">{error}</p>
            <div className="pt-1 text-[10px] font-mono text-muted flex items-center gap-1">
              <Key size={12} />
              <span>Add key to: .env.local (GEMINI_API_KEY or OPENROUTER_API_KEY)</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="p-6 text-center space-y-2">
            <RefreshCw size={20} className="animate-spin text-gold mx-auto" />
            <span className="font-mono text-muted text-xs block">
              Synthesizing settlement data & calculating friction bounds...
            </span>
          </div>
        )}

        {/* Response Box */}
        {response && !isLoading && (
          <div className="p-4 rounded-xl bg-[#0C0F14] border border-gold/30 space-y-2.5 animate-fade-in font-sans">
            <div className="flex items-center justify-between border-b border-[#232932] pb-2 text-[10px] font-mono">
              <span className="text-gold font-bold">Quantitative Breakdown</span>
              <span className="text-muted">{provider}</span>
            </div>
            <div className="text-foreground leading-relaxed whitespace-pre-wrap text-[11.5px]">
              {response}
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER INPUT FORM ── */}
      <div className="p-4 border-t border-[#2B3139] bg-[#161A20]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskAssistant();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about carry rates, CTT, or contract friction..."
            disabled={isLoading}
            className="flex-1 bg-[#0C0F14] border border-[#2B3139] rounded-xl px-3 py-2.5 text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:border-gold/70"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="p-2.5 rounded-xl bg-gold hover:bg-gold-hover text-[#07090C] font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Send size={15} />
          </button>
        </form>
      </div>

    </div>
  );
}

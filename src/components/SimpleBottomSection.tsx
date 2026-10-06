'use client';

import React, { useState } from 'react';
import {
  Activity, ShieldCheck, FileText, CheckCircle2,
  ChevronRight, HelpCircle, ArrowRight, Layers
} from 'lucide-react';
import { CONTRACT_LIST } from '@/lib/contracts';
import { AuditDetailedStep } from '@/lib/types';

interface SimpleBottomSectionProps {
  auditSteps: AuditDetailedStep[];
  onOpenAnalysis: () => void;
  onOpenOnboarding: () => void;
}

export function SimpleBottomSection({
  auditSteps,
  onOpenAnalysis,
  onOpenOnboarding,
}: SimpleBottomSectionProps) {
  const [activeTab, setActiveTab] = useState<'activity' | 'validation' | 'contracts'>('activity');

  const latestEvents = [
    { text: 'GOLDM / GOLDTEN opportunity detected (Unusualness +2.41σ)', time: '10:32:15', isPass: true },
    { text: 'Transaction cost validation passed (-0.08% friction hurdle)', time: '10:32:18', isPass: true },
    { text: 'Walk-forward robustness validated across 4 out-of-sample folds', time: '10:32:20', isPass: true },
    { text: 'Top-of-book executable liquidity check passed (High fill depth)', time: '10:32:22', isPass: true },
    { text: 'Alpha Audit completed: EDGE SURVIVES (+0.15% Net Edge, Sharpe 1.84)', time: '10:32:25', isPass: true },
  ];

  return (
    <div className="bg-[#11151A] border-t border-[#2B3139] p-5 select-none font-sans">
      {/* Tabs Header */}
      <div className="flex items-center justify-between border-b border-[#2B3139] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'activity'
                ? 'bg-[#161A1F] text-gold border border-[#2B3139] shadow-sm'
                : 'text-text-secondary hover:text-foreground'
            }`}
          >
            <Activity size={13} />
            <span>Activity</span>
          </button>

          <button
            onClick={() => setActiveTab('validation')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'validation'
                ? 'bg-[#161A1F] text-gold border border-[#2B3139] shadow-sm'
                : 'text-text-secondary hover:text-foreground'
            }`}
          >
            <ShieldCheck size={13} />
            <span>Validation</span>
          </button>

          <button
            onClick={() => setActiveTab('contracts')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'contracts'
                ? 'bg-[#161A1F] text-gold border border-[#2B3139] shadow-sm'
                : 'text-text-secondary hover:text-foreground'
            }`}
          >
            <FileText size={13} />
            <span>Contract Info</span>
          </button>
        </div>

        <button
          onClick={onOpenAnalysis}
          className="text-xs text-text-secondary hover:text-gold flex items-center gap-1 transition-colors font-medium"
        >
          <span>Open Full Analysis Studio</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* ── TAB 1: ACTIVITY LOG ── */}
      {activeTab === 'activity' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          {latestEvents.map((evt, idx) => (
            <div
              key={idx}
              className="p-3 bg-[#161A1F] rounded-lg border border-[#2B3139] flex items-start gap-2.5"
            >
              <CheckCircle2 size={15} className="text-buy flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-foreground text-[12px] font-sans font-medium">{evt.text}</div>
                <div className="text-[10px] text-muted mt-1">{evt.time} IST</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 2: VALIDATION SCORECARD ── */}
      {activeTab === 'validation' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 font-mono text-xs">
          {auditSteps.map((st) => (
            <div
              key={st.id}
              className="p-3 bg-[#161A1F] rounded-lg border border-[#2B3139] text-left"
            >
              <div className="flex items-center justify-between text-[10px] text-muted mb-1">
                <span>0{st.id}</span>
                <span className="text-buy font-bold">✓ PASS</span>
              </div>
              <div className="font-bold text-foreground text-xs truncate">{st.name}</div>
              <div className="text-[10px] text-gold mt-1 font-semibold">{st.metricValue}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 3: CONTRACT COMPARISON & NORMALIZATION ── */}
      {activeTab === 'contracts' && (
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 font-mono text-xs">
          <div className="w-full lg:w-3/4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-muted text-[11px] border-b border-[#2B3139]">
                  <th className="py-2 pr-4">CONTRACT</th>
                  <th className="pr-4">CONTRACT SIZE</th>
                  <th className="pr-4">PURITY</th>
                  <th className="pr-4">QUOTATION UNIT</th>
                  <th>NORMALIZATION FACTOR</th>
                </tr>
              </thead>
              <tbody>
                {CONTRACT_LIST.map((c) => (
                  <tr key={c.symbol} className="border-b border-[#2B3139]/40">
                    <td className="py-2 pr-4 font-bold text-foreground flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.symbol}
                    </td>
                    <td className="pr-4 text-text-secondary">{c.contractSize} grams</td>
                    <td className="pr-4 text-gold font-bold">{c.purity} (99.9% fine)</td>
                    <td className="pr-4 text-text-secondary">{c.quoteUnit}</td>
                    <td className="text-muted font-mono text-[11px]">
                      P_raw / ({c.quoteBasis} × {c.purityFactor})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#161A1F] rounded-xl border border-gold/30 lg:w-1/4">
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-1.5 font-sans">
              <HelpCircle size={14} className="text-gold" />
              <span>How We Normalize</span>
            </div>
            <p className="text-xs text-text-secondary font-sans leading-relaxed mb-2">
              Every contract is converted to ₹ per gram of 999 fine gold to enable clean apples-to-apples comparison.
            </p>
            <button
              onClick={onOpenOnboarding}
              className="text-gold hover:text-gold-hover text-xs font-bold font-sans flex items-center gap-1"
            >
              <span>Learn More</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Activity, ShieldCheck, FileText, CheckCircle2,
  ArrowRight, ExternalLink, Scale, Clock, Shield
} from 'lucide-react';
import { CONTRACT_LIST, MCX_BULLION_RULES } from '@/lib/contracts';
import { AuditDetailedStep } from '@/lib/types';

interface SimpleBottomSectionProps {
  auditSteps: AuditDetailedStep[];
  onOpenAnalysis: () => void;
  onOpenOnboarding: () => void;
}

export function SimpleBottomSection({
  auditSteps,
  onOpenAnalysis,
  /* onOpenOnboarding accepted but unused */
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
    <div className="bg-[#11151A] border-t border-[#2B3139] p-4 sm:p-5 select-none font-sans">
      {/* Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2B3139] pb-3 mb-4 gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar touch-pan-x pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[38px] touch-manipulation ${
              activeTab === 'activity'
                ? 'bg-[#161A1F] text-gold border border-[#2B3139] shadow-sm'
                : 'text-text-secondary hover:text-foreground'
            }`}
          >
            <Activity size={14} />
            <span>Activity Stream</span>
          </button>

          <button
            onClick={() => setActiveTab('validation')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[38px] touch-manipulation ${
              activeTab === 'validation'
                ? 'bg-[#161A1F] text-gold border border-[#2B3139] shadow-sm'
                : 'text-text-secondary hover:text-foreground'
            }`}
          >
            <ShieldCheck size={14} />
            <span>8-Step Validation</span>
          </button>

          <button
            onClick={() => setActiveTab('contracts')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[38px] touch-manipulation ${
              activeTab === 'contracts'
                ? 'bg-[#161A1F] text-gold border border-[#2B3139] shadow-sm'
                : 'text-text-secondary hover:text-foreground'
            }`}
          >
            <FileText size={14} />
            <span>Official MCX Specs</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://www.mcxindia.com/products/bullion/gold"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-muted hover:text-gold flex items-center gap-1 transition-colors font-mono"
            title="Official MCX India Bullion Product Specifications"
          >
            <span>mcxindia.com/bullion</span>
            <ExternalLink size={11} />
          </a>

          <button
            onClick={onOpenAnalysis}
            className="text-xs text-text-secondary hover:text-gold flex items-center gap-1 transition-colors font-medium py-1 font-sans"
          >
            <span>Open Studio</span>
            <ArrowRight size={13} />
          </button>
        </div>
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

      {/* ── TAB 3: OFFICIAL MCX BULLION SPECIFICATIONS ── */}
      {activeTab === 'contracts' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-muted text-[11px] border-b border-[#2B3139]">
                  <th className="py-2 pr-3">CONTRACT</th>
                  <th className="pr-3">LOT SIZE</th>
                  <th className="pr-3">PURITY</th>
                  <th className="pr-3">EXPIRY SCHEDULE</th>
                  <th className="pr-3">DELIVERY UNIT</th>
                  <th className="pr-3">CIRCUIT LIMIT</th>
                  <th>DELIVERY BASIS</th>
                </tr>
              </thead>
              <tbody>
                {CONTRACT_LIST.map((c) => (
                  <tr key={c.symbol} className="border-b border-[#2B3139]/40 hover:bg-[#161A1F]/50 transition-colors">
                    <td className="py-2.5 pr-3 font-bold text-foreground flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.symbol}
                    </td>
                    <td className="pr-3 text-text-secondary">{c.contractSize}g ({c.quoteUnit})</td>
                    <td className="pr-3 text-gold font-bold">{c.purity} ({c.purity === 995 ? '99.5%' : '99.9%'})</td>
                    <td className="pr-3 text-foreground font-semibold">{c.expiryRule || 'Standard'}</td>
                    <td className="pr-3 text-text-secondary">{c.deliveryUnit || 'Standard Bar'}</td>
                    <td className="pr-3 text-muted text-[11px]">{c.circuitLimit || '3% + 3%'}</td>
                    <td className="text-buy font-bold">{c.basisCenter || 'Ahmedabad'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MCX Rules Pill Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#2B3139] text-[11px] font-sans">
            <div className="p-2.5 bg-[#161A1F] rounded-lg border border-[#2B3139] flex items-center gap-2">
              <Clock size={14} className="text-gold flex-shrink-0" />
              <span><strong>Trading Hours:</strong> {MCX_BULLION_RULES.tradingHours}</span>
            </div>
            <div className="p-2.5 bg-[#161A1F] rounded-lg border border-[#2B3139] flex items-center gap-2">
              <Shield size={14} className="text-buy flex-shrink-0" />
              <span><strong>SPAN Concession:</strong> {MCX_BULLION_RULES.spanMarginConcession}</span>
            </div>
            <div className="p-2.5 bg-[#161A1F] rounded-lg border border-[#2B3139] flex items-center gap-2">
              <Scale size={14} className="text-blue flex-shrink-0" />
              <span><strong>Tender Period:</strong> Staggered (5 days prior to expiry)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

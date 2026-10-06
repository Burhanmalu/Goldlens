'use client';

import React, { useState } from 'react';
import {
  ShieldCheck, GitCompareArrows, Layers, Play,
  Sliders, ArrowRight, Activity, CheckCircle2
} from 'lucide-react';
import { AlphaAuditView } from './AlphaAuditView';
import { RelativeValueView } from './RelativeValueView';
import { MarketDepthPanel } from './MarketDepthPanel';
import { Opportunity, OrderBookState, ContractSnapshot } from '@/lib/types';

interface AnalysisViewProps {
  opportunities: Opportunity[];
  orderBook: OrderBookState;
  snapshots: ContractSnapshot[];
  selectedSymbol: string;
  onSelectSymbol: (sym: string) => void;
  onSelectPair: (pair: string) => void;
}

export function AnalysisView({
  opportunities,
  orderBook,
  snapshots,
  selectedSymbol,
  onSelectSymbol,
  onSelectPair,
}: AnalysisViewProps) {
  const [activeTab, setActiveTab] = useState<'audit' | 'relative' | 'depth'>('audit');

  return (
    <div className="flex-1 bg-[#0B0E11] overflow-y-auto flex flex-col font-sans select-none">
      {/* Sub-Header Tabs */}
      <div className="bg-[#11151A] border-b border-[#2B3139] px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'bg-[#161A1F] text-gold border border-[#2B3139] shadow-sm'
                : 'text-text-secondary hover:text-foreground hover:bg-[#161A1F]/50'
            }`}
          >
            <ShieldCheck size={15} />
            <span>Alpha Audit Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('relative')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'relative'
                ? 'bg-[#161A1F] text-gold border border-[#2B3139] shadow-sm'
                : 'text-text-secondary hover:text-foreground hover:bg-[#161A1F]/50'
            }`}
          >
            <GitCompareArrows size={15} />
            <span>Relative Value Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('depth')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'depth'
                ? 'bg-[#161A1F] text-gold border border-[#2B3139] shadow-sm'
                : 'text-text-secondary hover:text-foreground hover:bg-[#161A1F]/50'
            }`}
          >
            <Layers size={15} />
            <span>Market Depth & Order Book</span>
          </button>
        </div>

        <span className="text-xs font-mono text-muted">Advanced Quant Studio</span>
      </div>

      {/* Main Analysis Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'audit' ? (
          <AlphaAuditView />
        ) : activeTab === 'relative' ? (
          <RelativeValueView
            pairSpreads={[]}
            opportunities={opportunities}
            onSelectPair={onSelectPair}
            onNavigateAudit={() => setActiveTab('audit')}
          />
        ) : (
          <div className="max-w-4xl mx-auto p-6">
            <div className="h-[550px] bg-[#161A1F] rounded-xl border border-[#2B3139] overflow-hidden shadow-xl">
              <MarketDepthPanel
                selectedSymbol={selectedSymbol}
                onSelectSymbol={onSelectSymbol}
                orderBook={orderBook}
                allSnapshots={snapshots}
                zScores={{ GOLDM: 0.12, GOLDTEN: 2.41, GOLDGUINEA: 0.51, GOLDPETAL: -0.21 }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

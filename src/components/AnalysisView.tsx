'use client';

import React, { useState } from 'react';
import { ShieldCheck, GitCompareArrows, Layers } from 'lucide-react';
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
    <div className="flex-1 bg-[#0B0E11] overflow-y-auto flex flex-col font-sans select-none pb-24 lg:pb-0">
      {/* Sub-Header Tabs */}
      <div className="bg-[#11151A] border-b border-[#2B3139] px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar touch-pan-x w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 min-h-[38px] touch-manipulation ${
              activeTab === 'audit'
                ? 'bg-[#161A1F] text-gold border border-gold/40 shadow-sm ring-1 ring-gold/20'
                : 'text-text-secondary hover:text-foreground hover:bg-[#161A1F]/50'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Alpha Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('relative')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 min-h-[38px] touch-manipulation ${
              activeTab === 'relative'
                ? 'bg-[#161A1F] text-gold border border-gold/40 shadow-sm ring-1 ring-gold/20'
                : 'text-text-secondary hover:text-foreground hover:bg-[#161A1F]/50'
            }`}
          >
            <GitCompareArrows size={14} />
            <span>RV Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('depth')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 min-h-[38px] touch-manipulation ${
              activeTab === 'depth'
                ? 'bg-[#161A1F] text-gold border border-gold/40 shadow-sm ring-1 ring-gold/20'
                : 'text-text-secondary hover:text-foreground hover:bg-[#161A1F]/50'
            }`}
          >
            <Layers size={14} />
            <span>Market Depth</span>
          </button>
        </div>

        <span className="hidden md:inline text-xs font-mono text-muted">Advanced Quant Studio</span>
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

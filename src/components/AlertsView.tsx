'use client';

import React, { useState } from 'react';
import { Bell, Plus, Trash2 } from 'lucide-react';
import { Alert } from '@/lib/types';

export function AlertsView() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'alt-1',
      priority: 'HIGH',
      type: 'opportunity',
      title: 'GOLDM / GOLDTEN Residual Crossed +2.0σ',
      description: 'Dislocation is at +2.41σ with +0.12% net edge after transaction and liquidity hurdles.',
      pair: 'GOLDM / GOLDTEN',
      residual: 0.33,
      zScore: 2.41,
      netEdge: 0.12,
      timestamp: '10:32:15 IST',
    },
    {
      id: 'alt-2',
      priority: 'MEDIUM',
      type: 'expiry',
      title: 'October Expiry Rolling Warning (18 DTE)',
      description: 'Contract rollover liquidity shifting from near-month to far-month.',
      timestamp: '09:45:00 IST',
    },
    {
      id: 'alt-3',
      priority: 'LOW',
      type: 'liquidity',
      title: 'GOLDPETAL Spread Widened to 0.08%',
      description: 'Retail order book depth thinned below ₹10 Lakhs threshold.',
      timestamp: '09:12:30 IST',
    },
  ]);

  const [newPair, setNewPair] = useState('GOLDM / GOLDTEN');
  const [newZScore, setNewZScore] = useState('2.5');

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlt: Alert = {
      id: `alt-${Date.now()}`,
      priority: 'HIGH',
      type: 'signal',
      title: `${newPair} Z-Score Alert (> ${newZScore}σ)`,
      description: `Trigger when residual spread exceeds ${newZScore} standard deviations.`,
      timestamp: 'Just now',
    };
    setAlerts([newAlt, ...alerts]);
  };

  return (
    <div className="flex-1 bg-background overflow-y-auto p-6 font-mono text-xs select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Bell size={20} className="text-gold" />
              QUANTITATIVE DISLOCATION ALERTS
            </h1>
            <p className="text-text-secondary text-xs mt-1 font-sans">
              Real-time monitoring for cross-contract Z-score, residual, and liquidity events.
            </p>
          </div>
        </div>

        {/* Create Alert Form */}
        <form onSubmit={handleCreateAlert} className="p-4 bg-panel rounded-xl border border-border flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-muted">Notify me when</span>
            <select
              value={newPair}
              onChange={(e) => setNewPair(e.target.value)}
              className="bg-secondary px-3 py-1.5 rounded border border-border text-foreground font-mono focus:outline-none"
            >
              <option value="GOLDM / GOLDTEN">GOLDM / GOLDTEN</option>
              <option value="GOLDGUINEA / GOLDPETAL">GOLDGUINEA / GOLDPETAL</option>
              <option value="GOLDM / GOLDGUINEA">GOLDM / GOLDGUINEA</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted">Z-Score &gt;</span>
            <input
              type="number"
              step="0.1"
              value={newZScore}
              onChange={(e) => setNewZScore(e.target.value)}
              className="w-20 bg-secondary px-3 py-1.5 rounded border border-border text-foreground font-mono focus:outline-none"
            />
            <span className="text-muted">σ</span>
          </div>

          <button
            type="submit"
            className="ml-auto px-4 py-1.5 bg-gold hover:bg-gold-hover text-background font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
          >
            <Plus size={14} />
            <span>CREATE ALERT</span>
          </button>
        </form>

        {/* Active Alerts List */}
        <div className="space-y-3">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className="p-4 bg-panel rounded-xl border border-border flex items-start justify-between gap-4"
            >
              <div className="space-y-1 font-sans">
                <div className="flex items-center gap-2 font-mono">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      alt.priority === 'HIGH'
                        ? 'bg-sell/20 text-sell border border-sell/30'
                        : alt.priority === 'MEDIUM'
                        ? 'bg-gold/20 text-gold border border-gold/30'
                        : 'bg-panel text-muted'
                    }`}
                  >
                    {alt.priority} PRIORITY
                  </span>
                  <span className="text-xs font-bold text-foreground">{alt.title}</span>
                  <span className="text-[10px] text-muted ml-auto">{alt.timestamp}</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{alt.description}</p>
              </div>

              <button
                onClick={() => setAlerts(alerts.filter((a) => a.id !== alt.id))}
                className="p-1.5 text-muted hover:text-sell rounded transition-colors"
                title="Delete Alert"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';

interface FooterProps {
  onNavigateTab: (tab: 'today' | 'compare' | 'playbooks' | 'proof' | 'method') => void;
  onOpenLegal: (type: 'terms' | 'privacy') => void;
}

export function Footer({ onNavigateTab, onOpenLegal }: FooterProps) {
  return (
    <footer className="border-t border-border bg-[#070708] pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#D6B26A" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" fill="#D6B26A" />
              </svg>
              <span className="font-display font-black tracking-tight text-lg text-text-primary">
                GoldLens
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed font-mono">
              Built by Team Crest for Hack in Hills &apos;26.<br />
              Source: MCX public Bhavcopy.
            </p>
          </div>

          {/* Product Col */}
          <div className="space-y-3 font-mono text-xs">
            <div className="text-text-primary font-bold uppercase tracking-wider">Product</div>
            <ul className="space-y-2 text-text-secondary">
              <li>
                <button onClick={() => onNavigateTab('today')} className="hover:text-gold transition-colors cursor-pointer">
                  Today&apos;s Verdict
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('compare')} className="hover:text-gold transition-colors cursor-pointer">
                  Compare Contracts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('playbooks')} className="hover:text-gold transition-colors cursor-pointer">
                  Playbooks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('proof')} className="hover:text-gold transition-colors cursor-pointer">
                  Walk-Forward Proof
                </button>
              </li>
            </ul>
          </div>

          {/* Learn Col */}
          <div className="space-y-3 font-mono text-xs">
            <div className="text-text-primary font-bold uppercase tracking-wider">Learn</div>
            <ul className="space-y-2 text-text-secondary">
              <li>
                <button onClick={() => onNavigateTab('method')} className="hover:text-gold transition-colors cursor-pointer">
                  Mathematical Method
                </button>
              </li>
              <li>
                <a href="#faq" className="hover:text-gold transition-colors">
                  Frequent Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Col */}
          <div className="space-y-3 font-mono text-xs">
            <div className="text-text-primary font-bold uppercase tracking-wider">Legal</div>
            <ul className="space-y-2 text-text-secondary">
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-gold transition-colors cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-gold transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <a href="mailto:teamcrest@hackinhills.org" className="hover:text-gold transition-colors">
                  Contact Team Crest
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Disclaimer */}
        <div className="border-t border-border pt-8 text-[11px] font-mono text-text-muted leading-relaxed max-w-4xl">
          GoldLens is an analytics and education tool based on end-of-day MCX settlement data. It does not provide investment advice or execute trades. Settlement prices are not executable fill prices. All transaction taxes are modeled under CTT rules.
        </div>
      </div>
    </footer>
  );
}

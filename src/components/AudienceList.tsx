'use client';

import React from 'react';

export function AudienceList() {
  const audiences = [
    {
      num: '01',
      title: 'Jewellers & bullion dealers',
      desc: 'Choose the cheapest hedge. Plan the roll.',
      details: 'Avoid taking excess delivery friction by comparing fine-gold equivalents before contract rollover windows.',
    },
    {
      num: '02',
      title: 'Retail investors',
      desc: 'The cheapest way to hold N grams until expiry.',
      details: 'Know whether PETAL, GUINEA or MINI delivers the lowest per-gram premium for your target gold allocation.',
    },
    {
      num: '03',
      title: 'Spread traders',
      desc: 'Only real gaps. Exact legs, exit rules, worst case.',
      details: 'Screen out artificial basis mispricings and trade only when carry-adjusted residual exceeds round-trip friction.',
    },
    {
      num: '04',
      title: 'Students & analysts',
      desc: 'Open method. Reproducible results.',
      details: 'Inspect our walk-forward cross-validation pipeline, gold beta attribution, and SEBI compliance guidelines.',
    },
  ];

  return (
    <section id="who-its-for" className="py-28 px-6 max-w-7xl mx-auto border-b border-border">
      <div className="max-w-3xl mb-12">
        <div className="text-xs uppercase tracking-[0.12em] font-mono text-gold mb-3">
          04 — BUILT FOR
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-text-primary leading-[1.05]">
          Who uses GoldLens.
        </h2>
      </div>

      <div className="divide-y divide-border border-y border-border">
        {audiences.map((a) => (
          <div
            key={a.num}
            className="group py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-surface/50 px-4 -mx-4 rounded-xl cursor-default"
          >
            <div className="flex items-start md:items-center gap-6">
              <span className="font-mono text-sm text-gold font-bold w-8">
                {a.num}
              </span>
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-text-primary group-hover:text-gold transition-colors">
                  {a.title}
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  {a.desc}
                </p>
              </div>
            </div>

            <div className="text-xs font-mono text-text-muted md:max-w-xs md:text-right">
              {a.details}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

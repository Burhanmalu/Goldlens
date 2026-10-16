'use client';

import React, { useState } from 'react';

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Is this live data?',
      a: "No. GoldLens uses end-of-day settlement data from MCX's public Bhavcopy. Every number shows its date.",
    },
    {
      q: 'Can I trade on GoldLens?',
      a: 'No. GoldLens is analysis and education. It does not place orders.',
    },
    {
      q: 'Is this investment advice?',
      a: 'No. It shows tested analytics and generic playbooks. Decisions and risk are yours.',
    },
    {
      q: 'Why do the four contracts show different prices?',
      a: 'They differ in lot size, quotation unit, purity (995 vs 999) and expiry date. GoldLens converts them to price per gram of fine gold and adjusts for the expiry gap.',
    },
    {
      q: "What does 'No trade today' mean?",
      a: 'The biggest gap is smaller than the cost of trading it, or the contracts are too thin to trade safely.',
    },
    {
      q: 'Is it free?',
      a: 'Yes, during the hackathon.',
    },
    {
      q: 'Where does the data come from?',
      a: 'MCX public Bhavcopy and MCX contract specifications. The method page lists every step.',
    },
    {
      q: "What about GOLDTEN's short history?",
      a: 'GOLDTEN listed in 2025, so pairs involving it have less history and are labelled accordingly.',
    },
  ];

  return (
    <section id="faq" className="py-28 px-6 max-w-7xl mx-auto border-b border-border">
      <div className="max-w-3xl mb-12">
        <div className="text-xs uppercase tracking-[0.12em] font-mono text-gold mb-3">
          06 — FREQUENT QUESTIONS
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-text-primary leading-[1.05]">
          Clear answers. No asterisks.
        </h2>
      </div>

      <div className="divide-y divide-border border-y border-border max-w-4xl">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="py-6">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-text-muted">
                    0{index + 1}
                  </span>
                  <span className="font-display text-lg sm:text-xl font-bold text-text-primary group-hover:text-gold transition-colors">
                    {faq.q}
                  </span>
                </div>
                <span className="font-mono text-lg text-text-muted group-hover:text-gold ml-4">
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen && (
                <div className="pt-4 pl-8 pr-4 text-sm sm:text-base text-text-secondary leading-relaxed font-sans animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

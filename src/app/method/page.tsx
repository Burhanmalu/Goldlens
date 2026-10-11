'use client';

import React from 'react';
import Link from 'next/link';
import { MethodologyView } from '@/components/MethodologyView';

export default function MethodPageRoute() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F2EA] p-6 max-w-5xl mx-auto">
      <div className="mb-6 border-b border-white/10 pb-4">
        <Link href="/" className="text-xs font-mono text-[#D6B26A] hover:underline">
          ← Return to GoldLens Home
        </Link>
      </div>
      <MethodologyView onNavigate={() => { window.location.href = '/'; }} />
    </div>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | GoldLens',
  description: 'Terms of Service and educational disclaimer for GoldLens.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F2EA] p-8 max-w-4xl mx-auto space-y-6 font-mono">
      <div className="border-b border-white/10 pb-4">
        <Link href="/" className="text-xs text-[#D6B26A] hover:underline">← Back to GoldLens</Link>
        <h1 className="text-2xl font-bold font-sans mt-4 text-[#F5F2EA]">Terms of Service</h1>
        <p className="text-xs text-[#6F6A5F] mt-1">Last updated: 11 October 2026</p>
      </div>

      <div className="space-y-4 text-xs text-[#A29C8E] leading-relaxed">
        <p>
          GoldLens is an analytics and education tool based on end-of-day MCX settlement data. It does not provide investment advice or execute trades. Settlement prices are not executable fill prices.
        </p>
        <p>
          All information is provided for research and quantitative demonstration purposes for Hack in Hills &apos;26. Past performance and theoretical spreads do not guarantee future returns.
        </p>
      </div>
    </div>
  );
}

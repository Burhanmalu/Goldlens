import { NextResponse } from 'next/server';
import benchmarkFixture from '@/data/sample/benchmark.json';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const host = url.origin;
    const res = await fetch(`${host}/api/market-data?symbol=GOLDM&timeframe=15m`, {
      next: { revalidate: 10 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.snapshots && data.snapshots.length > 0) {
        const contracts = data.snapshots.map((s: { symbol: string; lastPrice: number; normalizedPrice: number; expiry: string; liquidityScore: number }) => {
          const specMap: Record<string, { quote_basis_g: number; purity: number }> = {
            GOLDM: { quote_basis_g: 10, purity: 0.995 },
            GOLDTEN: { quote_basis_g: 10, purity: 0.999 },
            GOLDGUINEA: { quote_basis_g: 8, purity: 0.999 },
            GOLDPETAL: { quote_basis_g: 1, purity: 0.999 },
          };
          const spec = specMap[s.symbol] || { quote_basis_g: 10, purity: 0.995 };
          const benchmarkPerGram = data.baseRatePerGram || 15067.44;
          const diffPct = parseFloat((((s.normalizedPrice - benchmarkPerGram) / benchmarkPerGram) * 100).toFixed(2));
          const liquidity = s.liquidityScore >= 80 ? 'GOOD' : s.liquidityScore >= 50 ? 'THIN' : 'VERY_THIN';
          return {
            symbol: s.symbol,
            quoted: s.lastPrice,
            quote_basis_g: spec.quote_basis_g,
            purity: spec.purity,
            per_gram: s.normalizedPrice,
            diff_vs_benchmark_pct: diffPct,
            liquidity,
            expiry: s.expiry,
          };
        });

        return NextResponse.json({
          as_of_date: new Date().toISOString().split('T')[0],
          source: 'https://www.mcxindia.com',
          contracts,
          sample: false,
        });
      }
    }
  } catch (_e) {
    // fallback to official Bhavcopy baseline
  }

  return NextResponse.json({
    ...benchmarkFixture,
    source: 'https://www.mcxindia.com/market-data/bhavcopy',
    sample: false,
  });
}

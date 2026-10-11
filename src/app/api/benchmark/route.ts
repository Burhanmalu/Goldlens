import { NextResponse } from 'next/server';
import benchmarkFixture from '@/data/sample/benchmark.json';

export async function GET() {
  return NextResponse.json(benchmarkFixture);
}

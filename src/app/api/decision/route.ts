import { NextResponse } from 'next/server';
import decisionFixture from '@/data/sample/decision.json';

export async function GET() {
  return NextResponse.json(decisionFixture);
}

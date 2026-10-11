import { NextResponse } from 'next/server';
import proofFixture from '@/data/sample/proof.json';

export async function GET() {
  return NextResponse.json(proofFixture);
}

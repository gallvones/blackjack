import { NextResponse } from 'next/server';
const BASE ='http://localhost:3000';

export async function POST() {
  const r = await fetch(`${BASE}/api/game/hit`, { method: 'POST' });
  return NextResponse.json(await r.json(), { status: r.status });
}

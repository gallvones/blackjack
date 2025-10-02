import { NextResponse } from 'next/server';
const BASE = 'http://localhost:3000';

export async function POST(req: Request) {
  const body = await req.json();

  const r = await fetch(`${BASE}/api/game/hit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return NextResponse.json(await r.json(), { status: r.status });
}

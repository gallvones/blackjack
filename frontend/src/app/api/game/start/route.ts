import { NextResponse } from 'next/server';
const BASE = 'http://localhost:3000'; // backend NestJS

export async function POST(req: Request) {
  const body = await req.json(); // lê o body enviado pelo frontend

  const r = await fetch(`${BASE}/api/game/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body), // repassa pro backend
  });

  return NextResponse.json(await r.json(), { status: r.status });
}

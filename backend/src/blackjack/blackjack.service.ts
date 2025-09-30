import { Injectable } from '@nestjs/common';

export type RoundState = 'idle' | 'playing' | 'bust' | 'finished';

export interface GameState {
  roundId: string;
  hand: string[];
  total: number;
  state: RoundState;
  pointsLastRound: number;
  score: number;
}

// Aqui eu simulei um baralho real -> 13 valores × 4 naipes = 52 cartas únicas, 52 string únicas para cada carta
const SUITS = ['♣️', '♦️', '♠️', '♥️'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

@Injectable()
export class BlackjackService {
  private deck: string[] = [];
  private currentRound: GameState | null = null;
  private score = 0; // O saldo acumulado

  // Cria e embaralha o baralho 
  private newDeck(): string[] {
    const d: string[] = [];
    for (const v of VALUES) for (const s of SUITS) d.push(`${v}${s}`); // estabelecendo as string únicas
    return d.sort(() => Math.random() - 0.5); // shuffle simples
  }

  // Soma da mão (A=11 e rebaixa para 1 se estourar; J/Q/K = 10)
  private total(hand: string[]): number {
    let sum = 0, aces = 0;
    for (const c of hand) {
      const v = c.replace(/[^0-9AJQK]/g, ''); // remove o naipe da carta
      if (v === 'A') { aces++; sum += 11; }
      else if (v === 'J' || v === 'Q' || v === 'K') sum += 10;
      else sum += parseInt(v, 10);
    }
    while (sum > 21 && aces > 0) { sum -= 10; aces--; } // rebaixa o A
    return sum;
  }

  // Regra de pontos
  private points(t: number): number {
    if (t > 21) return 0;
    if (t === 21) return 100;
    return Math.floor((t / 21) * 100);
  }

  // 1) start: cria a rodada com baralho embaralhado e 1 carta inicial
  start(): GameState {
    this.deck = this.newDeck();
    const hand = [this.deck.pop()!];
    this.currentRound = {
      roundId: '' + Date.now(),
      hand,
      total: this.total(hand),
      state: 'playing',
      pointsLastRound: 0,
      score: this.score,
    };
    return this.currentRound;
  }

  // 2) hit: compra 1 carta, recalcula total e aplica bust, se a conta for acima de 21
  hit(): GameState {
    if (!this.currentRound || this.currentRound.state !== 'playing') {
      throw new Error('Nenhuma rodada ativa');
    }
    if (this.deck.length === 0) throw new Error('Baralho esgotado; inicie nova rodada');

    this.currentRound.hand.push(this.deck.pop()!);
    this.currentRound.total = this.total(this.currentRound.hand);

    if (this.currentRound.total > 21) {
      this.currentRound.state = 'bust';
      this.currentRound.pointsLastRound = 0; // bust = 0 pontos
    }
    return this.currentRound;
  }

  // 3) stand: finaliza, calcula pontos e soma no saldo
  stand(): GameState {
    if (!this.currentRound || this.currentRound.state !== 'playing') {
      throw new Error('Nenhuma rodada ativa');
    }
    this.currentRound.state = 'finished';
    this.currentRound.pointsLastRound = this.points(this.currentRound.total);
    this.score += this.currentRound.pointsLastRound; // O saldo só soma, nunca subtrai
    this.currentRound.score = this.score;
    return this.currentRound;
  }
}

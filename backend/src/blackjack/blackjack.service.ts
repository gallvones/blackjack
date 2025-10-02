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

const SUITS = ['♣️', '♦️', '♠️', '♥️'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

@Injectable()
export class BlackjackService {
  private deck: string[] = [];
  private currentRound: GameState | null = null;
  private score = 0;

  private newDeck(): string[] {
    const d: string[] = [];
    for (const v of VALUES) for (const s of SUITS) d.push(`${v}${s}`);
    return d.sort(() => Math.random() - 0.5);
  }

  private total(hand: string[]): number {
    let sum = 0, aces = 0;
    for (const c of hand) {
      const v = c.replace(/[^0-9AJQK]/g, '');
      if (v === 'A') { aces++; sum += 11; }
      else if (['J', 'Q', 'K'].includes(v)) sum += 10;
      else sum += parseInt(v, 10);
    }
    while (sum > 21 && aces > 0) { sum -= 10; aces--; }
    return sum;
  }

  private points(t: number): number {
    if (t > 21) return 0;
    if (t === 21) return 100;
    return Math.floor((t / 21) * 100);
  }

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

  hit(): GameState {
    if (!this.currentRound || this.currentRound.state !== 'playing') {
      throw new Error('Nenhuma rodada ativa');
    }
    if (this.deck.length === 0) throw new Error('Baralho esgotado');

    this.currentRound.hand.push(this.deck.pop()!);
    this.currentRound.total = this.total(this.currentRound.hand);

    if (this.currentRound.total > 21) {
      this.currentRound.state = 'bust';
      this.currentRound.pointsLastRound = 0;
    }
    return this.currentRound;
  }

  stand(): GameState {
    if (!this.currentRound || this.currentRound.state !== 'playing') {
      throw new Error('Nenhuma rodada ativa');
    }
    this.currentRound.state = 'finished';
    this.currentRound.pointsLastRound = this.points(this.currentRound.total);
    this.score += this.currentRound.pointsLastRound;
    this.currentRound.score = this.score;
    return this.currentRound;
  }
}

'use client';
import { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
type RoundState = 'idle' | 'playing' | 'bust' | 'finished'; // Rodada inativa | rodada ativa com hit ou stand | passou de 21? ponstos zerados e rodada inativa | Jogador utilizou o stand. pontos calculados
type GameState = { roundId:string; hand:string[]; total:number; state:RoundState; pointsLastRound:number; score:number; };

export default function Home() {
  const [game, setGame] = useState<GameState|null>(null);
  const [loading, setLoading] = useState<null|'start'|'hit'|'stand'>(null);
  const state: RoundState = game?.state ?? 'idle';
  const canStart = state === 'idle' || state === 'bust' || state === 'finished';
  const canHit = state === 'playing';
  const canStand = state === 'playing';

  async function call(action:'start'|'hit'|'stand') {
    if (loading) return;
    setLoading(action);
    try {
      const res = await fetch(`/api/game/${action}`, { method:'POST' });
      const data = await res.json();
      setGame(data);
    } finally { setLoading(null); }
  }

  return (
    <div className={styles.mainContainer}>
     <div className={styles.imgContainer}> <Image
      src="/img/blackjack.png"
      alt="blackjack"
      width={330}
      height={280}
      style={{ borderRadius: 20, border: '4px solid rgb(129, 121, 82)' }}
      priority
      />
      </div>
      <h3 className={styles.title}>Arcade Blackjack</h3>
      <div className={styles.listContainer}>
        <div><b>Estado:</b> {state}</div>
        <div><b>Round ID:</b> {game?.roundId ?? '-'}</div>
        
        
      </div>
      <div className={styles.cardsContainer}>
      <div className={styles.cardsOnHand}><b>Cartas:</b> {game?.hand?.length ? game.hand.join('  ') : ''}</div>
      
        <div><b>Total:</b> {game?.total ?? 0}</div>
      </div>
      <div className={styles.buttonsContainer}>
        <button onClick={()=>call('start')} disabled={!canStart||!!loading}>{loading==='start'?'Iniciando…':'Start'}</button>
        <button onClick={()=>call('hit')}   disabled={!canHit||!!loading}>{loading==='hit'?'Comprando…':'Hit'}</button>
        <button onClick={()=>call('stand')} disabled={!canStand||!!loading}>{loading==='stand'?'Calculando…':'Stand'}</button>
      </div>
      <div className={styles.lastPontuation}><b>Ultima pontuação:</b> {game?.pointsLastRound ?? 0}</div>
        <div className={styles.kassinoMoney}><b>Saldo Atual: </b> K${game?.score ?? 0}</div>
        
    </div>
  );
}

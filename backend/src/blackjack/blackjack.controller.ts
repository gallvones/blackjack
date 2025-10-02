import { Controller, Post, Body } from '@nestjs/common';
import { BlackjackService } from './blackjack.service';
import type { GameState } from './blackjack.service';
import { UsersService } from '../users/users.service';

@Controller('api/game')
export class BlackjackController {
  constructor(
    private readonly blackjack: BlackjackService,
    private readonly usersService: UsersService,
  ) {}

  @Post('start')
  async start(@Body('email') email?: string): Promise<GameState> {
    const game = this.blackjack.start();

    console.log('[START] Email recebido:', email);

    if (email) {
      const user = await this.usersService.findOrCreate(email);
      console.log('[START] Usuário encontrado/criado:', user);
      game.score = user.saldoK; // pega saldo do banco
    }

    return game;
  }

  @Post('hit')
  hit(): GameState {
    return this.blackjack.hit();
  }

  @Post('stand')
  async stand(@Body('email') email?: string): Promise<GameState> {
    const game = this.blackjack.stand();

    console.log('[STAND] Email recebido:', email);
    console.log('[STAND] Pontos da rodada:', game.pointsLastRound);

    if (email) {
      // atualiza o saldo do usuário com os pontos da rodada
      const updatedUser = await this.usersService.updateSaldo(email, game.pointsLastRound);
      console.log('[STAND] Usuário atualizado:', updatedUser);

      // busca o valor atualizado do banco
      const user = await this.usersService.findByEmail(email);
      if (user) {
        console.log('[STAND] Saldo atualizado no banco:', user.saldoK);
        game.score = user.saldoK;
      }
    }

    return game;
  }
}

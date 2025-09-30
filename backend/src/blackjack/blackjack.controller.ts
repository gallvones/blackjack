import { Controller, Post } from '@nestjs/common';
import { BlackjackService } from './blackjack.service';
import type { GameState } from './blackjack.service';

@Controller('api/game')
export class BlackjackController {
  constructor(private readonly blackjack: BlackjackService) {}

  @Post('start')
  start(): GameState {
    return this.blackjack.start();
  }

  @Post('hit')
  hit(): GameState {
    return this.blackjack.hit();
  }

  @Post('stand')
  stand(): GameState {
    return this.blackjack.stand();
  }
}

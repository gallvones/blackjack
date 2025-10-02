
import { Module } from '@nestjs/common';
import { BlackjackController } from './blackjack.controller';
import { BlackjackService } from './blackjack.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule], // <- adiciona aqui
  controllers: [BlackjackController],
  providers: [BlackjackService],
})
export class BlackjackModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlackjackModule } from './blackjack/blackjack.module';

@Module({
  imports: [BlackjackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlackjackModule } from './blackjack/blackjack.module';
import { DatabaseModule } from './infra/database.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    DatabaseModule,
    BlackjackModule,
    UsersModule
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

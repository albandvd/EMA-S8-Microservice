import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlinesModule } from './airlines/airlines.module';

@Module({
  imports: [AirlinesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

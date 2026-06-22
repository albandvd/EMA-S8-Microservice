import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlinesModule } from './airlines/airlines.module';
import { FlightsModule } from './flights/flights.module';

@Module({
  imports: [AirlinesModule, FlightsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

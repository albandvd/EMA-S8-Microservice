import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { AirlinesModule } from '../airlines/airlines.module';

@Module({
  imports: [AirlinesModule],
  controllers: [FlightsController],
  providers: [FlightsService],
})
export class FlightsModule {}

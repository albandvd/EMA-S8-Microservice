import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { FlightsModule } from '../flights/flights.module';

@Module({
  imports: [FlightsModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}

import { TicketClass } from '../entities/ticket.entity';

export class UpdateTicketDto {
  flight_id: number;
  price: number;
  class: TicketClass;
  seat: string;
  name: string;
}

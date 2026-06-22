import { TicketClass } from '../entities/ticket.entity';

export class CreateTicketDto {
  flight_id: number;
  price: number;
  class: TicketClass;
  seat: string;
  name: string;
}

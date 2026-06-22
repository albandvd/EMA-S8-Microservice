import { Flight } from '../../flights/entities/flight.entity';

export type TicketClass = 'economy' | 'business' | 'first';

export class Ticket {
  id: number;
  flight: Flight;
  price: number;
  class: TicketClass;
  seat: string;
  name: string;
}

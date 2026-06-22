import { Airline } from '../../airlines/entities/airline.entity';

export class Flight {
  id: number;
  airline: Airline;
  departure: string;
  arrival: string;
  date: string;
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FlightsService } from '../flights/flights.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket, TicketClass } from './entities/ticket.entity';

const VALID_CLASSES: TicketClass[] = ['economy', 'business', 'first'];
const SEAT_PATTERN = /^[0-9]{1,3}[A-F]$/;

@Injectable()
export class TicketsService {
  private tickets: Ticket[] = [];
  private nextId = 1;

  constructor(private readonly flightsService: FlightsService) {}

  create(dto: CreateTicketDto): Ticket {
    this.validate(dto);
    const flight = this.flightsService.findOne(dto.flight_id);
    const ticket: Ticket = {
      id: this.nextId++,
      flight,
      price: dto.price,
      class: dto.class,
      seat: dto.seat,
      name: dto.name,
    };
    this.tickets.push(ticket);
    return ticket;
  }

  findAll(flightId?: number, ticketClass?: TicketClass): Ticket[] {
    return this.tickets.filter((t) => {
      if (flightId !== undefined && t.flight.id !== flightId) return false;
      if (ticketClass && t.class !== ticketClass) return false;
      return true;
    });
  }

  findOne(id: number): Ticket {
    const ticket = this.tickets.find((t) => t.id === id);
    if (!ticket) throw new NotFoundException(`Ticket #${id} not found`);
    return ticket;
  }

  update(id: number, dto: UpdateTicketDto): Ticket {
    this.validate(dto);
    const ticket = this.findOne(id);
    const flight = this.flightsService.findOne(dto.flight_id);
    ticket.flight = flight;
    ticket.price = dto.price;
    ticket.class = dto.class;
    ticket.seat = dto.seat;
    ticket.name = dto.name;
    return ticket;
  }

  remove(id: number): void {
    const index = this.tickets.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException(`Ticket #${id} not found`);
    this.tickets.splice(index, 1);
  }

  private validate(dto: { flight_id: number; price: number; class: TicketClass; seat: string; name: string }): void {
    if (!dto.flight_id) throw new BadRequestException('flight_id is required');
    if (dto.price === undefined || dto.price < 0) throw new BadRequestException('price must be >= 0');
    if (!dto.class || !VALID_CLASSES.includes(dto.class))
      throw new BadRequestException('class must be one of: economy, business, first');
    if (!dto.seat || !SEAT_PATTERN.test(dto.seat))
      throw new BadRequestException('seat must match pattern [0-9]{1,3}[A-F] (e.g. 14A)');
    if (!dto.name || dto.name.length < 2) throw new BadRequestException('name must be at least 2 characters');
  }
}

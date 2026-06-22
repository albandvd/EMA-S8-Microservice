import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AirlinesService } from '../airlines/airlines.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { Flight } from './entities/flight.entity';

@Injectable()
export class FlightsService {
  private flights: Flight[] = [];
  private nextId = 1;

  constructor(private readonly airlinesService: AirlinesService) {}

  create(dto: CreateFlightDto): Flight {
    this.validate(dto);
    const airline = this.airlinesService.findOne(dto.airline_id);
    const flight: Flight = {
      id: this.nextId++,
      airline,
      departure: dto.departure.toUpperCase(),
      arrival: dto.arrival.toUpperCase(),
      date: dto.date,
    };
    this.flights.push(flight);
    return flight;
  }

  findAll(airlineId?: number, date?: string): Flight[] {
    return this.flights.filter((f) => {
      if (airlineId !== undefined && f.airline.id !== airlineId) return false;
      if (date && !f.date.startsWith(date)) return false;
      return true;
    });
  }

  findOne(id: number): Flight {
    const flight = this.flights.find((f) => f.id === id);
    if (!flight) throw new NotFoundException(`Flight #${id} not found`);
    return flight;
  }

  update(id: number, dto: UpdateFlightDto): Flight {
    this.validate(dto);
    const flight = this.findOne(id);
    const airline = this.airlinesService.findOne(dto.airline_id);
    flight.airline = airline;
    flight.departure = dto.departure.toUpperCase();
    flight.arrival = dto.arrival.toUpperCase();
    flight.date = dto.date;
    return flight;
  }

  remove(id: number): void {
    const index = this.flights.findIndex((f) => f.id === id);
    if (index === -1) throw new NotFoundException(`Flight #${id} not found`);
    this.flights.splice(index, 1);
  }

  private validate(dto: { airline_id: number; departure: string; arrival: string; date: string }): void {
    if (!dto.airline_id) throw new BadRequestException('airline_id is required');
    if (!dto.departure || dto.departure.length !== 3)
      throw new BadRequestException('departure must be exactly 3 characters (IATA code)');
    if (!dto.arrival || dto.arrival.length !== 3)
      throw new BadRequestException('arrival must be exactly 3 characters (IATA code)');
    if (!dto.date) throw new BadRequestException('date is required');
  }
}

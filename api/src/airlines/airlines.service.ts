import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';
import { Airline } from './entities/airline.entity';

@Injectable()
export class AirlinesService {
  private airlines: Airline[] = [];
  private nextId = 1;

  create(dto: CreateAirlineDto): Airline {
    this.validate(dto);
    const airline: Airline = { id: this.nextId++, name: dto.name, nationality: dto.nationality };
    this.airlines.push(airline);
    return airline;
  }

  findAll(): Airline[] {
    return this.airlines;
  }

  findOne(id: number): Airline {
    const airline = this.airlines.find((a) => a.id === id);
    if (!airline) throw new NotFoundException(`Airline #${id} not found`);
    return airline;
  }

  update(id: number, dto: UpdateAirlineDto): Airline {
    this.validate(dto);
    const airline = this.findOne(id);
    airline.name = dto.name;
    airline.nationality = dto.nationality;
    return airline;
  }

  remove(id: number): void {
    const index = this.airlines.findIndex((a) => a.id === id);
    if (index === -1) throw new NotFoundException(`Airline #${id} not found`);
    this.airlines.splice(index, 1);
  }

  private validate(dto: { name: string; nationality: string }): void {
    if (!dto.name || dto.name.length < 3)
      throw new BadRequestException('name must be at least 3 characters');
    if (!dto.nationality || dto.nationality.length !== 2)
      throw new BadRequestException('nationality must be exactly 2 characters (ISO 3166-1 alpha-2)');
  }
}

import { Controller, Get, Post, Put, Body, Param, Delete, HttpCode, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Post()
  create(@Body() createFlightDto: CreateFlightDto) {
    return this.flightsService.create(createFlightDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('airline_id') airlineId?: string,
    @Query('date') date?: string,
  ) {
    return this.flightsService.findAll(
      airlineId !== undefined ? parseInt(airlineId, 10) : undefined,
      date,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.flightsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateFlightDto: UpdateFlightDto) {
    return this.flightsService.update(id, updateFlightDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.flightsService.remove(id);
  }
}

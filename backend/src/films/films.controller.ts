import { Controller, Get, InternalServerErrorException, Param } from '@nestjs/common';

import { FilmScheduleResponseDto, FilmsResponseDto } from './dto/films.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<FilmsResponseDto> {
    try {
      const result = await this.filmsService.getFilms();
      return result;
    } catch (err) {
      console.error(' getFilms CI error:', {
        message: err?.message,
        name: err?.name,
        stack: err?.stack,
      });

      throw new InternalServerErrorException(
        'getFilms failed: ' + (err?.message ?? 'unknown error'),
      );
    }
  }

  @Get(':id/schedule')
  async getFilmSchedule(@Param('id') id: string): Promise<FilmScheduleResponseDto> {
    try {
      const result = await this.filmsService.getFilmSchedule(id);
      return result;
    } catch (err) {
      console.error('🔥 getFilmSchedule CI error:', {
        message: err?.message,
        name: err?.name,
        stack: err?.stack,
      });

      throw new InternalServerErrorException(
        'getFilmSchedule failed: ' + (err?.message ?? 'unknown error'),
      );
    }
  }
}

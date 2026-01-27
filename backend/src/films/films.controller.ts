import { Controller, Get, Param } from '@nestjs/common';

import { FilmScheduleResponseDto, FilmsResponseDto } from './dto/films.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<FilmsResponseDto> {
    try {
      return await this.filmsService.getFilms();
    } catch (err) {
      console.error('🔥 [GET /api/afisha/films] getFilms error:', err);
      throw err;
    }
  }

  @Get(':id/schedule')
  async getFilmSchedule(
    @Param('id') id: string,
  ): Promise<FilmScheduleResponseDto> {
    try {
      return await this.filmsService.getFilmSchedule(id);
    } catch (err) {
      console.error(
        `🔥 [GET /api/afisha/films/${id}/schedule] getFilmSchedule error:`,
        err,
      );
      throw err;
    }
  }
}

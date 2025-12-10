import { Injectable, NotFoundException } from '@nestjs/common';

import { FilmDto, FilmScheduleResponseDto, FilmsResponseDto, ScheduleDto } from './dto/films.dto';
import { FilmEntity, FilmsRepository, ScheduleEntity } from './films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getFilms(): Promise<FilmsResponseDto> {
    const films = await this.filmsRepository.findAll();

    return {
      total: films.length,
      items: films.map((film) => this.toFilmDto(film)),
    };
  }

  async getFilmSchedule(id: string): Promise<FilmScheduleResponseDto> {
    const film = await this.filmsRepository.findById(id);

    if (!film) {
      throw new NotFoundException({ error: 'Film not found' });
    }
    const scheduleDtos = film.schedule.map((s) => this.toScheduleDto(s));

    return {
      ...this.toFilmDto(film),
      schedule: scheduleDtos,
      total: scheduleDtos.length,
      items: scheduleDtos,
    };
  }

  private toFilmDto(film: FilmEntity): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags ?? [],
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }

  private toScheduleDto(session: ScheduleEntity): ScheduleDto {
    return {
      id: session.id,
      daytime: session.daytime.toISOString(),
      hall: session.hall,
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken ?? [],
    };
  }
}

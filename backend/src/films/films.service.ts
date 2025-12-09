import { Injectable, NotFoundException } from '@nestjs/common';

import {
  FilmEntity,
  FilmsRepository,
  ScheduleEntity,
} from '../repository/films.repository';
import {
  FilmDto,
  FilmScheduleResponseDto,
  FilmsResponseDto,
  ScheduleDto,
} from './dto/films.dto';

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

    return {
      total: film.schedule.length,
      items: film.schedule.map((s) => this.toScheduleDto(s)),
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
      hall: String(session.hall),
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken ?? [],
    };
  }
}

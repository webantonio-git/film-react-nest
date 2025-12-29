import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilmEntityOrm } from './entities/film.entity';
import { ScheduleEntityOrm } from './entities/schedule.entity';

export interface ScheduleEntity {
  id: string;
  daytime: Date;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export interface FilmEntity {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: ScheduleEntity[];
}

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(FilmEntityOrm)
    private readonly filmRepo: Repository<FilmEntityOrm>,
    @InjectRepository(ScheduleEntityOrm)
    private readonly scheduleRepo: Repository<ScheduleEntityOrm>,
  ) {}

  async findAll(): Promise<FilmEntity[]> {
    const films = await this.filmRepo.find({
      relations: { schedule: true },
      order: { title: 'ASC' },
    });

    return films.map((f) => this.mapOrmToEntity(f));
  }

  async findById(id: string): Promise<FilmEntity | null> {
    const film = await this.filmRepo.findOne({
      where: { id },
      relations: { schedule: true },
    });

    if (!film) return null;
    return this.mapOrmToEntity(film);
  }

  async bookSeat(filmId: string, sessionId: string, row: number, seat: number): Promise<boolean> {
    const seatKey = `${row}:${seat}`;

    const res = await this.scheduleRepo
      .createQueryBuilder()
      .update(ScheduleEntityOrm)
      .set({
        taken: () => `CASE WHEN "taken" = '' THEN :seatKey ELSE "taken" || ',' || :seatKey END`,
      })
      .where('"id" = :sessionId', { sessionId })
      .andWhere('"filmId" = :filmId', { filmId })
      .andWhere(`NOT (:seatKey = ANY(string_to_array("taken", ',')))`, { seatKey })
      .execute();

    return (res.affected ?? 0) > 0;
  }

  private mapOrmToEntity(film: FilmEntityOrm): FilmEntity {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: this.parseCsvList(film.tags),
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
      schedule: (film.schedule ?? []).map((s) => ({
        id: s.id,
        daytime: new Date(s.daytime),
        hall: s.hall,
        rows: s.rows,
        seats: s.seats,
        price: s.price,
        taken: this.parseCsvList(s.taken),
      })),
    };
  }

  private parseCsvList(value: string | null | undefined): string[] {
    const v = (value ?? '').trim();
    if (!v) return [];
    return v
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
  }
}

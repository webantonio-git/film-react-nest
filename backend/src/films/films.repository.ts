import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Film, FilmDocument, Schedule } from './shemas/film.shema';

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
    @InjectModel(Film.name)
    private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<FilmEntity[]> {
    const docs = await this.filmModel.find().lean();
    return docs.map((doc) => this.mapDocToEntity(doc));
  }

  async findById(id: string): Promise<FilmEntity | null> {
    const doc = await this.filmModel.findOne({ id }).lean();
    if (!doc) {
      return null;
    }
    return this.mapDocToEntity(doc);
  }

  async bookSeat(filmId: string, sessionId: string, row: number, seat: number): Promise<boolean> {
    const seatKey = `${row}:${seat}`;

    const updated = await this.filmModel.updateOne(
      {
        id: filmId,
        'schedule.id': sessionId,
        'schedule.taken': { $ne: seatKey },
      },
      {
        $addToSet: { 'schedule.$.taken': seatKey },
      },
    );

    return updated.modifiedCount > 0;
  }

  private mapDocToEntity(doc: Film & { schedule: Schedule[] }): FilmEntity {
    return {
      id: doc.id,
      rating: doc.rating,
      director: doc.director,
      tags: doc.tags ?? [],
      image: doc.image,
      cover: doc.cover,
      title: doc.title,
      about: doc.about,
      description: doc.description,
      schedule: (doc.schedule ?? []).map((s) => ({
        id: s.id,
        daytime: s.daytime instanceof Date ? s.daytime : new Date(s.daytime),
        hall: s.hall,
        rows: s.rows,
        seats: s.seats,
        price: s.price,
        taken: s.taken ?? [],
      })),
    };
  }
}

import { Inject, Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';

import { DATABASE_CONNECTION } from './database.providers';

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

export type FilmDocument = FilmEntity & mongoose.Document;

const ScheduleSchema = new mongoose.Schema<ScheduleEntity>({
  id: { type: String, required: true },
  daytime: { type: Date, required: true },
  hall: { type: Number, required: true },
  rows: { type: Number, required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true },
  taken: { type: [String], default: [] },
});

const FilmSchema = new mongoose.Schema<FilmEntity>({
  id: { type: String, required: true, unique: true },
  rating: { type: Number, required: true },
  director: { type: String, required: true },
  tags: { type: [String], default: [] },
  image: { type: String, required: true },
  cover: { type: String, required: true },
  title: { type: String, required: true },
  about: { type: String, required: true },
  description: { type: String, required: true },
  schedule: { type: [ScheduleSchema], default: [] },
});

@Injectable()
export class FilmsRepository {
  private readonly filmModel: mongoose.Model<FilmDocument>;

  constructor(@Inject(DATABASE_CONNECTION) connection: mongoose.Connection) {
    this.filmModel = connection.model<FilmDocument>(
      'Film',
      FilmSchema,
      'films',
    );
  }

  async findAll(): Promise<FilmEntity[]> {
    const docs: FilmDocument[] = await this.filmModel.find().exec();

    return docs.map((doc: FilmDocument) => this.mapDocToEntity(doc));
  }

  async findById(id: string): Promise<FilmEntity | null> {
    const doc: FilmDocument | null = await this.filmModel
      .findOne({ id })
      .exec();

    if (!doc) {
      return null;
    }

    return this.mapDocToEntity(doc);
  }

  async bookSeat(
    filmId: string,
    scheduleId: string,
    row: number,
    seat: number,
  ): Promise<boolean> {
    const placeKey = `${row}:${seat}`;

    const result = await this.filmModel
      .updateOne(
        {
          id: filmId,
          'schedule.id': scheduleId,
          'schedule.taken': { $ne: placeKey },
        },
        {
          $addToSet: {
            'schedule.$.taken': placeKey,
          },
        },
      )
      .exec();

    let modified = 0;

    if ('modifiedCount' in result && typeof result.modifiedCount === 'number') {
      modified = result.modifiedCount;
    } else if (
      'nModified' in result &&
      typeof (result as { nModified: number }).nModified === 'number'
    ) {
      modified = (result as { nModified: number }).nModified;
    }

    return modified > 0;
  }

  private mapDocToEntity(doc: FilmDocument): FilmEntity {
    const schedule: ScheduleEntity[] = (doc.schedule ?? []).map(
      (session: ScheduleEntity): ScheduleEntity => ({
        id: session.id,
        daytime:
          session.daytime instanceof Date
            ? session.daytime
            : new Date(session.daytime),
        hall: Number(session.hall),
        rows: session.rows,
        seats: session.seats,
        price: session.price,
        taken: session.taken ?? [],
      }),
    );

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
      schedule,
    };
  }
}

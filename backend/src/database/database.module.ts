import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmEntityOrm } from '../films/entities/film.entity';
import { ScheduleEntityOrm } from '../films/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
useFactory: () => {
  const {
    DATABASE_DRIVER = 'postgres',
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_NAME,
    TYPEORM_SYNCHRONIZE,
    TYPEORM_LOGGING,
  } = process.env;

  const missing: string[] = [];
  if (!DATABASE_HOST) missing.push('DATABASE_HOST');
  if (!DATABASE_PORT) missing.push('DATABASE_PORT');
  if (!DATABASE_USERNAME) missing.push('DATABASE_USERNAME');
  if (!DATABASE_PASSWORD) missing.push('DATABASE_PASSWORD');
  if (!DATABASE_NAME) missing.push('DATABASE_NAME');

  if (missing.length) {
    throw new Error(
      `Database env vars are not set: ${missing.join(', ')}`,
    );
  }

  return {
    type: DATABASE_DRIVER as 'postgres',
    host: DATABASE_HOST,
    port: Number(DATABASE_PORT),
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    entities: [FilmEntityOrm, ScheduleEntityOrm],
    synchronize: TYPEORM_SYNCHRONIZE === 'true',
    logging: TYPEORM_LOGGING === 'true',
  };
}

    }),

    TypeOrmModule.forFeature([FilmEntityOrm, ScheduleEntityOrm]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmEntityOrm } from '../films/entities/film.entity';
import { ScheduleEntityOrm } from '../films/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const {
          DATABASE_HOST = 'localhost',
          DATABASE_PORT ,
          DATABASE_USERNAME ,
          DATABASE_PASSWORD ,
          DATABASE_NAME = 'films',
          TYPEORM_SYNCHRONIZE = 'false',
          TYPEORM_LOGGING = 'false',
        } = process.env;

        const host = String(DATABASE_HOST);
        const port = Number(DATABASE_PORT);
        const username = String(DATABASE_USERNAME);
        const password = String(DATABASE_PASSWORD);
        const database = String(DATABASE_NAME);
        

        return {
          type: 'postgres' as const,
          host,
          port,
          username,
          password,
          database,
          entities: [FilmEntityOrm, ScheduleEntityOrm],
          synchronize: TYPEORM_SYNCHRONIZE === 'true',
          logging: TYPEORM_LOGGING === 'true',
          retryAttempts: 20,
          retryDelay: 1000,
        };
      },
    }),

    TypeOrmModule.forFeature([FilmEntityOrm, ScheduleEntityOrm]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

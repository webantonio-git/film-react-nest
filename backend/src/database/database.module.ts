
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmEntityOrm } from '../films/entities/film.entity';
import { ScheduleEntityOrm } from '../films/entities/schedule.entity';

@Module({
  imports: [


    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const driver = process.env.DATABASE_DRIVER || 'postgres';

        const host = process.env.DATABASE_HOST;
        const port = Number(process.env.DATABASE_PORT ?? '5432');
        const username = process.env.DATABASE_USERNAME;
        const password = process.env.DATABASE_PASSWORD;
        const database = process.env.DATABASE_NAME;
        const url = process.env.DATABASE_URL;

        const synchronize = process.env.TYPEORM_SYNCHRONIZE === 'true';
        const logging = process.env.TYPEORM_LOGGING === 'true';

 
        if (url) {
          return {
            type: driver as 'postgres',
            url,
            entities: [FilmEntityOrm, ScheduleEntityOrm],
            synchronize,
            logging,
            retryAttempts: 20,
            retryDelay: 1000,
          };
        }

  
        if (!host || !username || !password || !database) {
          throw new Error('Database env vars are not set');
        }

        return {
          type: driver as 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [FilmEntityOrm, ScheduleEntityOrm],
          synchronize,
          logging,
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

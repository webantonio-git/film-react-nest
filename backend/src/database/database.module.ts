import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmEntityOrm } from '../films/entities/film.entity';
import { ScheduleEntityOrm } from '../films/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const driver =
          process.env.DATABASE_DRIVER ||
          process.env.TYPEORM_CONNECTION ||
          'postgres';

        // URL (например, DATABASE_URL или TYPEORM_URL)
        const url = process.env.DATABASE_URL || process.env.TYPEORM_URL;

        // Пытаемся собрать хост/порт/юзера/пароль из разных наборов переменных
        const host =
          process.env.DATABASE_HOST ||
          process.env.POSTGRES_HOST ||
          process.env.TYPEORM_HOST ||
          '127.0.0.1';

        const port = Number(
          process.env.DATABASE_PORT ||
            process.env.POSTGRES_PORT ||
            process.env.TYPEORM_PORT ||
            '5432',
        );

        const username =
          process.env.DATABASE_USERNAME ||
          process.env.POSTGRES_USER ||
          process.env.TYPEORM_USERNAME ||
          'postgres';

        const password =
          process.env.DATABASE_PASSWORD ||
          process.env.POSTGRES_PASSWORD ||
          process.env.TYPEORM_PASSWORD ||
          'postgres';

        const database =
          process.env.DATABASE_NAME ||
          process.env.POSTGRES_DB ||
          process.env.TYPEORM_DATABASE ||
          'postgres';

        const synchronize = process.env.TYPEORM_SYNCHRONIZE === 'true';
        const logging = process.env.TYPEORM_LOGGING === 'true';

        const hasFullCreds = host && username && password && database;

        // 1) Если есть нормальные отдельные переменные — используем их
        if (hasFullCreds) {
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
        }

        // 2) Иначе пробуем URL
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

        // 3) Если вообще ничего нет — явно падаем
        throw new Error('Database env vars are not set');
      },
    }),

    TypeOrmModule.forFeature([FilmEntityOrm, ScheduleEntityOrm]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

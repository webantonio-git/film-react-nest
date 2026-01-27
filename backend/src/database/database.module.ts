import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { FilmEntityOrm } from '../films/entities/film.entity';
import { ScheduleEntityOrm } from '../films/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const driver =
          config.get<string>('DATABASE_DRIVER') ||
          config.get<string>('TYPEORM_CONNECTION') ||
          'postgres';

        const url =
          config.get<string>('DATABASE_URL') ||
          config.get<string>('TYPEORM_URL');

        const host =
          // CI / docker-compose тестов
          config.get<string>('POSTGRES_HOST') ||
          // Локальный .env
          config.get<string>('DATABASE_HOST') ||
          config.get<string>('TYPEORM_HOST') ||
          '127.0.0.1';

        const port = Number(
          config.get<string>('POSTGRES_PORT') ||
            config.get<string>('DATABASE_PORT') ||
            config.get<string>('TYPEORM_PORT') ||
            '5432',
        );

        const username =
          config.get<string>('POSTGRES_USER') ||
          config.get<string>('DATABASE_USERNAME') ||
          config.get<string>('TYPEORM_USERNAME') ||
          'postgres';

        const password =
          config.get<string>('POSTGRES_PASSWORD') ||
          config.get<string>('DATABASE_PASSWORD') ||
          config.get<string>('TYPEORM_PASSWORD') ||
          'postgres';

        const database =
          config.get<string>('POSTGRES_DB') ||
          config.get<string>('DATABASE_NAME') ||
          config.get<string>('TYPEORM_DATABASE') ||
          'postgres';

        // --- ВАЖНО: отличаем локалку от CI --- //
        const isCI =
          process.env.GITHUB_ACTIONS === 'true' ||
          process.env.CI === 'true';

        // Локалка -> управляем через .env (TYPEORM_SYNCHRONIZE)
        // CI      -> форсим true, чтобы создались таблицы
        const synchronize =
          isCI || config.get<string>('TYPEORM_SYNCHRONIZE') === 'true';

        const logging = config.get<string>('TYPEORM_LOGGING') === 'true';

        const hasFullCreds = host && username && password && database;

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

        throw new Error('Database env vars are not set');
      },
    }),

    TypeOrmModule.forFeature([FilmEntityOrm, ScheduleEntityOrm]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

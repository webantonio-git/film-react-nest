import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmEntityOrm } from '../films/entities/film.entity';
import { ScheduleEntityOrm } from '../films/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const {
          // общий драйвер
          DATABASE_DRIVER = 'postgres',

          // вариант с url (если вдруг Tests/CI используют DATABASE_URL)
          DATABASE_URL,

          // твой локальный .env (DATABASE_*)
          DATABASE_HOST,
          DATABASE_PORT,
          DATABASE_USERNAME,
          DATABASE_PASSWORD,
          DATABASE_NAME,

          // то, что часто используют в docker-compose (POSTGRES_*)
          POSTGRES_HOST,
          POSTGRES_PORT,
          POSTGRES_USER,
          POSTGRES_PASSWORD,
          POSTGRES_DB,

          TYPEORM_SYNCHRONIZE,
          TYPEORM_LOGGING,
        } = process.env;

        // 1) если есть DATABASE_URL — используем его
        if (DATABASE_URL) {
          return {
            type: DATABASE_DRIVER as 'postgres',
            url: DATABASE_URL,
            entities: [FilmEntityOrm, ScheduleEntityOrm],
            synchronize: TYPEORM_SYNCHRONIZE === 'true',
            logging: TYPEORM_LOGGING === 'true',
            retryAttempts: 20,
            retryDelay: 1000,
          };
        }

        // 2) Пытаемся собрать креды по отдельности:
        //    сначала DATABASE_*, если их нет — POSTGRES_*
        const host = DATABASE_HOST || POSTGRES_HOST;
        const port = DATABASE_PORT || POSTGRES_PORT;
        const username = DATABASE_USERNAME || POSTGRES_USER;
        const password = DATABASE_PASSWORD || POSTGRES_PASSWORD;
        const database = DATABASE_NAME || POSTGRES_DB;

        // 3) Проверка, что всё нужное есть.
        const missing: string[] = [];
        if (!host) missing.push('DATABASE_HOST или POSTGRES_HOST');
        if (!port) missing.push('DATABASE_PORT или POSTGRES_PORT');
        if (!username) missing.push('DATABASE_USERNAME или POSTGRES_USER');
        if (!password) missing.push('DATABASE_PASSWORD или POSTGRES_PASSWORD');
        if (!database) missing.push('DATABASE_NAME или POSTGRES_DB');

        if (missing.length > 0) {
          throw new Error(
            `Database env vars are not set: ${missing.join(', ')}`,
          );
        }

        return {
          type: DATABASE_DRIVER as 'postgres',
          host,
          port: Number(port),
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

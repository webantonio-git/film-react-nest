import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmEntityOrm } from '../films/entities/film.entity';
import { ScheduleEntityOrm } from '../films/entities/schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath можно вообще не указывать — он возьмёт process.env,
      // которое тесты уже наполнят своим .env
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // без дефолтов для секретов
        const host = config.get<string>('DATABASE_HOST');
        const port = config.get<number>('DATABASE_PORT') ?? 5432;
        const username = config.get<string>('DATABASE_USERNAME');
        const password = config.get<string>('DATABASE_PASSWORD');
        const database = config.get<string>('DATABASE_NAME');

        if (!host || !username || !password || !database) {
          throw new Error('Database env vars are not set');
        }

        return {
          type: 'postgres' as const,
          host,
          port,
          username,
          password,
          database,
          entities: [FilmEntityOrm, ScheduleEntityOrm],
          synchronize: config.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
          logging: config.get<string>('TYPEORM_LOGGING') === 'true',
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

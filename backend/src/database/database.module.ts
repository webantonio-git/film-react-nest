import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmEntityOrm } from '../films/entities/film.entity';
import { ScheduleEntityOrm } from '../films/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('DATABASE_HOST');
        const port = config.get<number>('DATABASE_PORT', 5432); // тут можно оставить не-секретный дефолт
        const username = config.get<string>('DATABASE_USERNAME');
        const password = config.get<string>('DATABASE_PASSWORD');
        const database = config.get<string>('DATABASE_NAME');
        const synchronize = config.get<string>('TYPEORM_SYNCHRONIZE') === 'true';
        const logging = config.get<string>('TYPEORM_LOGGING') === 'true';

   
        return {
          type: 'postgres' as const,
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

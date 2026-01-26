import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmEntityOrm } from '../films/entities/film.entity';
import { ScheduleEntityOrm } from '../films/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host =
          configService.get<string>('DATABASE_HOST') ?? 'localhost';
        const port =
          Number(configService.get<string>('DATABASE_PORT') );
        const username =
          configService.get<string>('DATABASE_USERNAME') ;
        const password =
          configService.get<string>('DATABASE_PASSWORD') ;
        const database =
          configService.get<string>('DATABASE_NAME') ?? 'films';

        return {
          type: 'postgres' as const,
          host,
          port,
          username,
          password,
          database,

          entities: [FilmEntityOrm, ScheduleEntityOrm],

          synchronize:
            configService.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
          logging:
            configService.get<string>('TYPEORM_LOGGING') === 'true',

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

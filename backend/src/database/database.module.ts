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
        const url = configService.get<string>('DATABASE_URL') || undefined;

        return {
          type: 'postgres',
          ...(url ? { url } : {}),
          host: configService.get<string>('DATABASE_HOST', '127.0.0.1'),
          port: Number(configService.get<string>('DATABASE_PORT', '5432')),
          username: configService.get<string>('DATABASE_USERNAME', 'prac'),
          password: configService.get<string>('DATABASE_PASSWORD', 'student'),
          database: configService.get<string>('DATABASE_NAME', 'prac'),

          entities: [FilmEntityOrm, ScheduleEntityOrm],

          synchronize: configService.get<string>('TYPEORM_SYNCHRONIZE', 'false') === 'true',
          logging: configService.get<string>('TYPEORM_LOGGING', 'false') === 'true',
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

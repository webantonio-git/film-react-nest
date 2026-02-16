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
        };
      },
    }),

    TypeOrmModule.forFeature([FilmEntityOrm, ScheduleEntityOrm]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

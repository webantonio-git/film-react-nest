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
        const url = configService.get<string>('DATABASE_URL');

        return {
          type: 'postgres',

          ...(url
            ? { url }
            : {
                host: configService.getOrThrow<string>('DATABASE_HOST'),
                port: Number(configService.getOrThrow<string>('DATABASE_PORT')),
                username: configService.getOrThrow<string>('DATABASE_USERNAME'),
                password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
                database: configService.getOrThrow<string>('DATABASE_NAME'),
              }),

          entities: [FilmEntityOrm, ScheduleEntityOrm],

          synchronize: configService.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
          logging: configService.get<string>('TYPEORM_LOGGING') === 'true',

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

import * as path from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { FilmsController } from './films/films.controller';
import { FilmsRepository } from './films/films.repository';
import { FilmsService } from './films/films.service';
import { Film, FilmSchema } from './films/shemas/film.shema';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL') ?? 'mongodb://127.0.0.1:27017/prac',
      }),
    }),

    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),

    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [FilmsRepository, FilmsService, OrderService],
})
export class AppModule {}

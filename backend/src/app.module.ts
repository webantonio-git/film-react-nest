import * as path from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { DatabaseModule } from './database/database.module';
import { FilmsController } from './films/films.controller';
import { FilmsRepository } from './films/films.repository';
import { FilmsService } from './films/films.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    DatabaseModule,

    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [FilmsRepository, FilmsService, OrderService],
})
export class AppModule {}

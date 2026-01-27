import { ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<string>('DATABASE_DRIVER'),

      host: configService.get<string>('DATABASE_HOST'),
      port: Number(configService.get<string>('DATABASE_PORT')),
      name: configService.get<string>('DATABASE_NAME'),
      username: configService.get<string>('DATABASE_USERNAME'),
      password: configService.get<string>('DATABASE_PASSWORD'),

      url: configService.get<string>('DATABASE_URL'),
    },
  }),
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  host: string;
  port: number;
  name: string;
  username: string;
  password: string;
  url?: string;
}

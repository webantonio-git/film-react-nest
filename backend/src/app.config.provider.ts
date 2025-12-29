import { ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<string>('DATABASE_DRIVER', 'postgres'),

      host: configService.get<string>('DATABASE_HOST', '127.0.0.1'),
      port: Number(configService.get<string>('DATABASE_PORT', '5432')),
      name: configService.get<string>('DATABASE_NAME', 'prac'),
      username: configService.get<string>('DATABASE_USERNAME', 'prac'),
      password: configService.get<string>('DATABASE_PASSWORD', 'student'),

      url: configService.get<string>('DATABASE_URL', ''),
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

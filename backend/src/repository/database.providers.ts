import * as mongoose from 'mongoose';

import { AppConfig } from '../app.config.provider';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    inject: ['CONFIG'],
    useFactory: async (config: AppConfig): Promise<mongoose.Connection> => {
      const url =
        config.database?.url ||
        process.env.DATABASE_URL ||
        'mongodb://127.0.0.1:27017/prac';

      mongoose.set('strictQuery', true);
      await mongoose.connect(url);

      return mongoose.connection;
    },
  },
];

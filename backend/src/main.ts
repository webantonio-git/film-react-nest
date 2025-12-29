import 'dotenv/config';

import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const g = globalThis as unknown as { crypto?: unknown };

  if (!g.crypto) {
    const nodeCrypto = await import('node:crypto');
    g.crypto = nodeCrypto.webcrypto as unknown;
  }

  const { AppModule } = await import('./app.module');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  await app.listen(3000);
}

bootstrap();

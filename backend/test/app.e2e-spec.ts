import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api/afisha');

    await app.init();
  });

  it('/api/afisha/films/ (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/api/afisha/films/').expect(200);

    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.total).toBe(res.body.items.length);
  });

  afterAll(async () => {
    await app.close();
  });
});

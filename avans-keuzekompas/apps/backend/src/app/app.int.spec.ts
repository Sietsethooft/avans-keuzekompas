import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('App integration (lightweight)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = modRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api (happy)', async () => {
    await request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect({ message: 'Hello and welcome to the Avans Keuzekompas API!' });
  });

  it('GET /api/unknown (unhappy)', async () => {
    await request(app.getHttpServer())
      .get('/api/unknown')
      .expect(404);
  });
});
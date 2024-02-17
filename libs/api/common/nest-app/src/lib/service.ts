import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { LoggerAdapterService } from '@nuko/api/common/logger';

export async function startService(
  _name: string,
  module: unknown,
): Promise<INestApplication> {
  const app = await NestFactory.create(module, new FastifyAdapter(), {
    bufferLogs: true,
    rawBody: true,
  });

  app.useLogger(app.get(LoggerAdapterService));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  await app.listen(process.env['PORT'] ?? 80, '0.0.0.0');

  return app;
}

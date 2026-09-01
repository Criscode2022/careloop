import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { store } from './common/store';
async function bootstrap() {
  await store.seedDemo();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: (process.env.CORS_ORIGIN || 'http://localhost:4200').split(','), credentials: true });
  const port = Number(process.env.PORT || 3000);
  await app.listen(port);
  console.log(`CareLoop API listening on ${port}`);
}
bootstrap();

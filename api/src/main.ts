import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
  console.log(`✅ Hub API listening on port ${process.env.PORT ?? 3000}`);
}

bootstrap().catch((error) => {
  console.error('Error during application startup:', error);
  process.exit(1);
});

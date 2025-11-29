import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  const workerId = process.env.WORKER_ID || process.pid;
  console.log(`✅ Hub Command Worker [${workerId}] started on port ${port}`);
  console.log(`🔍 Health check: http://localhost:${port}`);
  console.log(`📡 Consuming messages in PUB/SUB mode (broadcast)`);
  console.log(`📌 Listening to: hub.command.*`);
}
bootstrap().catch((error) => {
  console.error('Error during worker startup:', error);
  process.exit(1);
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  const port = process.env.PORT || 3003;
  await app.listen(port);

  const workerId = process.env.WORKER_ID || process.pid;
  console.log(`✅ Hub Event Worker [${workerId}] started on port ${port}`);
  console.log(`🔍 Health check: http://localhost:${port}`);
  console.log(`📡 Consuming messages in PUB/SUB mode (broadcast)`);
  console.log(`📌 Listening to: hub.event.*`);
}
bootstrap().catch((error) => {
  console.error('Error during worker startup:', error);
  process.exit(1);
});

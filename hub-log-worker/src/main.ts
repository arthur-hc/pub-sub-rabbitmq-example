import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  const port = process.env.PORT || 3004;
  await app.listen(port);

  const workerId = process.env.WORKER_ID || process.pid;
  console.log(`✅ Hub Log Worker [${workerId}] started on port ${port}`);
  console.log(`🔍 Health check: http://localhost:${port}`);
  console.log(`📡 Consuming messages in PUB/SUB mode (broadcast)`);
  console.log(`📌 Listening to: # (ALL MESSAGES)`);
}
bootstrap().catch((error) => {
  console.error('Error during worker startup:', error);
  process.exit(1);
});

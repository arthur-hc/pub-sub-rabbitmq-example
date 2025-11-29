import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HUB_SERVICE } from './rabbitmq.constants';
import { RabbitMQPubSubService } from './rabbitmq-pubsub.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: HUB_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
          ],
          exchange: process.env.EXCHANGE_NAME || 'hub',
          exchangeType: process.env.EXCHANGE_TYPE || 'topic',
          persistent: true,
        },
      },
    ]),
  ],
  providers: [RabbitMQPubSubService],
  exports: [ClientsModule, RabbitMQPubSubService],
})
export class RabbitMQModule {}

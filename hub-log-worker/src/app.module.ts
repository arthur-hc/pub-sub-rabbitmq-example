import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  RabbitMQPubSubService,
  PubSubConsumerOptions,
} from './rabbitmq-pubsub.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot({ wildcard: true, delimiter: '.' }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'PUBSUB_OPTIONS',
      useValue: {
        exchange: process.env.EXCHANGE_NAME || 'hub',
        exchangeType: process.env.EXCHANGE_TYPE || 'topic',
        queuePrefix: process.env.QUEUE_NAME || 'hub-log',
        routingKeys: ['#'],
      } as PubSubConsumerOptions,
    },
    RabbitMQPubSubService,
  ],
})
export class AppModule {}

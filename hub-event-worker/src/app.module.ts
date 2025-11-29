import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  RabbitMQPubSubConsumer,
  PubSubConsumerOptions,
} from './rabbitmq-pubsub.consumer';

@Module({
  imports: [ConfigModule.forRoot(), EventEmitterModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'PUBSUB_OPTIONS',
      useValue: {
        exchange: process.env.EXCHANGE_NAME || 'hub',
        exchangeType: process.env.EXCHANGE_TYPE || 'topic',
        queuePrefix: process.env.QUEUE_NAME || 'hub-event',
        routingKeys: ['hub.event.*', 'hub.command.insert'],
      } as PubSubConsumerOptions,
    },
    RabbitMQPubSubConsumer,
  ],
})
export class AppModule {}

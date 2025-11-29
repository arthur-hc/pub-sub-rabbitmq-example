import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import type { ChannelWrapper } from 'amqp-connection-manager';
import type { ConfirmChannel } from 'amqplib';

@Injectable()
export class RabbitMQPublisher implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQPublisher.name);
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;

  private readonly url =
    process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
  private readonly exchange = process.env.EXCHANGE_NAME || 'hub';
  private readonly exchangeType = process.env.EXCHANGE_TYPE || 'topic';

  onModuleInit() {
    this.connection = amqp.connect([this.url]);

    this.connection.on('connect', () => {
      this.logger.log('✅ Connected to RabbitMQ');
    });

    this.connection.on('disconnect', (err) => {
      this.logger.error('❌ Disconnected from RabbitMQ', err);
    });

    this.channelWrapper = this.connection.createChannel({
      json: false,
      setup: async (channel: ConfirmChannel) => {
        await channel.assertExchange(this.exchange, this.exchangeType, {
          durable: true,
        });
        this.logger.log(
          `✅ Exchange "${this.exchange}" (${this.exchangeType}) is ready`,
        );
      },
    });
  }

  async onModuleDestroy() {
    await this.channelWrapper.close();
    await this.connection.close();
    this.logger.log('🔌 RabbitMQ connection closed');
  }

  async publish(routingKey: string, payload: unknown): Promise<void> {
    try {
      const envelope = {
        pattern: routingKey,
        data: payload,
      };
      const message = JSON.stringify(envelope);

      await this.channelWrapper.publish(
        this.exchange,
        routingKey,
        Buffer.from(message),
        {
          persistent: true,
          contentType: 'application/json',
        },
      );
      this.logger.log(
        `📤 Published to exchange="${this.exchange}" routingKey="${routingKey}"`,
      );
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`❌ Failed to publish message: ${error.message}`);
      }

      throw new InternalServerErrorException('Failed to publish message');
    }
  }
}

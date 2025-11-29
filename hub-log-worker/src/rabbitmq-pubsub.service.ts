import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage } from 'amqplib';

// Workaround for EventEmitter2 type resolution issue with moduleResolution: nodenext
interface IEventEmitter {
  emitAsync(event: string, ...args: unknown[]): Promise<unknown[]>;
}

export interface PubSubConsumerOptions {
  exchange: string;
  exchangeType: string;
  queuePrefix: string;
  routingKeys: string[];
}

interface MessageEnvelope {
  pattern: string;
  data: unknown;
}

@Injectable()
export class RabbitMQPubSubService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQPubSubService.name);
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;
  private queueName: string;

  constructor(
    @Inject('PUBSUB_OPTIONS') private readonly options: PubSubConsumerOptions,
    @Inject('EventEmitter2') private readonly eventEmitter: IEventEmitter,
  ) {}

  onModuleInit() {
    const workerId = process.env.WORKER_ID || `${process.pid}`;
    this.queueName = `${this.options.queuePrefix}-${workerId}`;

    this.connection = amqp.connect([
      process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
    ]);

    this.connection.on('connect', () => {
      this.logger.log('✅ Connected to RabbitMQ');
    });

    this.connection.on('disconnect', (err) => {
      this.logger.error('❌ Disconnected from RabbitMQ', err?.err?.message);
    });

    this.channelWrapper = this.connection.createChannel({
      json: false,
      setup: async (channel: ConfirmChannel) => {
        await channel.assertExchange(
          this.options.exchange,
          this.options.exchangeType,
          { durable: true },
        );
        this.logger.log(
          `✅ Exchange "${this.options.exchange}" (${this.options.exchangeType}) ready`,
        );

        await channel.assertQueue(this.queueName, {
          exclusive: true,
          autoDelete: true,
          durable: false,
        });
        this.logger.log(`✅ Exclusive queue "${this.queueName}" created`);

        for (const routingKey of this.options.routingKeys) {
          await channel.bindQueue(
            this.queueName,
            this.options.exchange,
            routingKey,
          );
          this.logger.log(
            `🔗 Bound queue to exchange with routingKey="${routingKey}"`,
          );
        }

        await channel.consume(
          this.queueName,
          (msg: ConsumeMessage | null) => {
            void this.handleMessage(msg, channel);
          },
          { noAck: false },
        );

        this.logger.log(
          `✅ Worker [${workerId}] consuming messages in PUB/SUB mode`,
        );
      },
    });
  }

  async publish(routingKey: string, payload: unknown): Promise<void> {
    try {
      const envelope = {
        pattern: routingKey,
        data: payload,
      };
      const message = JSON.stringify(envelope);

      await this.channelWrapper.publish(
        this.options.exchange,
        routingKey,
        Buffer.from(message),
        {
          persistent: true,
          contentType: 'application/json',
        },
      );
      this.logger.log(
        `📤 Published to exchange="${this.options.exchange}" routingKey="${routingKey}"`,
      );
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`❌ Failed to publish message: ${error.message}`);
      }

      throw new InternalServerErrorException('❌ Failed to publish message');
    }
  }

  private async handleMessage(
    msg: ConsumeMessage | null,
    channel: ConfirmChannel,
  ): Promise<void> {
    if (!msg) return;

    const routingKey = msg.fields.routingKey;
    const content = msg.content.toString();

    try {
      const envelope: MessageEnvelope = JSON.parse(content) as MessageEnvelope;
      const { pattern, data } = envelope;

      this.logger.log(
        `📥 Received: routingKey="${routingKey}" pattern="${pattern}"`,
      );

      await this.eventEmitter.emitAsync(pattern, data);

      channel.ack(msg);
      this.logger.debug(`✅ Message acknowledged: pattern="${pattern}"`);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`❌ Failed to process message: ${error.message}`);
      }
      channel.nack(msg, false, false);
    }
  }

  async onModuleDestroy() {
    await this.channelWrapper?.close();
    await this.connection?.close();
    this.logger.log('🔌 Disconnected from RabbitMQ');
  }
}

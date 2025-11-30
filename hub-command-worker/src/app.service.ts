import { Injectable } from '@nestjs/common';
import { RabbitMQPubSubService } from './rabbitmq-pubsub.service';

@Injectable()
export class AppService {
  constructor(private readonly publisher: RabbitMQPubSubService) {}

  async handleInsertPubSub(data: unknown): Promise<void> {
    console.log('🎉 [PUB/SUB] Insert command received:', data);
    await this.publisher.publish('hub.event.user-created', data);
  }

  handleDeletePubSub(data: unknown): void {
    console.log('🎉 [PUB/SUB] Delete command received:', data);
  }
}

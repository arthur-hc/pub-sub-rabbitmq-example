import { Injectable } from '@nestjs/common';
import { RabbitMQPublisher } from './rabbit/rabbitmq.publisher';

@Injectable()
export class AppService {
  constructor(private readonly publisher: RabbitMQPublisher) {}

  async insert(payload: unknown) {
    console.log('📤 Publishing event: hub.command.insert');
    await this.publisher.publish('hub.command.insert', payload);
    console.log('✅ Event published: hub.command.insert');
  }

  async delete(id: string) {
    console.log('📤 Publishing event: hub.command.delete');
    await this.publisher.publish('hub.command.delete', { id });
    console.log('✅ Event published: hub.command.delete');
  }
}

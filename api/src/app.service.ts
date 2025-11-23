import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(@Inject('HUB_SERVICE') private readonly client: ClientProxy) {}

  getHealthStatus(): string {
    return 'OK';
  }

  async insert(data: any) {
    await lastValueFrom(this.client.emit('hub.command.insert', data));
    console.log('Message sent to hub.command.insert:', data);
  }

  async delete(id: string) {
    await lastValueFrom(this.client.emit('hub.command.delete', { id }));
    console.log('Message sent to hub.command.delete:', { id });
  }
}

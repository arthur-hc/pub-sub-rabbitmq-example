import { Controller, Get } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  healthCheck(): { status: string; service: string } {
    return { status: 'ok', service: 'hub-log-worker' };
  }

  @OnEvent('hub.command.insert')
  logCommandInsert(data: unknown): void {
    this.appService.logMessage('hub.command.insert', data);
  }

  @OnEvent('hub.command.delete')
  logCommandDelete(data: unknown): void {
    this.appService.logMessage('hub.command.delete', data);
  }

  @OnEvent('hub.event.notify')
  logEventNotify(data: unknown): void {
    this.appService.logMessage('hub.event.notify', data);
  }

  @OnEvent('hub.event.user.created')
  logEventUserCreated(data: unknown): void {
    this.appService.logMessage('hub.event.user.created', data);
  }
}

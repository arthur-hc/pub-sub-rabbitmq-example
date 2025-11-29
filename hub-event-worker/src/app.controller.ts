import { Controller, Get } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  healthCheck(): { status: string; service: string } {
    return { status: 'ok', service: 'hub-event-worker' };
  }

  @OnEvent('hub.event.notify')
  handleEventNotify(data: unknown): void {
    this.appService.handleEventNotify(data);
  }

  @OnEvent('hub.event.user.created')
  handleEventUserCreated(data: unknown): void {
    this.appService.handleEventUserCreated(data);
  }

  @OnEvent('hub.command.insert')
  handleCommandInsert(data: unknown): void {
    this.appService.handleCommandInsert(data);
  }
}

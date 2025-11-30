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

  @OnEvent('**')
  logCommandInsert(param: { pattern: string; data: unknown }): void {
    const { pattern, data } = param;
    this.appService.logMessage(pattern, data);
  }
}

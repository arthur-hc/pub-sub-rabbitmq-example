import { Controller, Get } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  healthCheck(): { status: string; service: string } {
    return { status: 'ok', service: 'hub-command-worker' };
  }

  @OnEvent('hub.command.insert')
  async handleInsert(data: unknown): Promise<void> {
    await this.appService.handleInsertPubSub(data);
  }

  @OnEvent('hub.command.delete')
  handleDelete(data: unknown): void {
    this.appService.handleDeletePubSub(data);
  }
}

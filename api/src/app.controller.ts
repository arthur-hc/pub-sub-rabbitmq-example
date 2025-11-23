import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  healthCheck(): string {
    return this.appService.getHealthStatus();
  }

  @Post()
  async insert(@Body() data: any) {
    await this.appService.insert(data);
    return { status: 'Mensage published: hub.command.insert' };
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.appService.delete(id);
    return { status: 'Mensage published: hub.command.delete' };
  }
}

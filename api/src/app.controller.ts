import { Controller, Post, Body, Delete } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('hub')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('')
  async insert(@Body() body: unknown) {
    await this.appService.insert(body);
    return { ok: true };
  }

  @Delete('/:id')
  async delete(@Body('id') id: string) {
    await this.appService.delete(id);
    return { ok: true };
  }
}

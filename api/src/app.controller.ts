import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('hub')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('insert')
  async insert(@Body() body: unknown) {
    await this.appService.insert(body);
    return { ok: true };
  }

  @Post('delete')
  async delete(@Body('id') id: string) {
    await this.appService.delete(id);
    return { ok: true };
  }
}

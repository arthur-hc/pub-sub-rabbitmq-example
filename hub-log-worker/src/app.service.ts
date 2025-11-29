import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  logMessage(pattern: string, data: unknown): void {
    const timestamp = new Date().toISOString();
    console.log(
      `📝 [LOG] [${timestamp}] pattern="${pattern}" data:`,
      JSON.stringify(data),
    );
  }
}

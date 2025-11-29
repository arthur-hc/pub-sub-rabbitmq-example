import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  handleEventNotify(data: unknown): void {
    console.log('[EVENT] Notify event received:', data);
  }

  handleEventUserCreated(data: unknown): void {
    console.log('[EVENT] User created event received:', data);
  }

  handleCommandInsert(data: unknown): void {
    console.log('[EVENT-WORKER] Also processing insert command:', data);
  }
}

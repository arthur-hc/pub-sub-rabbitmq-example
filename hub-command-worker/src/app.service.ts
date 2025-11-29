import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  handleInsertPubSub(data: unknown): void {
    console.log('🎉 [PUB/SUB] Insert command received:', data);
  }

  handleDeletePubSub(data: unknown): void {
    console.log('🎉 [PUB/SUB] Delete command received:', data);
  }
}

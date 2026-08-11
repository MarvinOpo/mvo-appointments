import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class QueueStaffGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    const data = context.switchToWs().getData();
    const user = client.data.user;

    if (!user || !user.access?.can_manage_queue) {
      throw new WsException('You dont seem to have access to this feature.');
    }

    return true;
  }
}

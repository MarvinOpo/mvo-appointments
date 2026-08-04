import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*', credentials: true }, // tighten this in prod
  namespace: '/queue',
})
export class QueueGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinQueue')
  handleJoin(@MessageBody() data: { step: number; deptId: string }, client) {
    const room = `queue:${data.deptId}:${data.step}`;
    client.join(room);
  }

  @SubscribeMessage('leaveQueue')
  handleLeave(@MessageBody() data: { step: number; deptId: string }, client) {
    const room = `queue:${data.deptId}:${data.step}`;
    client.leave(room);
  }

  emitQueueUpdate(dept_id: string, step: number, payload: any) {
    this.server.to(`queue:${dept_id}:${step}`).emit('queue:update', payload);
  }
}

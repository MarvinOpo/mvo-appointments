import { Req, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from 'src/auth/auth.guard';
import { QueueStaffGuard } from './queue.guard';
import { QueueService } from './queue.service';
import {
  SocketApptDataDto,
  SocketDataDto,
  SocketDoctorDataDto,
  SocketStatDataDto,
} from './dto/socket-data.dto';

import { AppointmentsService } from 'src/appointments/appointments.service';

import dayjs from 'dayjs';
import { UserDto } from 'src/users/dto/user.dto';

@WebSocketGateway({
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (process.env.NODE_ENV !== 'production') return callback(null, true);
      if (origin === process.env.FRONTEND_URL) return callback(null, true);
      callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
  },
  namespace: '/queue',
})
export class QueueGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly queueService: QueueService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  @UseGuards(WsAuthGuard, QueueStaffGuard)
  @SubscribeMessage('queue:updateDoctorCount')
  async handleDoctorCount(@MessageBody() data: SocketDoctorDataDto) {
    const room = `queue:${data.deptId}:1`;
    const room2 = `queue:${data.deptId}:2`;
    const room3 = `queue:${data.deptId}:3`;

    const session = await this.queueService.updateDoctorCount(
      data.sessionId,
      data.doctorsOnDuty,
    );

    this.emitQueueUpdate(room, { action: 'updateDoctorCount', session });
    this.emitQueueUpdate(room2, { action: 'updateDoctorCount', session });
    this.emitQueueUpdate(room3, { action: 'updateDoctorCount', session });
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('joinQueue')
  handleJoin(
    @MessageBody() data: SocketDataDto,
    @ConnectedSocket() client: Socket,
  ) {
    const room = `queue:${data.deptId}:${data.step}`;
    client.join(room);
  }

  @SubscribeMessage('leaveQueue')
  handleLeave(
    @MessageBody() data: SocketDataDto,
    @ConnectedSocket() client: Socket,
  ) {
    const room = `queue:${data.deptId}:${data.step}`;
    client.leave(room);
  }

  @UseGuards(WsAuthGuard, QueueStaffGuard)
  @SubscribeMessage('queue:callComplete')
  async handleComplete(
    @MessageBody() data: SocketApptDataDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user as UserDto;

    const room = `queue:${data.deptId}:${data.step}`;
    const room2 = `queue:${data.deptId}:${data.step + 1}`;

    const updatedStat = await this.queueService.callComplete(
      data.statId,
      data.payload,
    );

    const appointment = await this.appointmentsService.updateStep(
      data.appointmentId,
      data.step,
    );

    const start = dayjs(appointment.scheduled_at)
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss');
    const end = dayjs(appointment.scheduled_at)
      .endOf('day')
      .format('YYYY-MM-DD HH:mm:ss');

    const updatedQueue = await this.appointmentsService.findScheduled(
      data.deptId,
      start,
      end,
      user,
    );

    this.emitQueueUpdate(room, {
      action: 'callComplete',
      stat: updatedStat,
      queue: updatedQueue,
    });

    this.emitQueueUpdate(room2, {
      action: 'callComplete',
      stat: updatedStat,
      queue: updatedQueue,
    });

    return { success: true };
  }

  @UseGuards(WsAuthGuard, QueueStaffGuard)
  @SubscribeMessage('queue:callSkip')
  async handleSkip(
    @MessageBody() data: SocketStatDataDto,
    @ConnectedSocket() client: Socket,
  ) {
    const room = `queue:${data.deptId}:${data.step}`;
    const updatedStat = await this.queueService.callSkip(
      data.statId,
      data.payload,
    );
    const user = client.data.user as UserDto;

    const start = dayjs(updatedStat.session.session_date)
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss');
    const end = dayjs(updatedStat.session.session_date)
      .endOf('day')
      .format('YYYY-MM-DD HH:mm:ss');

    const updatedQueue = await this.appointmentsService.findScheduled(
      data.deptId,
      start,
      end,
      user,
    );

    this.emitQueueUpdate(room, {
      action: 'callSkip',
      stat: updatedStat,
      queue: updatedQueue,
    });

    return { success: true };
  }

  emitQueueUpdate(room: string, payload: any) {
    this.server.to(room).emit('queue:update', payload);
  }
}

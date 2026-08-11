import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { QueueGateway } from './queue.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { AppointmentsModule } from 'src/appointments/appointments.module'; // needed for AppointmentService

@Module({
  imports: [AuthModule, AppointmentsModule],
  controllers: [QueueController],
  providers: [QueueService, QueueGateway],
})
export class QueueModule {}

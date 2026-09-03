import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { DependentsModule } from './dependents/dependents.module';
import { PatientsModule } from './patients/patients.module';
import { DepartmentsModule } from './departments/departments.module';
import { AiAssistantModule } from './ai-assistant/ai-assistant.module';
import { DepartmentScheduleModule } from './department-schedule/department-schedule.module';
import { QueueModule } from './queue/queue.module';
import { HolidaysModule } from './holidays/holidays.module';
import { UserAccessModule } from './user-access/user-access.module';
import { MonitorsModule } from './monitors/monitors.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AppointmentsModule,
    DependentsModule,
    PatientsModule,
    DepartmentsModule,
    AiAssistantModule,
    DepartmentScheduleModule,
    QueueModule,
    HolidaysModule,
    UserAccessModule,
    MonitorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

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

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AppointmentsModule,
    DependentsModule,
    PatientsModule,
    DepartmentsModule,
    AiAssistantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { DepartmentScheduleService } from './department-schedule.service';
import { DepartmentScheduleController } from './department-schedule.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DepartmentScheduleController],
  providers: [DepartmentScheduleService],
})
export class DepartmentScheduleModule {}

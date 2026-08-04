import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentScheduleDto } from './create-department-schedule.dto';

export class UpdateDepartmentScheduleDto extends PartialType(CreateDepartmentScheduleDto) {}

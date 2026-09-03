import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsBoolean, IsEnum, IsIn, IsOptional, IsString } from 'class-validator';

import { PriorityType } from '../../../prisma-appointments/client/client';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsString()
  @IsOptional()
  remarks?: string;

  @IsEnum(PriorityType)
  @IsOptional()
  priority?: PriorityType;
}

export class UpdateAppointmentSoapDto {
  @IsString()
  subjective: string;

  @IsString()
  objective: string;

  @IsString()
  assessment: string;

  @IsString()
  plan: string;

  @IsBoolean()
  ai_soap_assisted: boolean;
}

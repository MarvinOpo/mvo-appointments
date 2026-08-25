import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsString()
  @IsOptional()
  remarks?: string;
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

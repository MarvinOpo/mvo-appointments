import { PartialType } from '@nestjs/mapped-types';
import { CreateQueueDto } from './create-queue.dto';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateQueueDto extends PartialType(CreateQueueDto) {}
export class UpdateQueueStatDto {
  @IsOptional()
  @IsInt()
  skipped_appointment_id?: number | null;

  @IsInt()
  now_serving?: number;

  @IsNotEmpty()
  @IsString()
  served_sched: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  duration?: number;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateQueueDto } from './create-queue.dto';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class UpdateQueueDto extends PartialType(CreateQueueDto) {}
export class UpdateQueueStatDto {
  @IsOptional()
  @IsInt()
  skipped_appointment_id?: number | null;

  @IsInt()
  now_serving?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  duration?: number;
}

import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateQueueStatDto } from './update-queue.dto';
import { Type } from 'class-transformer';

export class SocketDataDto {
  @IsNumber()
  @IsIn([1, 2, 3])
  step: number;

  @IsNumber()
  deptId: number;
}

export class SocketStatDataDto extends SocketDataDto {
  @IsNumber()
  statId: number;

  @ValidateNested()
  @Type(() => UpdateQueueStatDto)
  @IsNotEmpty()
  payload: UpdateQueueStatDto;
}

export class SocketApptDataDto extends SocketStatDataDto {
  @IsNumber()
  appointmentId: number;
}

export class SocketDoctorDataDto extends SocketDataDto {
  @IsInt()
  doctorsOnDuty: number;

  @IsInt()
  sessionId: number;
}

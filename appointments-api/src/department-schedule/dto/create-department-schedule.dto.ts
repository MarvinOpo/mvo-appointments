// create-department-schedule.dto.ts
import { Type } from 'class-transformer';
import {
  IsInt,
  IsArray,
  ArrayNotEmpty,
  IsString,
  IsNotEmpty,
  Matches,
  IsIn,
} from 'class-validator';

export class CreateDepartmentScheduleDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsIn(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], { each: true })
  days: string[];

  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'start must be in HH:mm format',
  })
  start: string;

  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'end must be in HH:mm format',
  })
  end: string;

  @Type(() => Number)
  @IsInt()
  pax: number;

  @IsString()
  @IsIn(['T', 'F'])
  type: string;
}

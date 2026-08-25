import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import dayjs from 'dayjs';

export class CreateAppointmentDto {
  @IsInt()
  user_id: number;

  @IsInt()
  patient_id: number;

  @IsInt()
  department_id: number;

  @Transform(({ value }) => {
    if (typeof value !== 'string') return undefined;

    const parsed = dayjs(
      value,
      ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DDTHH:mm:ssZ'],
      true,
    );
    return parsed.isValid() ? parsed.toISOString() : undefined;
  })
  @IsDateString()
  scheduled_at: string;

  @IsNotEmpty()
  complaint: string;

  @IsNotEmpty()
  @IsIn(['T', 'F'])
  type: string;

  @IsBoolean()
  ai_dept_matched: boolean;
}

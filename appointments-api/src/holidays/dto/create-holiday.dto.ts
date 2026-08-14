import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export class CreateHolidayDto {
  @Transform(({ value }) => {
    if (typeof value !== 'string') return undefined;

    const datePart = value.slice(0, 10);
    const parsed = dayjs.utc(datePart, 'YYYY-MM-DD', true);
    return parsed.isValid() ? parsed.toISOString() : undefined;
  })
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  dept_ids: number[];
}

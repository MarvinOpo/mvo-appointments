import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

import { Gender } from '../../../prisma-appointments/client/client';
import { Transform, Type } from 'class-transformer';

export class CreateDepartmentDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @Type(() => Number)
  @IsInt()
  @Min(0)
  min_age?: number;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @Type(() => Number)
  @IsInt()
  @Max(150)
  max_age?: number;

  @IsOptional()
  @IsEnum(Gender)
  allowed_gender?: Gender;
}

import {
  IsInt,
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import type { AccessRight } from '../interfaces/access-right.interface';
import dayjs from 'dayjs';

export class UserDto {
  @Expose()
  @IsInt()
  id: number;

  @Expose()
  @IsString()
  fname: string;

  @Expose()
  @IsOptional()
  @IsString()
  mname?: string | null;

  @Expose()
  @IsString()
  lname: string;

  @Expose()
  @IsOptional()
  @IsString()
  ext_name?: string | null;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsOptional()
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
  birth_date?: string;

  @Expose()
  @IsOptional()
  @IsString()
  civil_status?: string | null;

  @Expose()
  @IsOptional()
  @IsString()
  gender?: string | null;

  @Expose()
  @IsOptional()
  @IsString()
  mobile_no?: string | null;

  @Expose()
  @Type(() => Boolean)
  @IsBoolean()
  is_activated: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  spouse_fname?: string | null;

  @Expose()
  @IsOptional()
  @IsString()
  spouse_mname?: string | null;

  @Expose()
  @IsOptional()
  @IsString()
  spouse_lname?: string | null;

  @Expose()
  @IsOptional()
  @IsString()
  spouse_ename?: string | null;

  @Expose()
  @IsOptional()
  @IsString()
  father_fname?: string | null;

  @Expose()
  @IsOptional()
  @IsString()
  father_mname?: string | null;

  @Expose()
  @IsOptional()
  @IsString()
  father_lname?: string | null;

  @Expose()
  @IsOptional()
  @IsString()
  father_ename?: string | null;

  @Expose()
  @IsOptional()
  @IsString()
  mother_fname?: string | null;

  @Expose()
  @IsOptional()
  @IsString()
  mother_mname?: string | null;

  @Expose()
  @IsOptional()
  @IsString()
  mother_lname?: string | null;

  @Expose()
  @IsOptional()
  @IsString()
  mother_ename?: string | null;

  @Expose()
  access?: AccessRight;
}

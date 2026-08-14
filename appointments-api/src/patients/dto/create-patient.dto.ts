import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsEmail,
  IsDateString,
  IsIn,
  Length,
  MaxLength,
} from 'class-validator';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export class CreatePatientDto {
  @IsOptional()
  @IsInt()
  user_id?: number;

  @IsInt()
  owner_user_id: number;

  @IsString()
  @IsIn(['Self', 'Child', 'Spouse', 'Parent', 'Sibling', 'Other'])
  relationship: string;

  @IsString()
  @MaxLength(50)
  fname: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  mname?: string;

  @IsString()
  @MaxLength(50)
  lname: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  ext_name?: string;

  @Transform(({ value }) => {
    if (typeof value !== 'string') return undefined;

    const datePart = value.slice(0, 10);
    const parsed = dayjs.utc(datePart, 'YYYY-MM-DD', true);
    return parsed.isValid() ? parsed.toISOString() : undefined;
  })
  @IsDateString()
  birth_date: string;

  @IsString()
  @IsIn(['Single', 'Married', 'Widowed', 'Separated', 'Divorced'])
  civil_status: string;

  @IsString()
  @Length(1, 1)
  @IsIn(['M', 'F'])
  sex: string;

  @IsString()
  @MaxLength(50)
  religion: string;

  @IsString()
  @MaxLength(50)
  nationality: string;

  @IsString()
  @MaxLength(150)
  occupation: string;

  @IsString()
  @MaxLength(100)
  lot_no: string;

  @IsString()
  @MaxLength(100)
  street: string;

  @IsString()
  @MaxLength(100)
  barangay: string;

  @IsString()
  @MaxLength(100)
  city: string;

  @IsString()
  @MaxLength(100)
  province: string;

  @IsString()
  @MaxLength(20)
  mobile_no: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  spouse_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  spouse_address?: string;

  @IsString()
  @MaxLength(150)
  father_name: string;

  @IsString()
  @MaxLength(150)
  mother_name: string;
}

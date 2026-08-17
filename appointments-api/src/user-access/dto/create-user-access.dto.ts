import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateUserAccessDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  dept_ids: number[];

  @IsNotEmpty()
  @IsInt()
  access_right: number;
}

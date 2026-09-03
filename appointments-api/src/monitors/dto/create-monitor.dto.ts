import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateMonitorDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  dept_ids: number[];
}

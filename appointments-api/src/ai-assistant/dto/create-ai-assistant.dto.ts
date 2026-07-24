import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAiAssistantDto {
  @IsString()
  @IsNotEmpty()
  complaint: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsIn(['Today', 'Few days', 'Few weeks', 'Few months', 'Several months'])
  duration: string;

  @IsString()
  @IsIn(['Mild', 'Moderate', 'Severe'])
  severity: string;

  @IsString()
  @IsIn(['M', 'F'])
  sex: string;

  @IsNumber()
  @Type(() => Number)
  age: number;

  @IsString()
  @IsIn(['T', 'F'])
  type: string;
}

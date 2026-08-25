import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DepartmentAiAssistantDto {
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

export class GenerateSoapDto {
  @IsString()
  @IsNotEmpty()
  chief_complaint: string;

  @IsString()
  @IsOptional()
  history_of_present_illness?: string;

  @IsString()
  @IsOptional()
  symptoms_reported?: string;

  @IsString()
  @IsOptional()
  relevant_history?: string;

  @IsString()
  @IsOptional()
  visual_audio_observations?: string;

  @IsString()
  @IsOptional()
  self_reported_vitals?: string;

  @IsString()
  @IsOptional()
  additional_notes?: string;
}

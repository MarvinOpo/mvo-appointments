import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateQueueDto {
  @IsInt()
  dept_id: number;

  @IsString()
  @IsNotEmpty()
  session_date: string;

  @IsInt()
  doctors_on_duty: number;
}

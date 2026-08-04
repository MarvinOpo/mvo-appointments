import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateQueueDto {
  @IsNumber()
  deptId: number;

  @IsString()
  @IsNotEmpty()
  date: string;
}

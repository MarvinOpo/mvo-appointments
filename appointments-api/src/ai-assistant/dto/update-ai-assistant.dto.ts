import { PartialType } from '@nestjs/mapped-types';
import { DepartmentAiAssistantDto } from './create-ai-assistant.dto';

export class UpdateDepartmentAiAssistantDto extends PartialType(
  DepartmentAiAssistantDto,
) {}

import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiAssistantService } from './ai-assistant.service';
import {
  DepartmentAiAssistantDto,
  GenerateSoapDto,
} from './dto/create-ai-assistant.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Permissions } from 'src/auth/auth.decorator';

@Controller('ai-assistant')
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) {}

  @UseGuards(AuthGuard)
  @Post('department')
  departmentHelp(@Body() deleteAiAssistantDto: DepartmentAiAssistantDto) {
    return this.aiAssistantService.departmentHelp(deleteAiAssistantDto);
  }

  @UseGuards(AuthGuard)
  @Permissions('can_manage_appts')
  @Post('soap')
  generateSoap(@Body() generateSoapDto: GenerateSoapDto) {
    return this.aiAssistantService.generateSoap(generateSoapDto);
  }
}

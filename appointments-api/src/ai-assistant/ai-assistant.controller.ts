import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiAssistantService } from './ai-assistant.service';
import { CreateAiAssistantDto } from './dto/create-ai-assistant.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('ai-assistant')
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) {}

  @UseGuards(AuthGuard)
  @Post('department')
  departmentHelp(@Body() createAiAssistantDto: CreateAiAssistantDto) {
    return this.aiAssistantService.departmentHelp(createAiAssistantDto);
  }
}

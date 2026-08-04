import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('session')
  create(@Body() createQueueDto: CreateQueueDto) {
    return this.queueService.create(createQueueDto);
  }

  @Get()
  findAll() {
    return this.queueService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('sessions/today')
  findTodayQueueSession(@Query('date') date: string) {
    return this.queueService.findTodayQueueSession(date);
  }

  @Get('session')
  findQueueSession(
    @Query('deptId') deptId: string,
    @Query('date') date: string,
  ) {
    return this.queueService.findQueueSession(+deptId, date);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queueService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQueueDto: UpdateQueueDto) {
    return this.queueService.update(+id, updateQueueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.queueService.remove(+id);
  }
}

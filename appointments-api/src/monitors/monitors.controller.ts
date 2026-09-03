import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MonitorsService } from './monitors.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Permissions } from 'src/auth/auth.decorator';

@Controller('monitors')
export class MonitorsController {
  constructor(private readonly monitorsService: MonitorsService) {}

  @UseGuards(AuthGuard)
  @Permissions('can_manage_queue')
  @Post()
  create(@Body() createMonitorDto: CreateMonitorDto) {
    return this.monitorsService.create(createMonitorDto);
  }

  @UseGuards(AuthGuard)
  @Permissions('can_manage_queue')
  @Get()
  findAll() {
    return this.monitorsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Permissions('can_manage_queue')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monitorsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Permissions('can_manage_queue')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonitorDto: UpdateMonitorDto) {
    return this.monitorsService.update(+id, updateMonitorDto);
  }

  @UseGuards(AuthGuard)
  @Permissions('can_manage_queue')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monitorsService.remove(+id);
  }
}

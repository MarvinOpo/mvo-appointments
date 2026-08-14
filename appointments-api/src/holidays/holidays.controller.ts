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
import { HolidaysService } from './holidays.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Permissions } from 'src/auth/auth.decorator';

@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @UseGuards(AuthGuard)
  @Permissions('can_manange_holidays')
  @Post()
  create(@Body() createHolidayDto: CreateHolidayDto) {
    return this.holidaysService.create(createHolidayDto);
  }

  @Get()
  findAll() {
    return this.holidaysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.holidaysService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Permissions('can_manange_holidays')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHolidayDto: UpdateHolidayDto) {
    return this.holidaysService.update(+id, updateHolidayDto);
  }

  @UseGuards(AuthGuard)
  @Permissions('can_manange_holidays')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.holidaysService.remove(+id);
  }
}

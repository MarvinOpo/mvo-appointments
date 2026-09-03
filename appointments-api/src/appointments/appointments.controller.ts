import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import {
  UpdateAppointmentDto,
  UpdateAppointmentSoapDto,
} from './dto/update-appointment.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Permissions } from 'src/auth/auth.decorator';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @UseGuards(AuthGuard)
  @Permissions('can_manage_appts')
  @Get()
  findAppointmentByStatus(
    @Query('status') status: string,
    @Query('fname') fname?: string,
    @Query('lname') lname?: string,
    @Query('type') type?: string,
    @Query('schedule') schedule?: string,
  ) {
    const statusArray = status?.split(',');
    return this.appointmentsService.findAppointmentByStatus(statusArray, {
      fname,
      lname,
      type,
      schedule,
    });
  }

  @UseGuards(AuthGuard)
  @Get('mine')
  findMine(@Req() req: Request & { user: UserDto }) {
    return this.appointmentsService.findMine(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('scheduled')
  findScheduled(
    @Query('deptId') deptId: string,
    @Query('start') start: string,
    @Query('end') end: string,
    @Req() req: Request & { user: UserDto },
  ) {
    return this.appointmentsService.findScheduled(
      +deptId,
      start,
      end,
      req.user,
    );
  }

  @UseGuards(AuthGuard)
  @Permissions('can_manage_appts')
  @Get('report')
  getReport(@Query('from') from: string, @Query('to') to: string) {
    return this.appointmentsService.getReport(from, to);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Get(':id/logs')
  findLogs(@Param('id') id: string) {
    return this.appointmentsService.findLogs(+id);
  }

  @UseGuards(AuthGuard)
  @Permissions('can_manage_appts')
  @Patch(':id/approve')
  approve(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.approve(+id, updateAppointmentDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/cancel')
  cancel(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Req() req: Request & { user: UserDto },
  ) {
    return this.appointmentsService.cancel(+id, updateAppointmentDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Permissions('can_manage_appts')
  @Patch(':id/soap')
  updateSoap(
    @Param('id') id: string,
    @Body() updateAppointmentSoapDto: UpdateAppointmentSoapDto,
  ) {
    return this.appointmentsService.updateSoap(+id, updateAppointmentSoapDto);
  }

  @UseGuards(AuthGuard)
  @Permissions('can_manage_appts')
  @Patch(':id/priority')
  updatePriority(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.updatePriority(+id, updateAppointmentDto);
  }

  @UseGuards(AuthGuard)
  @Permissions('can_manage_appts')
  @Patch(':id/resched')
  resched(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.resched(+id, updateAppointmentDto);
  }
}

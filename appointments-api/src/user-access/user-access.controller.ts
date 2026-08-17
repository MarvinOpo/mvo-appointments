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
import { UserAccessService } from './user-access.service';
import { CreateUserAccessDto } from './dto/create-user-access.dto';
import { UpdateUserAccessDto } from './dto/update-user-access.dto';
import { Permissions } from 'src/auth/auth.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user-access')
export class UserAccessController {
  constructor(private readonly userAccessService: UserAccessService) {}

  @UseGuards(AuthGuard)
  @Permissions('can_manage_access')
  @Post()
  create(@Body() createUserAccessDto: CreateUserAccessDto) {
    return this.userAccessService.create(createUserAccessDto);
  }

  @UseGuards(AuthGuard)
  @Permissions('can_manage_access')
  @Get()
  findAll() {
    return this.userAccessService.findAll();
  }

  @UseGuards(AuthGuard)
  @Permissions('can_manage_access')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserAccessDto: UpdateUserAccessDto,
  ) {
    return this.userAccessService.update(+id, updateUserAccessDto);
  }

  @UseGuards(AuthGuard)
  @Permissions('can_manage_access')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAccessService.remove(+id);
  }
}

import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDto } from './dto/user.dto';
import { Permissions } from 'src/auth/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Permissions('can_manage_access')
  @Get('access-rights')
  findAccessRights() {
    return this.usersService.findAccessRights();
  }

  @UseGuards(AuthGuard)
  @Get('me')
  findUser(@Req() request: Request & { user?: UserDto }) {
    return request.user;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}

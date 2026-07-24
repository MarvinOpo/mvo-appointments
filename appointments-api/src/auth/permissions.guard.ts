import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from './auth.decorator';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) return true;

    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: UserDto }>();

    const user = req.user;

    if (!user) return false;

    const hasPermission = !!user?.access?.[requiredPermission];

    if (!hasPermission)
      throw new HttpException(
        {
          error: {
            code: 'SYSERR',
            message: 'You dont seem to have access to this feature.',
          },
        },
        401,
      );

    return true;
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

import { Request } from 'express';
import { UserDto } from 'src/users/dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { handlePrismaError } from 'src/common/utils/error-handler';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: UserDto }>();

    try {
      const token = this.extractToken(request);
      if (!token)
        throw new HttpException(
          { error: { code: 'SYSERR', message: 'Token is missing' } },
          401,
        );

      let decoded: { sub: string };

      try {
        decoded = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
      } catch (err) {
        if (err instanceof TokenExpiredError) {
          throw new HttpException(
            { error: { code: 'TOKEN_EXPIRED', message: 'Token expired' } },
            401,
          );
        }
        throw new HttpException(
          { error: { code: 'SYSERR', message: 'Token is invalid' } },
          401,
        );
      }

      const userId = Number(decoded.sub);
      const dbUser = await this.usersService.findOne(userId);
      if (!dbUser)
        throw new HttpException(
          { error: { code: 'SYSERR', message: 'User not found' } },
          401,
        );

      const user = plainToInstance(UserDto, dbUser, {
        excludeExtraneousValues: true,
      });
      request.user = user;

      if (dbUser.services_rights.length) {
        const accessRight = dbUser.services_rights[0].access_right;

        if (accessRight) {
          const access = await this.usersService.getAccess(accessRight);
          request.user.access = access ?? undefined;
        }
      }

      return true;
    } catch (err) {
      const { statusCode, response } = handlePrismaError(err);
      throw new HttpException(response, statusCode);
    }
  }

  private extractToken(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

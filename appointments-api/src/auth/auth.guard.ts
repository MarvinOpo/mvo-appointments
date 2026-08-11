import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

import { Request } from 'express';
import { UserDto } from 'src/users/dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

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

    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    let decoded: { sub: string };

    try {
      decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Token is invalid');
    }

    const userId = Number(decoded.sub);
    const dbUser = await this.usersService.findOne(userId);
    if (!dbUser) {
      throw new UnauthorizedException('User not found');
    }

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
  }

  private extractToken(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.auth?.token;
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      client.data.user = payload;
      return true;
    } catch (err: any) {
      throw new WsException(
        err.name === 'TokenExpiredError' ? 'TokenExpired' : 'Unauthorized',
      );
    }
  }
}

import { HttpException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

import { CODES } from 'src/common/constants/error-codes';
import md5 from 'md5';

import { vsmmc_services, mvo_appointments } from '../db/prisma';
import { AccessRight } from 'src/users/interfaces/access-right.interface';

import { JwtService } from '@nestjs/jwt';
import { RefreshTokenPayload } from './interfaces/jwt-payload.interface';
import { UserDto } from 'src/users/dto/user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await vsmmc_services.users.findFirst({
      where: { email },
      include: { services_rights: { where: { service_id: 5 } } },
    });

    if (!user) throw new HttpException('User not found', CODES.NOT_FOUND);

    if (md5(password) !== user.password)
      throw new HttpException('Invalid password', CODES.UNAUTHORIZED);

    let access: AccessRight | null = null;
    if (user.services_rights.length) {
      const accessId = user.services_rights[0].access_right;

      if (accessId) {
        access = await mvo_appointments.access_rights.findFirst({
          where: { id: accessId },
        });
      }
    }

    const payload = { sub: user.id, email: user.email, access };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );

    const userDto = plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });

    return {
      user: userDto,
      access,
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );

      const user = await vsmmc_services.users.findFirst({
        where: { id: payload.sub },
        include: { services_rights: { where: { service_id: 4 } } },
      });

      if (!user) throw new HttpException('User not found', CODES.NOT_FOUND);

      let access: AccessRight | null = null;
      if (user.services_rights.length) {
        const accessId = user.services_rights[0].access_right;
        if (accessId) {
          access = await mvo_appointments.access_rights.findFirst({
            where: { id: accessId },
          });
        }
      }

      const newAccessToken = await this.jwtService.signAsync(
        { sub: user.id, email: user.email, access },
        { expiresIn: '15m' },
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new HttpException('Invalid refresh token', CODES.UNAUTHORIZED);
    }
  }
}

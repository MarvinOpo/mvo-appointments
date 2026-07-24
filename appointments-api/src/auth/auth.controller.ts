import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

import type { Response, Request } from 'express';

import { CODES } from 'src/common/constants/error-codes';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, in ms
    });

    return {
      user: result.user,
      access: result.access,
      accessToken: result.accessToken,
    };
  }

  @Post('refresh')
  async refresh(@Req() req: Request) {
    const cookies = req.cookies as Record<string, string> | undefined;
    const refreshToken = cookies?.['refreshToken'];

    console.log('Ref Token', refreshToken);

    if (!refreshToken) {
      throw new HttpException('No refresh token', CODES.UNAUTHORIZED);
    }

    const result = await this.authService.refresh(refreshToken);

    return { accessToken: result.accessToken };
  }
}

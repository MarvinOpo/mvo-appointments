import { AccessRight } from 'src/users/interfaces/access-right.interface';

export interface AccessTokenPayload {
  sub: number;
  email: string;
  access: AccessRight | null;
}

export interface RefreshTokenPayload {
  sub: number;
  email: string;
}

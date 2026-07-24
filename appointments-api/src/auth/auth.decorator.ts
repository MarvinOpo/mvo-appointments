import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';

export const Permissions = (permission: string) => {
  return SetMetadata(PERMISSION_KEY, permission);
};

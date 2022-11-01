import { registerEnumType } from '@nestjs/graphql';

export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

registerEnumType(UserStatusEnum, {
  name: 'UserStatus',
});

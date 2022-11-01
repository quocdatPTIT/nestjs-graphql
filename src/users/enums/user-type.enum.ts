import { registerEnumType } from '@nestjs/graphql';

export enum UserTypeEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(UserTypeEnum, {
  name: 'UserType',
});

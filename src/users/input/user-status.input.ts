import { Field, InputType } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsUUID } from 'class-validator';

import { UserStatusEnum } from '../enums/user-status.enum';

@InputType()
export class UserStatusInput {
  @Field()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsNotEmpty()
  @IsIn([UserStatusEnum.ACTIVE, UserStatusEnum.INACTIVE])
  status: UserStatusEnum.ACTIVE | UserStatusEnum.INACTIVE;
}

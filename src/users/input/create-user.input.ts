import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

import { UserTypeEnum } from '../enums/user-type.enum';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty({ message: 'full_name is required field' })
  fullName: string;

  @Field()
  @IsNotEmpty({ message: 'Username is required field' })
  username: string;

  @Field()
  @IsNotEmpty({ message: 'Email is required field' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required field' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'Confirm password is required field' })
  confirmPassword: string;

  @Field((type) => UserTypeEnum, { nullable: true })
  userType: UserTypeEnum;
}

import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateRoleInput {
  @Field()
  @IsNotEmpty()
  code: string;

  @Field()
  @IsNotEmpty()
  displayName: string;

  @Field()
  description: string;
}

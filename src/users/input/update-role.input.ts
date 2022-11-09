import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateRoleInput {
  @Field()
  @IsNotEmpty()
  displayName: string;

  @Field()
  description: string;
}

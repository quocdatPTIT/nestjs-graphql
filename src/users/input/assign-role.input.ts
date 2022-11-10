import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class AssignRoleInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @Field((type) => [String])
  @IsNotEmpty()
  @IsArray()
  @IsUUID('all', { each: true })
  roleIds: string[];
}

import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class AssignPermissionInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  roleId: string;

  @Field((type) => [String])
  @IsNotEmpty()
  @IsArray()
  @IsUUID('all', { each: true })
  permissionIds: string[];
}

import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class ContactInput {
  @Field()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  phoneNumber: string;

  @Field({ nullable: true })
  @MaxLength(50)
  firstName: string;

  @Field({ nullable: true })
  @MaxLength(50)
  lastName: string;
}

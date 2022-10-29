import { Field, InputType } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsUUID } from 'class-validator';

import { StatusEnum } from '../enums/status.enum';

@InputType()
export class ContactStatusInput {
  @Field()
  @IsUUID()
  @IsNotEmpty()
  contactId: string;

  @Field()
  @IsNotEmpty()
  @IsIn([StatusEnum.ACTIVE, StatusEnum.INACTIVE])
  status: StatusEnum.ACTIVE | StatusEnum.INACTIVE;
}

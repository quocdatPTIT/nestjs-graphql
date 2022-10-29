import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('cm_contacts')
@ObjectType()
export class ContactEntity extends BaseEntity {
  @Column('varchar', { length: 20, name: 'phone_number' })
  @Field({ name: 'phone_number' })
  phoneNumber: string;

  @Column('varchar', { length: 50, name: 'first_name', nullable: true })
  @Field({ name: 'first_name', nullable: true })
  firstName: string;

  @Column('varchar', { length: 50, name: 'last_name', nullable: true })
  @Field({ name: 'last_name', nullable: true })
  lastName: string;
}

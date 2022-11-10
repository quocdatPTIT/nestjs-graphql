import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ default: false, nullable: true, name: 'is_deleted' })
  @Field({ name: 'is_deleted', nullable: true })
  isDeleted: boolean;

  @Column({ name: 'is_public', default: true })
  @Field({ name: 'is_public' })
  isPublic: boolean;
}

import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';

import { UserTypeEnum } from '../enums/user-type.enum';
import { RoleEntity } from './role.entity';

@Entity('cm_users')
@ObjectType()
export class UserEntity extends BaseEntity {
  @Column({ name: 'full_name' })
  @Field()
  fullName: string;

  @Column()
  @Field()
  username: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({ name: 'user_type', nullable: true })
  @Field((type) => UserTypeEnum)
  userType: UserTypeEnum;

  @Field((type) => [RoleEntity], { nullable: true })
  @ManyToMany((type) => RoleEntity)
  @JoinTable({
    name: 'cm_user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: RoleEntity[];
}

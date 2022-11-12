import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { PermissionEntity } from './permission.entity';

@Entity('cm_roles')
@ObjectType()
export class RoleEntity extends BaseEntity {
  @Column()
  @Field()
  code: string;

  @Column({ name: 'display_name' })
  @Field({ name: 'display_name' })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  @Field()
  description: string;

  @Field((type) => [PermissionEntity], { nullable: true })
  @ManyToMany((type) => PermissionEntity)
  @JoinTable({
    name: 'cm_role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: PermissionEntity[];
}

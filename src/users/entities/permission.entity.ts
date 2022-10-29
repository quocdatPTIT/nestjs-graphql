import { BaseEntity } from '../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { PermissionGroupEnum } from '../enums/permission-group.enum';

@Entity('cm_permissions')
@ObjectType()
export class PermissionEntity extends BaseEntity {
  @Column()
  @Field()
  code: string;

  @Column({ name: 'display_name' })
  @Field({ name: 'display_name' })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  @Field()
  description: string;

  @Column({ name: 'group_name' })
  @Field({ name: 'group_name' })
  permissionGroup: PermissionGroupEnum;
}

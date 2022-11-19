import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleCodeEnum } from '../../common/enums/role-code.enum';

import { PermissionEntity } from '../entities/permission.entity';
import { PermissionGroupEnum } from '../enums/permission-group.enum';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}

  async seedPermissions() {
    const permissions = [
      {
        code: RoleCodeEnum.CREATE_CONTACT,
        displayName: 'Create contact',
        description: 'Create for contact',
        permissionGroup: PermissionGroupEnum.CREATE_CONTACT,
      },
      {
        code: RoleCodeEnum.UPDATE_CONTACT,
        displayName: 'Update contact',
        description: 'Update for contact',
        permissionGroup: PermissionGroupEnum.UPDATE_CONTACT,
      },
      {
        code: RoleCodeEnum.DELETE_CONTACT,
        displayName: 'Delete contact',
        description: 'Delete for contact',
        permissionGroup: PermissionGroupEnum.DELETE_CONTACT,
      },
      {
        code: RoleCodeEnum.VIEW_CONTACT,
        displayName: 'View contact',
        description: 'Get contact',
        permissionGroup: PermissionGroupEnum.VIEW_CONTACT,
      },
      {
        code: RoleCodeEnum.CHANGE_STATUS_CONTACT,
        displayName: 'Change status contact',
        description: 'Change status contact',
        permissionGroup: PermissionGroupEnum.CHANGE_STATUS_CONTACT,
      },
      {
        code: RoleCodeEnum.ALL_PERMISSION_CONTACT,
        displayName: 'All permission for contact',
        description: 'All permission for contact',
        permissionGroup: PermissionGroupEnum.ALL_PERMISSION_CONTACT,
      },
    ];

    for (const item of permissions) {
      const dbPermission = await this.permissionRepository.findOne({
        where: {
          isDeleted: false,
          code: item.code,
        },
      });

      if (!dbPermission) {
        const newPermission = this.permissionRepository.create({ ...item });
        await this.permissionRepository.save(newPermission);
      }
    }
  }
}

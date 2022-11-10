import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from '../entities/permission.entity';
import { Repository } from 'typeorm';
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
        code: 'CREATE_CONTACT',
        displayName: 'Create contact',
        description: 'Create for contact',
        permissionGroup: PermissionGroupEnum.CREATE_CONTACT,
      },
      {
        code: 'UPDATE_CONTACT',
        displayName: 'Update contact',
        description: 'Update for contact',
        permissionGroup: PermissionGroupEnum.UPDATE_CONTACT,
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

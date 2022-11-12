import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GraphQLError } from 'graphql/error';
import { Repository } from 'typeorm';

import { RoleEntity } from '../entities/role.entity';
import { CreateRoleInput } from '../input/create-role.input';
import { UpdateRoleInput } from '../input/update-role.input';
import { AssignPermissionInput } from '../input/assign-permission.input';
import { PermissionEntity } from '../entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}

  async createRole(input: CreateRoleInput) {
    const { code, displayName, description } = input;
    await this.checkRoleCode(code);

    const newRole = new RoleEntity();
    newRole.code = code;
    newRole.description = description;
    newRole.displayName = displayName;
    newRole.isPublic = true;

    return await this.roleRepository.save(newRole);
  }

  async updateRole(roleId: string, input: UpdateRoleInput) {
    const dbRole = await this.getRoleById(roleId);

    const { description, displayName } = input;
    dbRole.displayName = displayName;
    dbRole.description = description ?? dbRole.description;

    return await this.roleRepository.save(dbRole);
  }

  async deleteRole(roleId: string) {
    const dbRole = await this.getRoleById(roleId);

    dbRole.isDeleted = true;

    return await this.roleRepository.save(dbRole);
  }

  async getAllRole() {
    return await this.roleRepository.find({
      where: {
        isDeleted: false,
      },
    });
  }

  async assignPermissions(input: AssignPermissionInput) {
    const { roleId, permissionIds } = input;
    const dbRole = await this.getRoleById(roleId);

    let permissions: PermissionEntity[] = [];

    try {
      permissions = await this.validatePermissions(permissionIds);
    } catch (err) {
      throw new GraphQLError(`${err}`);
    }

    if (permissions.length > 0) {
      await this.deleteRolePermissions(dbRole.id);

      dbRole.permissions = permissions;
    }

    return this.roleRepository.save(dbRole);
  }

  private async deleteRolePermissions(roleId: string) {
    await this.roleRepository
      .createQueryBuilder('role_permissions')
      .delete()
      .where('role_permissions.role_id = :roleId', { roleId });
  }

  private async validatePermissions(permissionIds: string[]) {
    const promise: Promise<PermissionEntity[]> = new Promise(
      async (resolve, reject) => {
        const permissions = permissionIds.map(async (id) => {
          const permission = await this.permissionRepository.findOne({
            where: {
              id,
              isDeleted: false,
            },
          });
          if (!permission) {
            reject(`Permission: ${id} not found`);
          }

          return permission;
        });
        const permissionEntities = await Promise.all(permissions);
        resolve(permissionEntities);
      },
    );
    return promise;
  }

  private async getRoleById(id: string) {
    const dbRole = await this.roleRepository.findOne({
      where: {
        id,
      },
    });

    if (!dbRole) {
      throw new GraphQLError('Role is not exists');
    }

    return dbRole;
  }

  private async checkRoleCode(code: string) {
    const dbRole = await this.roleRepository.findOne({
      where: {
        code: code,
      },
    });

    if (dbRole) {
      throw new GraphQLError('Role code is exists');
    }
  }
}

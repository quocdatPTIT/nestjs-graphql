import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GraphQLError } from 'graphql/error';
import { RoleEntity } from '../entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleInput } from '../input/create-role.input';
import { UpdateRoleInput } from '../input/update-role.input';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
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

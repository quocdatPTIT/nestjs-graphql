import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { GqlAuthGuard } from '../../auth/guards/graphql.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';

import { RoleEntity } from '../entities/role.entity';
import { RoleService } from '../services/role.service';
import { CreateRoleInput } from '../input/create-role.input';
import { UpdateRoleInput } from '../input/update-role.input';
import { AssignPermissionInput } from '../input/assign-permission.input';

@Resolver((of) => RoleEntity)
@UseGuards(GqlAuthGuard, PermissionGuard)
export class RoleResolver {
  constructor(private roleService: RoleService) {}

  // Mutation for create
  @Mutation((returns) => RoleEntity)
  async createRole(@Args('createRoleInput') createRoleInput: CreateRoleInput) {
    return await this.roleService.createRole(createRoleInput);
  }

  // Mutation for update
  @Mutation((returns) => RoleEntity)
  async updateRole(
    @Args('roleId') roleId: string,
    @Args('updateRoleInput') updateRoleInput: UpdateRoleInput,
  ) {
    return await this.roleService.updateRole(roleId, updateRoleInput);
  }

  // Mutation for delete - soft delete
  @Mutation((returns) => RoleEntity)
  async deleteRole(@Args('roleId') roleId: string) {
    return await this.roleService.deleteRole(roleId);
  }

  // Query for get all
  @Query((returns) => [RoleEntity])
  async getAllRole() {
    return await this.roleService.getAllRole();
  }

  @Mutation((returns) => RoleEntity)
  async assignPermissions(
    @Args('assignPermissionInput') assignPermissionInput: AssignPermissionInput,
  ) {
    return await this.roleService.assignPermissions(assignPermissionInput);
  }
}

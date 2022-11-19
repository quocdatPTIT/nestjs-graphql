import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GraphQLError } from 'graphql/error';

import { PasswordUtils } from '../../common/utils/password.utils';

import { UserEntity } from '../entities/user.entity';
import { RoleEntity } from '../entities/role.entity';
import { UserStatusEnum } from '../enums/user-status.enum';
import { CreateUserInput } from '../input/create-user.input';
import { UserStatusInput } from '../input/user-status.input';
import { UpdateUserInput } from '../input/update-user.input';
import { AssignRoleInput } from '../input/assign-role.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async createUser(createUserInput: CreateUserInput) {
    const { fullName, username, email, password, confirmPassword, userType } =
      createUserInput;

    if (password !== confirmPassword) {
      throw new GraphQLError('Password mismatches');
    }

    const dbUser = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (dbUser) {
      throw new GraphQLError(`Username ${username} is exists`);
    }

    const newUser = new UserEntity();
    newUser.fullName = fullName;
    newUser.username = username;
    newUser.email = email;
    newUser.password = await PasswordUtils.hashing(password);
    newUser.email = email;
    newUser.userType = userType;

    return await this.userRepository.save(newUser);
  }

  async updateUser(userId: string, updateUserInput: UpdateUserInput) {
    const { username, password, confirmPassword, fullName, email } =
      updateUserInput;

    if (password !== confirmPassword) {
      throw new GraphQLError('Password mismatches');
    }
    const dbUser = await this.getUserById(userId);

    dbUser.fullName = fullName || dbUser.fullName;
    dbUser.username = username || dbUser.username;
    dbUser.email = email || dbUser.email;
    dbUser.password =
      (await PasswordUtils.hashing(password)) || dbUser.password;

    return await this.userRepository.save(dbUser);
  }

  async changeUserStatus(userStatusInput: UserStatusInput) {
    const { userId, status } = userStatusInput;
    const dbUser = await this.getUserById(userId);

    switch (status) {
      case UserStatusEnum.ACTIVE:
        dbUser.isPublic = true;
        break;
      case UserStatusEnum.INACTIVE:
        dbUser.isPublic = false;
        break;
      default:
        break;
    }

    return await this.userRepository.save(dbUser);
  }

  async getUsers() {
    return await this.userRepository.find({
      where: {
        isDeleted: false,
        isPublic: true,
      },
    });
  }

  async assignRoles(input: AssignRoleInput) {
    const { userId, roleIds } = input;
    const dbUser = await this.getUserById(userId);

    let roles: RoleEntity[] = [];

    try {
      roles = await this.validateRoles(roleIds);
    } catch (err) {
      throw new GraphQLError(`${err}`);
    }

    if (roles.length > 0) {
      await this.deleteUserRoles(dbUser);
      dbUser.roles = roles;
    }

    return this.userRepository.save(dbUser);
  }

  private async deleteUserRoles(user: UserEntity) {
    user.roles = [];

    await this.userRepository.save(user);
  }

  private async validateRoles(roleIds: string[]) {
    const promise: Promise<RoleEntity[]> = new Promise(
      async (resolve, reject) => {
        const roles = roleIds.map(async (id) => {
          const role = await this.roleRepository.findOne({
            where: {
              id,
              isDeleted: false,
            },
          });
          if (!role) {
            reject(`Role: ${id} not found`);
          }

          return role;
        });
        const roleEntities = await Promise.all(roles);
        resolve(roleEntities);
      },
    );
    return promise;
  }

  private async getUserById(id: string) {
    const dbUser = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!dbUser) {
      throw new GraphQLError('User is not exists');
    }

    return dbUser;
  }
}

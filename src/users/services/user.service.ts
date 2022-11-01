import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../entities/user.entity';
import { CreateUserInput } from '../input/create-user.input';
import { GraphQLError } from 'graphql/error';
import { UpdateUserInput } from '../input/update-user.input';
import { UserStatusEnum } from '../enums/user-status.enum';
import { UserStatusInput } from '../input/user-status.input';
import { PasswordUtils } from '../../common/utils/password.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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
    newUser.password = await PasswordUtils.hashPassword(password);
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
      (await PasswordUtils.hashPassword(password)) || dbUser.password;

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

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { CreateUserInput } from '../input/create-user.input';
import { UpdateUserInput } from '../input/update-user.input';
import { UserStatusInput } from '../input/user-status.input';

@Resolver((of) => UserEntity)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation((returns) => UserEntity)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.userService.createUser(createUserInput);
  }

  @Mutation((returns) => UserEntity)
  async updateUser(
    @Args('userId') userId: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return await this.userService.updateUser(userId, updateUserInput);
  }

  @Mutation((returns) => UserEntity)
  async changeUserStatus(
    @Args('userStatusInput') userStatusInput: UserStatusInput,
  ) {
    return await this.userService.changeUserStatus(userStatusInput);
  }

  @Query((returns) => [UserEntity])
  async getUsers() {
    return await this.userService.getUsers();
  }
}

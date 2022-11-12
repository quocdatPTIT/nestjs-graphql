import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './../services/user.service';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':userId')
  async getRoleForUser(@Param('userId') userId: string) {
    const data = await this.userService.getUserPermissions(userId);
    return data;
  }
}

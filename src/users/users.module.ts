import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';
import { UserResolver } from './resolvers/user.resolver';
import { RoleEntity } from './entities/role.entity';
import { RoleService } from './services/role.service';
import { RoleResolver } from './resolvers/role.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  providers: [UserService, UserResolver, RoleService, RoleResolver],
})
export class UsersModule {}

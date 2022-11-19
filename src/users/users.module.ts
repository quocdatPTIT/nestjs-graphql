import { UserController } from './controllers/user.controller';
import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';
import { UserResolver } from './resolvers/user.resolver';
import { RoleEntity } from './entities/role.entity';
import { RoleService } from './services/role.service';
import { RoleResolver } from './resolvers/role.resolver';
import { PermissionEntity } from './entities/permission.entity';
import { PermissionService } from './services/permission.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UserController],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity]),
  ],
  providers: [
    UserService,
    UserResolver,
    RoleService,
    RoleResolver,
    PermissionService,
  ],
})
export class UsersModule implements OnModuleInit {
  constructor(private permissionService: PermissionService) {}
  async onModuleInit() {
    await this.permissionService.seedPermissions();
  }
}

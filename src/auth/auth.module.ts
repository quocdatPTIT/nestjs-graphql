import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserEntity } from '../users/entities/user.entity';
import { RoleEntity } from '../users/entities/role.entity';
import { PermissionEntity } from '../users/entities/permission.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity]),
  ],
})
export class AuthModule {}

import { PermissionGuard } from './guards/permission.guard';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserEntity } from '../users/entities/user.entity';
import { RoleEntity } from '../users/entities/role.entity';
import { PermissionEntity } from '../users/entities/permission.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt.guard';
import { GqlAuthGuard } from './guards/graphql.guard';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    GqlAuthGuard,
    PermissionGuard,
  ],
  imports: [
    JwtModule.register({
      secret: 'dattq.bank',
      signOptions: {
        expiresIn: '15min',
      },
    }),
    TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity]),
  ],
  exports: [AuthService],
})
export class AuthModule {}

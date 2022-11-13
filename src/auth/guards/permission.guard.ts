import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import MetadataConstant from '../../common/constant/metadata.constant';

import { AuthService } from './../services/auth.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Logic
    const ctx = GqlExecutionContext.create(context);

    const { user } = ctx.getContext().req;
    console.log(user);

    if (!user) {
      throw new UnauthorizedException('Invalid User');
    }

    const permissionName = this.reflector.get<string>(
      MetadataConstant.PERMISSION,
      context.getHandler(),
    );

    const dbPermissions = await this.authService.getUserPermissions(user.id);

    if (!dbPermissions.some((p) => p === permissionName)) {
      throw new ForbiddenException('Access Denied');
    }

    return true;
  }
}

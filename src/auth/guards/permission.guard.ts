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

    const accessMethod = this.reflector.get<string>(
      MetadataConstant.PERMISSION,
      context.getHandler(),
    );

    const accessClass = this.reflector.get<string>(
      MetadataConstant.PERMISSION,
      context.getClass(),
    );

    const dbPermissions = await this.authService.getUserPermissions(user.id);

    if (accessMethod && !dbPermissions.some((p) => p === accessMethod)) {
      throw new ForbiddenException('Access Denied');
    }

    if (accessClass && !dbPermissions.some((p) => p === accessClass)) {
      throw new ForbiddenException('Access Denied');
    }

    return true;
  }
}

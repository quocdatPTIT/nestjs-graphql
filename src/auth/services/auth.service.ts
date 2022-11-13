import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';

import { LoginDto } from '../dtos/login.dto';
import { PasswordUtils } from '../../common/utils/password.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async login({ username, password }: LoginDto) {
    const dbUser = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (!dbUser) {
      throw new UnauthorizedException();
    }

    if (!dbUser.isPublic) {
      throw new UnauthorizedException();
    }

    if (!(await PasswordUtils.hashCompare(password, dbUser.password))) {
      throw new UnauthorizedException();
    }

    const payload = {
      userId: dbUser.id,
      username: dbUser.username,
      fullName: dbUser.fullName,
      userType: dbUser.userType,
      email: dbUser.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getUserByJwt(userId: string) {
    return await this.userRepository.findOne({
      where: {
        id: userId,
        isDeleted: false,
        isPublic: true,
      },
      select: ['id', 'fullName', 'email', 'username', 'userType'],
    });
  }

  async getUserPermissions(userId: string) {
    const queryResult = await this.dataSource
      .createQueryBuilder('cm_users', 'u')
      .where('u.id = :userId', { userId })
      .select('p.code as p_code')
      .groupBy('p.code, u.id')
      .innerJoin('cm_user_roles', 'us', 'u.id = us.user_id')
      .innerJoin('cm_role_permissions', 'rp', 'rp.role_id = us.role_id')
      .innerJoin('cm_permissions', 'p', 'p.id = rp.permission_id')
      .getRawMany();

    return queryResult.map((item) => item['p_code']);
  }
}

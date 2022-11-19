import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';
import { PasswordUtils } from '../../common/utils/password.utils';

import { LoginDto } from '../dtos/login.dto';
import { JwtPayloadDto } from '../dtos/jwt-payload.dto';

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

    const payloadRefreshToken = {
      ...payload,
      refreshToken: true,
    };

    const refreshToken = await this.jwtService.signAsync(payloadRefreshToken, {
      expiresIn: '1d',
    });

    dbUser.refreshToken = await PasswordUtils.hashing(refreshToken);

    await this.userRepository.save(dbUser);

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: refreshToken,
    };
  }

  async logout(user: JwtPayloadDto) {
    const dbUser = await this.userRepository.findOne({
      where: {
        id: user.userId,
      },
    });

    if (!dbUser) {
      throw new InternalServerErrorException('Not found user');
    }

    dbUser.refreshToken = null;
    await this.userRepository.save(dbUser);
    return {
      message: 'Logout successful',
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.decode(token) as JwtPayloadDto;

      const dbUser = await this.userRepository.findOne({
        where: {
          id: payload.userId,
          username: payload.username,
          isDeleted: false,
          isPublic: true,
        },
      });

      if (!dbUser) {
        throw new UnauthorizedException('User not found');
      }

      const hashedRefreshToken = dbUser.refreshToken;

      if (hashedRefreshToken) {
        throw new UnauthorizedException();
      }

      if (!(await PasswordUtils.hashCompare(token, hashedRefreshToken))) {
        throw new UnauthorizedException();
      }

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (e) {
      throw new UnauthorizedException('Expired Refresh Token');
    }
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

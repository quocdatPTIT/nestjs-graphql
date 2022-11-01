import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';

import { LoginDto } from '../dtos/login.dto';
import { PasswordUtils } from '../../common/utils/password.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
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
      username: dbUser.username,
      fullName: dbUser.fullName,
      userType: dbUser.userType,
      email: dbUser.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

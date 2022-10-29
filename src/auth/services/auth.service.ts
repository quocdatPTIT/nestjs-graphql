import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';

import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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

    if (dbUser.password !== password) {
      throw new UnauthorizedException();
    }

    return dbUser;
  }
}

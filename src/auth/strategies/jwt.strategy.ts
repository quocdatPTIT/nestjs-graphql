import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayloadDto } from '../dtos/jwt-payload.dto';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'dattq.bank',
    });
  }

  async validate(payload: JwtPayloadDto) {
    if (payload.refreshToken) {
      throw new UnauthorizedException();
    }
    const { userId } = payload;

    const user = await this.authService.getUserByJwt(userId);

    if (!userId) {
      throw new UnauthorizedException();
    }

    if (!user.refreshToken) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

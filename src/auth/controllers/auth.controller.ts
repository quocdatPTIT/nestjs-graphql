import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';

import { LoginDto } from '../dtos/login.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AuthService } from '../services/auth.service';
import { JwtPayloadDto } from '../dtos/jwt-payload.dto';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  profile(@User() user: JwtPayloadDto) {
    return user;
  }

  @Get('/logout')
  @UseGuards(JwtAuthGuard)
  logout(@User() user: JwtPayloadDto) {
    return this.authService.logout(user);
  }

  @Post('/refresh-token')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}

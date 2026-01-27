import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, signupDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import type { Response } from 'express';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  // @Throttle({ default: { limit: 3, ttl: 60000 } })
  @SkipThrottle()
  async create(
    @Body() signupDto: signupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.create(signupDto);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
    });

    return { message: 'Signup successfully', accessToken };
    // return this.authService.create(signupDto);
  }

  @Post('login')
  // @Throttle({ default: { limit: 3, ttl: 60000 } })
  @SkipThrottle()
  async login(
    @Body() LoginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.login(LoginDto);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false, // true in prod
      // sameSite: 'lax',
    });

    return { accessToken, message: 'Logged in successfully' };
  }

  @UseGuards(AuthGuard)
  @Delete('logout')
  async Logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
    });

    return { message: 'Logout Successfully' };
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @SkipThrottle()
  async userProfile(@Request() req) {
    const userId = req.user.sub;
    const user = await this.userService.getUserProfile(userId);
    return user;
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto, signupDto } from './dto/auth.dto';
import bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    readonly jwtService: JwtService,
  ) {}

  async create(signupDto: signupDto) {
    const hash = await bcrypt.hash(signupDto.password, 10);

    const user = await this.userService.createUser({
      ...signupDto,
      password: hash,
    });

    const payload = { sub: user._id, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
    };
  }

  async login(LoginDto: LoginDto) {
    const { password } = LoginDto;
    const user = await this.userService.login(LoginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload = { sub: user._id, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
    };
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role, type userProfileDto } from './types/user.type';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from './role.guard';
import { Roles } from './role.decrorator';
import { SkipThrottle } from '@nestjs/throttler';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getAllUsers')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @SkipThrottle()
  findAllUsers() {
    return this.userService.getAllUsers();
  }

  @Patch('updateDetails')
  @UseGuards(AuthGuard)
  updateOne(@Body() UpdateUserDto: UpdateUserDto, @Req() req) {
    const userId = req.user.sub;
    return this.userService.updateUserDetails(UpdateUserDto, userId);
  }
}

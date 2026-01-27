import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userProfileDto } from './types/user.type';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto, signupDto } from 'src/auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(signupDto: signupDto) {
    try {
      return await this.userModel.create({
        firstName: signupDto.firstName,
        lastName: signupDto.lastName,
        email: signupDto.email,
        password: signupDto.password,
      });
    } catch (error) {
      throw new Error('Invalid Credentials');
    }
  }

  async login(LoginDto: LoginDto) {
    const { email } = LoginDto;
    return await this.userModel.findOne({ email }).select('+password');
  }

  async logoutUser() {}

  async getUserProfile(userId: string) {
    return await this.userModel.findOne({ _id: userId }).select('-password');
  }

  async getAllUsers() {
    const [totalUsers, totalAdmins] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ role: 'Admin' }),
    ]);

    return {
      totalUsers,
      totalAdmins,
    };
  }

  async updateUserDetails(updateUserDto: UpdateUserDto, userId: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateUserDto },
      // $set: updateUserDto ==>> Update only the fields present in updateUserDto without replacing the entire document.
      { new: true, runValidators: true },
      // runValidators: true ==>> tells Mongoose to apply your schema rules (e.g., required, min, max, enum, match, validate) to the update payload.
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }
}

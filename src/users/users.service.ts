import { User, UserDocument } from './users.model';
import { CreateUserDto } from './dto/create-user-dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(dto);
    return createdUser.save();
  }

  async getAllUsers() {
    return this.userModel.find().exec();
  }

  async getUserByEmail(email: string) {
    return this.userModel.findOne({
      email,
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    // Check if the user already exists
    if (existingUser) {
      throw new NotFoundException('User already exists');
    }
    const res = await user.save();
    return res;
  }

  async findAll() {
    const users = await this.userModel.find();
    if (!users) {
      throw new NotFoundException('Users not found');
    }
    return users;
  }

  async findOne(email: string) {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log('user', user);
    console.log('updateUserDto', updateUserDto);
    const updateFields = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(updateUserDto).filter(([_, value]) => value !== undefined),
    );
    const res = await this.userModel.updateOne(
      { email },
      { $set: updateFields },
    );
    if (!res) {
      throw new NotFoundException('User not found');
    }
    if (!res.acknowledged) {
      throw new Error('Update operation not acknowledged by the database');
    }

    return `This action updates a #${email} user`;
  }

  async remove(email: string) {
    const res = await this.userModel.deleteOne({ email: email });
    if (!res) {
      throw new NotFoundException('User not found');
    }
    if (res.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }

    return `This action removes a #${email} user`;
  }
}

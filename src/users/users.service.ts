import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
      throw new NotFoundException('No se encontrarón usuarios');
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
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('No existe el usuario');
      }

      const updateFields = Object.fromEntries(
        Object.entries(updateUserDto).filter(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_, value]) => value !== undefined,
        ),
      );

      const res = await this.userModel.updateOne(
        { email },
        { $set: updateFields },
      );

      if (!res || res.matchedCount === 0) {
        throw new NotFoundException('No se encontró usuario para actualizar');
      }

      if (!res.acknowledged) {
        throw new InternalServerErrorException(
          'Operación de actualización no reconocida por la base de datos',
        );
      }

      return `Se actualizar el usuario #${email}`;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error while updating user');
    }
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

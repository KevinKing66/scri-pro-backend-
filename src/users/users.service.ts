import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findAll(filter: string = '', page: number = 1, limit: number = 10) {
    const query = {
      $or: [
        { name: new RegExp(filter, 'i') },
        { lastName: new RegExp(filter, 'i') },
        { email: new RegExp(filter, 'i') },
        { code: new RegExp(filter, 'i') },
      ],
    };

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userModel.find(query).skip(skip).limit(limit),
      this.userModel.countDocuments(query),
    ]);

    if (!data || data.length === 0) {
      throw new NotFoundException('No se encontraron usuarios');
    }

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
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

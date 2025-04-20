import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: RegisterDto) {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new NotFoundException('User already exists');
    }
    const { password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    const res = await user.save();
    return res;
  }

  async validateUser(login: LoginDto): Promise<LoginDto> {
    const { email, password } = login;
    const user = await this.userModel.findOne({ email });
    // console.log('Usuario encontrado: ', user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.status) {
      throw new UnauthorizedException('User is inactive');
    }
    if (!password) {
      throw new UnauthorizedException('Password is required');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    user.password = undefined; // Exclude password from the login object

    const res = { ...user.toObject(), password: undefined }; // Exclude password from the returned object
    console.log('Usuario res: ', res);
    return res;
  }
}

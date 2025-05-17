import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ChangePassword } from './dto/change-password.dto';
import { ForgotPassword } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService, // Ensure JwtService is properly injected and typed
  ) {}

  async create(createUserDto: RegisterDto) {
    try {
      let existingUser = await this.userModel.findOne({
        email: createUserDto.email,
      });
      if (existingUser) {
        throw new BadRequestException('Ya existe un usuario con este email');
      }

      existingUser = await this.userModel.findOne({
        code: createUserDto.code,
      });
      if (existingUser) {
        throw new BadRequestException('Ya existe un usuario con este código');
      }

      const { password } = createUserDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });

      const res = await user.save();

      if (!res) {
        throw new InternalServerErrorException('Falló la creación del usuario');
      }

      return res;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      console.log(error);
      throw new InternalServerErrorException(
        'Hubo un error intentando crear el usuario',
      );
    }
  }

  async ChangePassword(data: ChangePassword) {
    const { email, _id, newPassword } = data;
    if (_id) {
      await this.userModel.updateOne(
        { _id },
        { $set: { password: newPassword } },
      );
      return { successful: true };
    }
    if (email && !_id) {
      await this.userModel.updateOne(
        { email },
        { $set: { password: newPassword } },
      );
      return { successful: true };
    }
    return { successful: false };
  }

  async forgotPassword(data: ForgotPassword) {
    const { email, newPassword } = data;
    if (!email) {
      throw new NotFoundException('Email is required');
    }
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userModel.updateOne(
      { email },
      { $set: { password: newPassword } },
    );
    return { successful: true };
  }

  async validateUser(login: LoginDto): Promise<LoginDto> {
    const { email, password } = login;
    const user = await this.userModel.findOne({ email });
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
    return res;
  }
  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: any }> {
    if (!this.jwtService) {
      throw new UnauthorizedException('JWT service is not available');
    }
    // Validar las credenciales del usuario
    const user = await this.validateUser(loginDto);

    // Crear el payload para el token JWT
    const payload = { email: user.email, sub: user._id };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '72h',
    });
    // Retornar el token y todos los datos del usuario
    return {
      access_token, // Safely access and handle potential undefined
      user, // Retorna los datos completos del usuario
    };
  }
}

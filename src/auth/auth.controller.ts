import { Controller, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePassword } from './dto/change-password.dto';
import { ForgotPassword } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  Register(@Body() createAuthDto: RegisterDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const data = await this.authService.login(loginDto);
    const token = data?.access_token;
    res.setHeader('Authorization', `Bearer ${token}`);
    return res.status(HttpStatus.OK).json(data);
  }

  @Post('change-password')
  changePassword(@Body() changePasswordDto: ChangePassword) {
    return this.authService.ChangePassword(changePasswordDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPassword) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
}

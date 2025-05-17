import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  name?: string | undefined;
  lastName?: string | undefined;
  code?: string | undefined;
  password?: string | undefined;
  phone?: string | undefined;
  researchGroup?: { code: string; name: string }[] | undefined;
  role?: 'STUDENT' | 'TEACHER' | 'ADMIN' | undefined;
  status?: 'ACTIVE' | 'INACTIVE' | undefined;
}

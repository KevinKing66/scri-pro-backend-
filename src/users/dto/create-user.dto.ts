export class CreateUserDto {
  email: string;
  code: string; //Studen code or teacher code
  name: string;
  lastName: string;
  password: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  researchGroupId: number;
  status: 'ACTIVE' | 'INACTIVE';
  docNum: string;
  docType: string;
  phone: string;
}

export class UserDto {
  _id: string;
  email: string;
  code?: string;
  phone?: string;
  researchGroup?: { code: string; name: string }[];
  role: string;
  status: boolean;
}

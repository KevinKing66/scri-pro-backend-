export class UserDto {
  _id: string;
  email: string;
  code?: string;
  phone?: string;
  researchGroups?: { code: string; name: string }[];
  role: string;
  status: boolean;
}

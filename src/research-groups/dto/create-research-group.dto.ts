export class CreateResearchGroupDto {
  code: string;
  name: string;
  description: string;
  admin?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

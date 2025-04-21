export class CreateProjectDto {
  code: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  researchGroupId: number;
  adminId?: number; // Optional field for admin ID
}

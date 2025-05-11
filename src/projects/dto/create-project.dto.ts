import { CreateEvidenceDto } from 'src/evidences/dto/create-evidence.dto';

export class CreateProjectDto {
  code: string;
  imageUrl: string;
  name: string;
  type?: string;
  evidences: CreateEvidenceDto[];
  description: string;
  creationDateTime: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  members: { email: string; name: string }[];
  researchGroupId: number;
  adminId?: { email: string; name: string };
}

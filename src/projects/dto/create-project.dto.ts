import { CreateEvidenceDto } from 'src/evidences/dto/create-evidence.dto';
import { CreateFileInfoDTO } from 'src/shared/dto/create-file.dto';
import { MemberDTO } from 'src/shared/dto/member.dto';

export class CreateProjectDto {
  code: string;
  image?: CreateFileInfoDTO;
  name: string;
  type?: string;
  evidences: CreateEvidenceDto[];
  description: string;
  creationDateTime?: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  members: MemberDTO[];
  researchGroup: { code: string; name: string };
  adminId: MemberDTO;
}

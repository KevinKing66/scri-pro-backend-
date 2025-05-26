import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { CreateFileInfoDTO } from 'src/shared/dto/create-file.dto';
import { CreateEvidenceDto } from 'src/evidences/dto/create-evidence.dto';
import { MemberDTO } from 'src/shared/dto/member.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  code?: string | undefined;
  name?: string | undefined;
  type?: string | undefined;
  image?: CreateFileInfoDTO | undefined;
  evidences?: CreateEvidenceDto[] | undefined;
  members?: MemberDTO[] | undefined;
  description?: string | undefined;
  status?: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | undefined;
  researchGroups?: { code: string; name: string } | undefined;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { CreateFileInfoDTO } from 'src/shared/dto/create-file.dto';
import { CreateEvidenceDto } from 'src/evidences/dto/create-evidence.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  code?: string | undefined;
  name?: string | undefined;
  image?: CreateFileInfoDTO;
  evidences?: CreateEvidenceDto[];
  description?: string | undefined;
  status?: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | undefined;
  researchGroups?: { code: string; name: string } | undefined;
  endDate?: Date | undefined;
}

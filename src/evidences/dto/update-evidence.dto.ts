import { PartialType } from '@nestjs/mapped-types';
import { CreateEvidenceDto } from './create-evidence.dto';

export class UpdateEvidenceDto extends PartialType(CreateEvidenceDto) {
  code?: string | undefined;
  name?: string | undefined;
  description?: string | undefined;
  status?: 'ACTIVE' | 'DESACTIVE' | undefined;
  projectCode?: string | undefined;
  researchGroupCode?: string | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
}
